import express from "express";
import {
  createProduct,
  deleteAllProducts,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from "../controllers/ProductController.js"; // Ensure the controllers use Mongoose methods

const productRouter = express.Router();

productRouter.post("/", createProduct); // Create a new product
productRouter.get("/", getProducts); // Get all products
productRouter.get("/:id", getProductById); // Get a single product by ID
productRouter.put("/:id", updateProduct); // Update a product by ID
productRouter.delete("/delete/:id", deleteProduct); // Delete a product by ID
productRouter.delete("/delete-all", deleteAllProducts); // Delete a product by ID

export default productRouter;
