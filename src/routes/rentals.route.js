import { Router } from "express";
import { deleteRentals, getRentals, returnRentals, setRentals } from "../controllers/rentals.controller.js";
import { rentalValidation } from "../middlewares/rentals.middleware.js";


const rentalRouter = Router();

rentalRouter.post("/rentals", rentalValidation, setRentals);
rentalRouter.get("/rentals", getRentals);
rentalRouter.post("/rentals/:id/return", returnRentals);
rentalRouter.delete("/rentals/:id", deleteRentals);

export default rentalRouter;