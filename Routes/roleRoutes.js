// routes/roleRoutes.js
import express from "express";
import {
  createRole,
  createRoles,
  getAllRoles,
  getRoleById,
  updateRoleById,
  deleteRoleById,
  deleteAllRoles,
} from "../controllers/RoleController.js";
import { protect } from "../middleware/authMiddleWare.js";

const roleRoutes = express.Router();

// Public routes (if any needed)

// Protected routes - require authentication
// Create operations
roleRoutes.post("/create", protect, createRole);
roleRoutes.post("/create-many", protect, createRoles);

// Read operations
roleRoutes.get("/", protect, getAllRoles);
roleRoutes.get("/:id", protect, getRoleById);

// Update operations
roleRoutes.put("/:id", protect, updateRoleById);

// Delete operations
roleRoutes.delete("/:id", protect, deleteRoleById);
roleRoutes.delete("/", protect, deleteAllRoles);

export default roleRoutes;
