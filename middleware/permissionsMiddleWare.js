// middlewares/permissionMiddleware.js

import Permission from "../models/PermissionModel.js";

// Define API to permission mapping
const API_PERMISSION_MAP = {
  // Products
  "POST:/api/products": { module: "products", action: "write" },
  "PUT:/api/products": { module: "products", action: "update" },
  "DELETE:/api/products": { module: "products", action: "delete" },
  "GET:/api/products": { module: "products", action: "read" },

  // Invoices
  "POST:/api/invoices": { module: "invoices", action: "write" },
  "PUT:/api/invoices": { module: "invoices", action: "update" },
  "DELETE:/api/invoices": { module: "invoices", action: "delete" },
  "GET:/api/invoices": { module: "invoices", action: "read" },

  // Employees
  "POST:/api/employees": { module: "employees", action: "write" },
  "PUT:/api/employees": { module: "employees", action: "update" },
  "DELETE:/api/employees": { module: "employees", action: "delete" },
  "GET:/api/employees": { module: "employees", action: "read" },
};

export const checkPermission = () => {
  return async (req, res, next) => {
    try {
      // Get the role from JWT token (assuming it's set by auth middleware)
      const userRole = req.user?.role;
      console.log("userRole ==>", userRole);
      if (!userRole) {
        return res.status(401).json({
          status: "Error",
          message: "No role found in token",
          data: null,
        });
      }

      // Get the endpoint and method
      const endpoint = `${req.method}:${req.baseUrl}${req.path}`;

      // Find required permission from map
      const requiredPermission = API_PERMISSION_MAP[endpoint];

      if (!requiredPermission) {
        console.warn(`No permission mapping found for endpoint: ${endpoint}`);
        return next(); // If no mapping exists, allow access (you might want to change this)
      }

      // Get user's permissions from database
      const userPermissions = await Permission.findOne({ roleName: userRole });

      if (!userPermissions) {
        return res.status(403).json({
          status: "Error",
          message: "No permissions found for this role",
          data: null,
        });
      }

      const { module, action } = requiredPermission;
      const hasPermission = userPermissions.module[module]?.[action];

      if (!hasPermission) {
        return res.status(403).json({
          status: "Error",
          message: `Unauthorized: You don't have ${action} permission for ${module}`,
          data: null,
        });
      }

      next();
    } catch (error) {
      console.error("Permission check error:", error);
      res.status(500).json({
        status: "Error",
        message: "Error checking permissions",
        data: null,
      });
    }
  };
};

// Helper to create permission middleware for specific actions
export const requirePermission = (module, action) => {
  return async (req, res, next) => {
    try {
      const userRole = req.user?.role;
      console.log("requirePermission", userRole);
      if (!userRole) {
        return res.status(401).json({
          status: "Error",
          message: "No role found in token",
          data: null,
        });
      }

      const userPermissions = await Permission.findOne({ roleName: userRole });

      if (!userPermissions) {
        return res.status(403).json({
          status: "Error",
          message: "No permissions found for this role",
          data: null,
        });
      }

      const hasPermission = userPermissions.module[module]?.[action];

      if (!hasPermission) {
        return res.status(403).json({
          status: "Error",
          message: `Unauthorized: You don't have ${action} permission for ${module}`,
          data: null,
        });
      }

      next();
    } catch (error) {
      console.error("Permission check error:", error);
      res.status(500).json({
        status: "Error",
        message: "Error checking permissions",
        data: null,
      });
    }
  };
};
