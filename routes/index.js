import { Router } from "express";
import categoryRouter from "./categories.route.js";

const router = Router();

router.use(categoryRouter);


export default router;