import { Router } from "express";
import { getCategories, setCategories } from "../controllers/categories.controller.js";

const categoryRouter = Router();


categoryRouter.get("/categories", getCategories);
categoryRouter.post("/categories", setCategories);

export default categoryRouter;