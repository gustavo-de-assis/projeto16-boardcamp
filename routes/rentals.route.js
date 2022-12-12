import { Router } from "express";
import { getRentals, setRentals } from "../controllers/rentals.controller.js";
import { rentalValidation } from "../middlewares/rentals.middleware.js";


const rentalRouter = Router();

rentalRouter.post("/rentals", rentalValidation, setRentals);
rentalRouter.get("/rentals", getRentals);

export default rentalRouter;