import { Router } from "express";
import { getCategories, setCategories } from "../controllers/categories.controller.js";
import { categoryValidation } from "../middlewares/categories.middleware.js";

const categoryRouter = Router();


categoryRouter.get("/categories", getCategories);
categoryRouter.post("/categories", categoryValidation, setCategories);

export default categoryRouter;