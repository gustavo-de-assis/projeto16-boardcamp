import { Router } from "express";
import { setCustomers } from "../controllers/customers.controller.js";
import { customerValidation } from "../middlewares/customers.middleware.js";

const customerRouter = Router();

customerRouter.post("/customers", customerValidation, setCustomers);

export default customerRouter;