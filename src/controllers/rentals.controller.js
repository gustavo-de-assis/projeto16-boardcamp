import dayjs from "dayjs";
import { connection } from "../database/db.js";


export async function getRentals(req, res) {
    const { gameId, customerId } = req.query // lembrar de testar isNan

    try {
        let rentals = await connection.query(`
        SELECT rentals.*, 
        customers.id AS "customerId", customers.name as "customerName",
        games.id AS "gameId", games.name, games."categoryId",
        categories.name AS "categoryName" FROM 
        rentals JOIN customers ON rentals."customerId" = customers.id
        JOIN games ON rentals."gameId" = games.id JOIN categories ON games."categoryId" = categories.id;
        `);

        const rentalObj = rentals.rows.map((r) => {
            const attributes = { ...r };
            const obj = {
                id: attributes.id,
                customerId: attributes.customerId,
                gameId: attributes.gameId,
                rentDate: attributes.rentDate,
                daysRented: attributes.daysRented,
                returnDate: attributes.returnDate,
                originalPrice: attributes.originalPrice,
                delayFee: attributes.delayFee,
                customer: {
                    id: attributes.customerId,
                    name: attributes.customerName
                },
                game: {
                    id: attributes.gameId,
                    name: attributes.name,
                    categoryId: attributes.categoryId,
                    categoryName: attributes.categoryName
                }
            }

            return obj;
        });

        rentals = [...rentalObj];

        if (!isNaN(customerId)) {
            rentals = rentalObj.filter((c) => c.customerId == customerId);
        }

        if (!isNaN(gameId)) {
            rentals = rentals.filter((g) => g.gameId == gameId);
        }

        return res.status(200).send(rentals);
    }
    catch (err) {
        console.log(err);
        return res.status(500);
    }

}

export async function setRentals(req, res) {
    const { customerId, gameId, daysRented } = req.body;

    try {
        const game = await connection.query("SELECT * FROM games WHERE id = ($1)", [gameId]);
        if (game.rows.length === 0) {
            return res.status(400).send("Game not Found!");
        }
        if (game.rows[0].stockTotal === 0) {
            return res.status(400).send("No units available to rent!");
        }

        const customer = await connection.query('SELECT * FROM customers WHERE id = ($1);', [customerId]);
        if (customer.rows.length === 0) {
            return res.status(400).send("Customer not Found!");
        }

        const newStock = games.rows[0].stockTotal -1;

        const rentDate = dayjs().format("YYYY/MM/DD");
        const originalPrice = daysRented * (game.rows[0].pricePerDay);
        const returnDate = null;
        const delayFee = null;


        const rented = await connection.query(`
        INSERT INTO rentals 
        ("customerId", "gameId", "rentDate", 
        "daysRented", "returnDate", 
        "originalPrice", "delayFee")
        VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [customerId, gameId, rentDate, daysRented, returnDate, originalPrice, delayFee]);
        await (`UPDATE games SET stockTotal = ($1) WHERE id = ($2)`, [newStock, gameId]);
        return res.sendStatus(201);

    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }

}

export async function returnRentals(req, res) {
    const { id } = req.params;
    const returnDate = dayjs();

    try {
        const rental = await connection.query("SELECT * FROM rentals WHERE id = ($1)", [id]);

        if (rental.rows.length === 0) {
            return res.status(404).send("Rental not Found!");
        }
        if (rental.rows[0].returnDate) {
            return res.status(400).send("Game already returned!");
        }

        const game = await connection.query(`
        SELECT "pricePerDay" 
        FROM games 
        WHERE id = ($1)`, [rental.rows[0].gameId]);

        const rentalDate = rental.rows[0].rentDate;
        const duration = returnDate.diff(rentalDate, 'day');

        const delayFee = (duration - rental.rows[0].daysRented) * game.rows[0].pricePerDay;
        console.log("atraso", delayFee);

        if (delayFee > 0) {
            await connection.query(`UPDATE rentals SET "delayFee"=($1) WHERE id = ($2);`, [delayFee, id]);
        } else {
            await connection.query(`UPDATE rentals SET "delayFee"=0 WHERE id = ($1);`, [id]);
        }

        await connection.query(`UPDATE rentals SET "returnDate"=($1) WHERE id = ($2);`, [returnDate, id])

        return res.sendStatus(200);

    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }

}

export async function deleteRentals(req, res) {
    const { id } = req.params;

    try{
        const rental = await connection.query("SELECT * FROM rentals WHERE id = ($1)", [id]);

        if (rental.rows.length === 0) {
            return res.status(404).send("Rental not Found!");
        }
        if (rental.rows[0].returnDate) {
            return res.status(400).send("Game already returned!");
        }

        await connection.query(`DELETE FROM rentals WHERE id = ($1);`,[id]);

        return res.sendStatus(200);

    } catch(err) {
        console.log(err);
        res.sendStatus(500);
    }
}