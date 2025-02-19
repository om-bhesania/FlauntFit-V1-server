import express from "express";

import {
  createInvoice,
  deleteInvoice,
  getInvoiceById,
  getUserInvoices,
} from "../controllers/InvoiceController.js";
import { protect } from "../middleware/authMiddleWare.js";

const invoiceRouter = express.Router();

// Create a new invoice
invoiceRouter.post("/", protect, createInvoice);

// Get all invoices of the user
invoiceRouter.get("/", protect, getUserInvoices);

// Get a specific invoice by ID
invoiceRouter.get("/:id", protect, getInvoiceById);

// Delete an invoice
invoiceRouter.delete("/:id", protect, deleteInvoice);

export default invoiceRouter;