import { Router } from "express";
import { getCustomers, setCustomers } from "../controllers/customers.controller.js";
import { customerValidation } from "../middlewares/customers.middleware.js";

const customerRouter = Router();

customerRouter.get("/customers", getCustomers);
customerRouter.post("/customers", customerValidation, setCustomers);

export default customerRouter;