import { connection } from "../database/db.js";

export async function getCategories(req, res) {
    try {
        const categories = await connection.query("SELECT * FROM categories;");
        return res.status(200).send(categories.rows[0]);

    } catch (err) {
        res.sendStatus(500);
    }

}

export async function setCategories(req, res) {
    const { name } = req.body;

    try {
        const category = await connection.query("INSERT INTO categories (name) VALUES ($1);", [name]);
        return res.sendStatus(201);

    } catch (err) {
        res.sendStatus(500);
    }

}