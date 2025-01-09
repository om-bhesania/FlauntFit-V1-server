import express from "express";
import {
  createCustomer,
  deleteAllCustomers,
  deleteCustomer,
  getCustomerById,
  getCustomers,
  updateCustomer,
} from "../controllers/CustomerController.js";
import { protect } from "../middleware/authMiddleWare.js";

const customerRouter = express.Router();

customerRouter.post("/", protect, createCustomer);
customerRouter.get("/", protect, getCustomers);
customerRouter.get("/:id", protect, getCustomerById);
customerRouter.put("/:id", protect, updateCustomer);
customerRouter.delete("/:id", protect, deleteCustomer);
customerRouter.delete("/", protect, deleteAllCustomers);

export default customerRouter;
