import express from "express";
import {
  createProduct,
  deleteAllProducts,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from "../controllers/ProductController.js"; // Ensure the controllers use Mongoose methods
import { protect } from "../middleware/authMiddleWare.js";

const productRouter = express.Router();

productRouter.post("/", protect,createProduct); // Create a new product
productRouter.get("/", protect,getProducts); // Get all products
productRouter.get("/:id",protect, getProductById); // Get a single product by ID
productRouter.put("/:id", protect, updateProduct); // Update a product by ID
productRouter.delete("/delete/:id",protect, deleteProduct); // Delete a product by ID
productRouter.delete("/delete-all", protect, deleteAllProducts); // Delete a product by ID

export default productRouter;
