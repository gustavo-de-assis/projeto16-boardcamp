import { connection } from "../database/db.js";

export async function getGames(req, res) {

    const name = req.query.name;
    let games;

    try {
        if (name) {
            games = await connection.query(`SELECT games.*, 
            categories.name AS categoryName
            FROM games 
            JOIN categories 
            ON games."categoryId" = categories.id 
            WHERE (games.name) 
            ILIKE '${name}%';`);
        } else {
            games = await connection.query(`SELECT games.*, 
            categories.name AS categoryName 
            FROM games 
            JOIN categories 
            ON games."categoryId" = categories.id;`);
        }

        return res.status(200).send(games.rows);

    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }

}

export async function setGames(req, res) {
    const { name, image, stockTotal, categoryId, pricePerDay } = req.body;

    try {
        const category = await connection.query(`SELECT * 
        FROM categories WHERE id = ($1);`, [categoryId]);

        const game = await connection.query(`SELECT * 
        FROM games 
        WHERE "name" = ($1);`, [name]);

        console.log("category", category.rows);
        console.log("game", game.rows);

        if (category.rows.length === 0) {
            return res.status(400).send("This category doesn't exists!");
        } else if (game.rows.length > 0) {
            return res.status(409).send("Game already exists");
        } else {
            await connection.query(`INSERT INTO games 
            (name, image, "stockTotal", "categoryId", "pricePerDay") 
            VALUES ($1, $2, $3, $4, $5);`, [name, image, stockTotal, 
            categoryId, pricePerDay]);
            return res.sendStatus(201);
        }

    } catch (err) {
        console.log(err);
        res.sendStatus(500);
        
    }

}