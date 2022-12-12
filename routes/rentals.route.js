import { Router } from "express";
import { getRentals, returnRentals, setRentals } from "../controllers/rentals.controller.js";
import { rentalValidation } from "../middlewares/rentals.middleware.js";


const rentalRouter = Router();

rentalRouter.post("/rentals", rentalValidation, setRentals);
rentalRouter.get("/rentals", getRentals);
rentalRouter.post("/rentals/:id/return", returnRentals);

export default rentalRouter;