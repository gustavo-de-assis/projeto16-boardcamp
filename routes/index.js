import { Router } from "express";
import categoryRouter from "./categories.route.js";
import customerRouter from "./customers.route.js";
import gameRouter from "./games.route.js";

const router = Router();

router.use(categoryRouter);
router.use(gameRouter);
router.use(customerRouter);

export default router;