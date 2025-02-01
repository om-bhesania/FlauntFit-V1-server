// routes/userRoutes.js
import express from "express";
import {
  createUser,
  getAllUsers,
  updateUser,
  validateUser,
} from "../controllers/UserController.js";

const userRoutes = express.Router();

// Get all users
userRoutes.get("/", getAllUsers);

// Create a new user
userRoutes.post("/", validateUser, createUser);
userRoutes.get("/:id", validateUser, createUser);
userRoutes.put("/:id", validateUser, updateUser);

export default userRoutes;
