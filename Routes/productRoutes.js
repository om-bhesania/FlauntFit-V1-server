import express from "express";
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from "../controllers/ProductController.js";  

const productRouter = express.Router();

 
productRouter.post("/", createProduct); // Create a new product
productRouter.get("/", getProducts); // Get all products
productRouter.get("/:id", getProductById); // Get a single product by ID
productRouter.put("/:id", updateProduct); // Update a product by ID
productRouter.delete("/:id", deleteProduct); // Delete a product by ID

export default productRouter;
