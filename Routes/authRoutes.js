// routes/authRoutes.js
import express from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
  validateLogin,
  validateRegistration,
} from "../controllers/AuthController.js";
import { pingUser } from "../controllers/PingController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const authRoutes = express.Router();

// Signup route
authRoutes.post("/register", validateRegistration, registerUser);

// Login route
authRoutes.post("/login", validateLogin, loginUser);

authRoutes.post("/ping", verifyToken, pingUser);
// Logout route
authRoutes.post("/logout", logoutUser);

export default authRoutes;
