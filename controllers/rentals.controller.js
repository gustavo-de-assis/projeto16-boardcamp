import dayjs from "dayjs";
import { connection } from "../database/db.js";


export async function setRentals(req, res) {
    const { customerId, gameId, daysRented } = req.body;
    
    try {
        const game = await connection.query("SELECT * FROM games WHERE id = ($1)", [gameId]);
        if(game.rows.length === 0){
            return res.status(400).send("Game not Found!");
        }
        if(game.rows[0].stockTotal === 0){
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
    
        console.log(rented.rows[0]);
        
        return res.sendStatus(201);

    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }

}