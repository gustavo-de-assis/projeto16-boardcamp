import { connection } from "../database/db.js";

export async function setCustomers(req, res) {
    const { name, phone, cpf, birthday } = req.body;

    try {
        const customer = await connection.query('SELECT * FROM customers WHERE "cpf" = ($1);', [cpf]);
        console.log(customer.rows);

        if (customer.rows.length > 0) {
            return res.status(409).send("Customer already exists");
        } else {
            await connection.query("INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4);", [name, phone, cpf, birthday]);
            return res.sendStatus(201);
        }

    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }

}