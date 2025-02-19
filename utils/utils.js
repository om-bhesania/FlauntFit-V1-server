import { v4 } from "uuid";
import Role from "../models/RoleModel.js";
import Permission from "../models/PermissionModel.js";

export const getDefaultPermissions = (roleNames) => {
  // Only hardcode Owner and Employee permissions
  const hardcodedPermissions = {
    owner: [
      {
        module: "products",
        permissions: { read: true, write: true, update: true, delete: true },
      },
      {
        module: "invoices",
        permissions: { read: true, write: true, update: true, delete: true },
      },
      {
        module: "employees",
        permissions: { read: true, write: true, update: true, delete: true },
      },
      {
        module: "general",
        permissions: { read: true, write: true, update: true, delete: true },
      },
      {
        module: "dashboard",
        permissions: { read: true, write: true, update: true, delete: true },
      },
    ],
    employee: [
      {
        module: "products",
        permissions: { read: true, write: false, update: false, delete: false },
      },
      {
        module: "invoices",
        permissions: { read: true, write: true, update: false, delete: false },
      },
      {
        module: "employees",
        permissions: {
          read: false,
          write: false,
          update: false,
          delete: false,
        },
      },
      {
        module: "general",
        permissions: { read: true, write: true, update: true, delete: true },
      },
      {
        module: "dashboard",
        permissions: { read: true, write: false, update: false, delete: false },
      },
    ],
  };

  // Default read-only permissions for any other role
  const defaultReadOnlyPermissions = [
    {
      module: "products",
      permissions: { read: true, write: false, update: false, delete: false },
    },
    {
      module: "invoices",
      permissions: { read: true, write: false, update: false, delete: false },
    },
    {
      module: "employees",
      permissions: { read: true, write: false, update: false, delete: false },
    },
    {
      module: "general",
      permissions: { read: true, write: true, update: true, delete: true },
    },
    {
      module: "dashboard",
      permissions: { read: true, write: false, update: false, delete: false },
    },
  ];

  // Get permissions for a single role
  const getPermissionsForSingleRole = (roleName) => {
    const lowercaseRole = roleName.toLowerCase();
    switch (lowercaseRole) {
      case "owner":
        return hardcodedPermissions.owner;
      case "employee":
        return hardcodedPermissions.employee;
      default:
        return defaultReadOnlyPermissions;
    }
  };

  // If we're initializing for a single role, return permissions for just that role
  if (roleNames.length === 1) {
    return getPermissionsForSingleRole(roleNames[0]);
  }

  // If we're getting permissions for multiple roles, process each role
  return roleNames.reduce((allPermissions, roleName) => {
    const permissions = getPermissionsForSingleRole(roleName);
    return [...allPermissions, ...permissions];
  }, []);
};

export const initializePermissionsForRole = async (role) => {
  try {
    const roles = await Role.find();
    if (!roles.length) {
      throw new Error("No roles found");
    }

    const RoleName = roles.map((item) => item.name);
    const defaultPermissions = getDefaultPermissions(RoleName);

    const modulePermissions = {};
    const rolePermissions = getDefaultPermissions([role.name]);

    rolePermissions.forEach((perm) => {
      modulePermissions[perm.module] = {
        read: perm.permissions.read || false,
        write: perm.permissions.write || false,
        update: perm.permissions.update || false,
        delete: perm.permissions.delete || false,
      };
    });

    const permissionData = {
      id: v4(),
      roleId: role.id,
      roleName: role.name,
      module: modulePermissions,
    };

    await Permission.create(permissionData);
    return permissionData;
  } catch (error) {
    throw error;
  }
};

// Add cleanup function for removing orphaned permissions
export const cleanupOrphanedPermissions = async () => {
  try {
    const roles = await Role.find({}, { id: 1 });
    const roleIds = roles.map((role) => role.id);

    // Delete permissions where roleId doesn't exist in roles collection
    const result = await Permission.deleteMany({
      roleId: { $nin: roleIds },
    });

    return result.deletedCount;
  } catch (error) {
    console.error("Error cleaning up permissions:", error);
    throw error;
  }
};

// Optional: Middleware to ensure role exists before operations
export const checkRoleExists = async (req, res, next) => {
  try {
    const roleId = req.params.roleId || req.body.roleId;

    if (!roleId) {
      return res.status(400).json({
        status: "Error",
        message: "Role ID is required",
        data: null,
      });
    }

    const role = await Role.findOne({ id: roleId });
    if (!role) {
      return res.status(404).json({
        status: "Error",
        message: "Role not found",
        data: null,
      });
    }

    req.role = role; // Attach role to request for later use
    next();
  } catch (error) {
    res.status(500).json({
      status: "Error",
      message: error.message,
      data: null,
    });
  }
};
