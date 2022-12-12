import { Router } from "express";
import categoryRouter from "./categories.route.js";
import customerRouter from "./customers.route.js";
import gameRouter from "./games.route.js";
import rentalRouter from "./rentals.route.js";

const router = Router();

router.use(categoryRouter);
router.use(gameRouter);
router.use(customerRouter);
router.use(rentalRouter);

export default router;