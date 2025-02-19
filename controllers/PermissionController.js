import { v4 as uuidv4 } from "uuid";
import Permission from "../models/PermissionModel.js";
import Role from "../models/RoleModel.js";
import { getDefaultPermissions } from "./../utils/utils.js";

export const initializeAllRolePermissions = async (_, res) => {
  try {
    const roles = await Role.find();
    if (!roles.length) {
      return res.status(404).json({
        status: "Error",
        message: "No roles found",
        data: null,
      });
    }

    const existingPermissions = await Permission.find();
    const existingRoleIds = existingPermissions.map((perm) => perm.roleId);

    const newRoles = roles.filter(
      (role) => !existingRoleIds.includes(role.roleId)
    );
    if (!newRoles.length) {
      return res.status(200).json({
        status: "Success",
        message: "No new roles to initialize",
        data: null,
      });
    }

    const RoleName = newRoles.map((item) => item.name);
    const defaultPermissions = getDefaultPermissions(RoleName);
    console.log("defaultPermissions", defaultPermissions);
    const rolePermissionsData = newRoles.map((role) => {
      const modulePermissions = {};

      defaultPermissions.forEach((perm) => {
        modulePermissions[perm.module] = {
          read: perm.permissions.read || false,
          write: perm.permissions.write || false,
          update: perm.permissions.update || false,
          delete: perm.permissions.delete || false,
        };
      });

      return {
        id: uuidv4(),
        roleId: role.roleId,
        roleName: role.name,
        module: modulePermissions,
      };
    });

    await Permission.insertMany(rolePermissionsData);

    res.status(201).json({
      status: "Success",
      message: "Permissions initialized successfully",
      data: rolePermissionsData,
    });
  } catch (error) {
    console.log("Error initializing permissions", error);
    res.status(500).json({
      status: "Error",
      message: error.message,
      data: null,
    });
  }
};
export const formatPermissions = (permissions) => {
  return permissions.map((permission) => [
    {
      roleId: permission.roleId,
      roleName: permission.roleName,
      module: {
        name: permission.module,
        permissions: permission.permissions,
      },
    },
  ]);
};

export const getPermissionsByRoleId = async (req, res) => {
  try {
    const { roleId } = req.params;
    if (!roleId)
      return res
        .status(400)
        .json({ status: "Error", message: "Role ID is required" });

    const permissions = await Permission.find({ roleId });
    if (!permissions.length)
      return res.status(404).json({
        status: "Error",
        message: "No permissions found for this role",
      });

    res.status(200).json({
      status: "Success",
      message: "Permissions fetched successfully",
      data: permissions,
    });
  } catch (error) {
    res
      .status(500)
      .json({ status: "Error", message: error.message, data: null });
  }
};

export const updateModulePermissions = async (req, res) => {
  try {
    const { roleId } = req.params;
    const { permissions } = req.body;

    if (!roleId) {
      return res
        .status(400)
        .json({ status: "Error", message: "Role ID is required" });
    }

    if (!permissions || typeof permissions !== "object") {
      return res
        .status(400)
        .json({ status: "Error", message: "Invalid permissions format" });
    }

    // First try to find the permission
    let permission = await Permission.findOne({ roleId });

    let updatedPermission;
    if (permission) {
      // Update existing permission
      updatedPermission = await Permission.findOneAndUpdate(
        { roleId },
        {
          module: permissions, // Update the module field directly with the permissions object
        },
        {
          new: true,
          runValidators: true, // This ensures the validation runs on update
        }
      );
    } else {
      // Create new permission if it doesn't exist
      // You'll need to provide the roleName for new permissions
      const role = await Role.findById(roleId); // Assuming you have a Role model
      if (!role) {
        return res
          .status(404)
          .json({ status: "Error", message: "Role not found" });
      }

      updatedPermission = await Permission.create({
        roleId,
        roleName: role.name, // Get the role name from the role
        module: permissions,
      });
    }

    res.status(200).json({
      status: "Success",
      message: "Permissions updated successfully",
      data: updatedPermission,
    });
  } catch (error) {
    console.error("Error updating permissions:", error);
    res
      .status(500)
      .json({ status: "Error", message: error.message, data: null });
  }
};

export const checkPermission = (module, action) => async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return res
        .status(401)
        .json({ status: "Error", message: "Unauthorized access" });
    }
    const { id: roleId } = req.user;
    return res
      .status(401)
      .json({ status: "Error", message: "Unauthorized access" });

    const permission = await Permission.findOne({ roleId, module });
    if (!permission || !permission.permissions[action]) {
      return res
        .status(403)
        .json({ status: "Error", message: "Permission denied" });
    }
    next();
  } catch (error) {
    res
      .status(500)
      .json({ status: "Error", message: error.message, data: null });
  }
};

export const getAllPermissions = async (req, res) => {
  try {
    const permissions = await Permission.find();
    if (!permissions.length)
      return res
        .status(200)
        .json({ status: "success", message: "No permissions found", data: [] });

    res.status(200).json({
      status: "Success",
      message: "Permissions fetched successfully",
      data: permissions,
    });
  } catch (error) {
    res
      .status(500)
      .json({ status: "Error", message: error.message, data: null });
  }
};

export const getCurrentUserPermissions = async (req, res) => {
  try {
    const { roleId } = req.user;

    // Get permissions directly using roleId from token
    const permissions = await Permission.findOne({ roleId });
    if (!permissions) {
      return res.status(404).json({
        status: "Error",
        message: "No permissions found for this role",
        data: null,
      });
    }

    res.status(200).json({
      status: "Success",
      message: "User permissions fetched successfully",
      data: permissions,
    });
  } catch (error) {
    console.error("Error fetching user permissions:", error);
    res.status(500).json({
      status: "Error",
      message: error.message,
      data: null,
    });
  }
};

//  "data": [
//     {
//       "roleId": "aab3ae36-4fba-4f22-bcad-8949f13625ef",
//       "roleName": "Owner",
//       "module":  {
//         products:{
//             "read": true,
//         "write": true,
//         "update": true,
//         "delete": true
//         },
//          invoice:{
//             "read": true,
//         "write": true,
//         "update": true,
//         "delete": true
//         },
//          employee:{
//             "read": true,
//         "write": true,
//         "update": true,
//         "delete": true
//         }
//       }
//     }
//   ]
