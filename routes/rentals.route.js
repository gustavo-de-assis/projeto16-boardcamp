import { Router } from "express";
import { setRentals } from "../controllers/rentals.controller.js";
import { rentalValidation } from "../middlewares/rentals.middleware.js";


const rentalRouter = Router();

rentalRouter.post("/rentals", rentalValidation, setRentals);

export default rentalRouter;