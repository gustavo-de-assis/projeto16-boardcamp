import { Router } from "express";
import { getGames, setGames } from "../controllers/games.controller.js";
import { gameValidation } from "../middlewares/games.middleware.js";

const gameRouter = Router();


gameRouter.get("/games", getGames);
gameRouter.post("/games", gameValidation, setGames);

export default gameRouter;