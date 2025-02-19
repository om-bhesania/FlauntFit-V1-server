// routes/userRoutes.js
import express from "express";
import {
  assignRole,
  createUser,
  deleteAllUser,
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
userRoutes.delete("/", validateUser, deleteAllUser);
userRoutes.put("/:id/role", assignRole);
export default userRoutes;
