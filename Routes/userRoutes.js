// routes/userRoutes.js
import express from "express";
import {
  createUser,
  getAllUsers,
  validateUser,
} from "../controllers/UserController.js";

const userRoutes = express.Router();

// Get all users
userRoutes.get("/get", getAllUsers);

// Create a new user
userRoutes.post("/post", validateUser, createUser);

export default userRoutes;
