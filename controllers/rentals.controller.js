import dayjs from "dayjs";
import { connection } from "../database/db.js";


export async function getRentals(req, res) {
    //let { customerId, gameId } = req.query; // lembrar de testar isNan

    try {
        const rentals = await connection.query(`
        SELECT rentals.*, 
        customers.id, customers.name as "customerName",
        games.id, games.name, games."categoryId",
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

        return res.status(200).send(rentalObj);
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

        return res.sendStatus(201);

    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }

}