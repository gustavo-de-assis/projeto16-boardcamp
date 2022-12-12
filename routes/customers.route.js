import { Router } from "express";
import { getCustomers, getCustomersById, setCustomers, updateCustomers } from "../controllers/customers.controller.js";
import { customerValidation } from "../middlewares/customers.middleware.js";

const customerRouter = Router();

customerRouter.get("/customers", getCustomers);
customerRouter.get("/customers/:id", getCustomersById);
customerRouter.post("/customers", customerValidation, setCustomers);
customerRouter.put("/customers/:id", customerValidation,updateCustomers);

export default customerRouter;