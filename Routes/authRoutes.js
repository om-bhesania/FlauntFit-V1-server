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
import { roleMiddleware } from "../middleware/authMiddleWare.js";

const authRoutes = express.Router();

// Signup route
authRoutes.post("/register", validateRegistration, registerUser);

// Login route
authRoutes.post("/login", validateLogin, loginUser);

authRoutes.post("/ping", verifyToken, pingUser);
// Logout route
authRoutes.post("/logout", logoutUser);
// Protected Admin route (Only Admin)
authRoutes.get("/admin", verifyToken, roleMiddleware(["admin"]), (req, res) => {
  res.json({ message: "Welcome Admin!" });
});

// Protected Manager route (Admin & Manager)
authRoutes.get(
  "/manager",
  verifyToken,
  roleMiddleware(["admin", "manager"]),
  (req, res) => {
    res.json({ message: "Welcome Manager!" });
  }
);

// Protected User route (All users)
authRoutes.get(
  "/user",
  verifyToken,
  roleMiddleware(["admin", "manager", "user"]),
  (req, res) => {
    res.json({ message: "Welcome User!" });
  }
);
export default authRoutes;
