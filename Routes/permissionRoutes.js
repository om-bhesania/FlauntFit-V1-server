// routes/permissionRoutes.js
import express from "express";

import { extractUserFromToken, protect } from "../middleware/authMiddleWare.js";
import {
  getAllPermissions,
  getCurrentUserPermissions,
  getPermissionsByRoleId,
  initializeAllRolePermissions,
  updateModulePermissions,
} from "../controllers/PermissionController.js";

const permissionRoutes = express.Router();

// Initialize permissions for a role
permissionRoutes.post(
  "/initialize/:roleId",
  protect,
  initializeAllRolePermissions
);

// Get permissions by role ID
permissionRoutes.get("/role/:roleId", protect, getPermissionsByRoleId);

// Update module permissions
permissionRoutes.put(
  "/update/:roleId/:module",
  protect,
  updateModulePermissions
);
permissionRoutes.get("/get-all", protect, getAllPermissions);
permissionRoutes.get(
  "/current-user-permissions",
  extractUserFromToken,
  getCurrentUserPermissions
);

export default permissionRoutes;
