import { connection } from "../database/db.js";

export async function getCategories(req, res) {
    try {
        const categories = await connection.query("SELECT * FROM categories;");
        return res.status(200).send(categories.rows);

    } catch (err) {
        res.sendStatus(500);
    }

}

export async function setCategories(req, res) {
    const { name } = req.body;

    try {
        const category = await connection.query('SELECT * FROM categories WHERE "name" = ($1);', [name]);
        console.log(category.rows);

        if (category.rows.length > 0) {
            return res.status(409).send("Category already exists");
        } else {
            const newCategory = await connection.query("INSERT INTO categories (name) VALUES ($1);", [name]);
            return res.sendStatus(201);
        }

    } catch (err) {
        res.sendStatus(500);
    }

}