import { v4 } from "uuid";
import Role from "../models/RoleModel.js";
import { initializePermissionsForRole } from "../utils/utils.js";
import Permission from "../models/PermissionModel.js";

// Create single role
export const createRole = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        status: "Error",
        message: "Role name is required",
        data: null,
      });
    }

    const existingRole = await Role.findOne({ name });
    if (existingRole) {
      return res.status(400).json({
        status: "Error",
        message: "Role already exists",
        data: null,
      });
    }

    // Start a session for transaction
    const session = await Role.startSession();
    session.startTransaction();

    try {
      const role = await Role.create(
        [
          {
            name,
            id: v4(),
          },
        ],
        { session }
      );

      // Initialize permissions for the new role
      const permissions = await initializePermissionsForRole(role[0]);

      await session.commitTransaction();

      res.status(201).json({
        status: "Success",
        message: "Role created successfully",
        data: {
          role: role[0],
          permissions,
        },
      });
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    console.error("Error creating role:", error);
    res.status(500).json({
      status: "Error",
      message: error.message,
      data: null,
    });
  }
};

// Create multiple roles
export const createRoles = async (_, res) => {
  try {
    const roles = [
      { name: "Owner", id: v4() },
      { name: "Employee", id: v4() },
    ];

    const existingRoles = await Role.find({
      name: { $in: roles.map((r) => r.name) },
    });

    if (existingRoles.length) {
      return res.status(400).json({
        status: "Error",
        message: "Some roles already exist",
        data: { existingRoles },
      });
    }

    const createdRoles = await Role.insertMany(roles);
    res.status(201).json({
      status: "Success",
      message: "Roles created successfully",
      data: { roles: createdRoles },
    });
  } catch (error) {
    res.status(500).json({
      status: "Error",
      message: error.message,
      data: null,
    });
  }
};

// Get all roles
export const getAllRoles = async (_, res) => {
  try {
    const roles = await Role.find({}).sort({ createdAt: -1 });
    res.status(200).json({
      status: "Success",
      message: "Roles fetched successfully",
      data: {
        count: roles.length,
        roles,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "Error",
      message: error.message,
      data: null,
    });
  }
};

// Get role by ID
export const getRoleById = async (_, res) => {
  try {
    const { id } = req.params;

    const role = await Role.findOne({ id });
    if (!role) {
      return res.status(404).json({
        status: "Error",
        message: "Role not found",
        data: null,
      });
    }

    res.status(200).json({
      status: "Success",
      message: "Role fetched successfully",
      data: role,
    });
  } catch (error) {
    res.status(500).json({
      status: "Error",
      message: error.message,
      data: null,
    });
  }
};

// Update role by ID
export const updateRoleById = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        status: "Error",
        message: "Role name is required",
        data: null,
      });
    }

    // Check if new name already exists for another role
    const existingRole = await Role.findOne({
      name,
      id: { $ne: id },
    });

    if (existingRole) {
      return res.status(400).json({
        status: "Error",
        message: "Role name already exists",
        data: null,
      });
    }

    const updatedRole = await Role.findOneAndUpdate(
      { id },
      { name },
      { new: true }
    );

    if (!updatedRole) {
      return res.status(404).json({
        status: "Error",
        message: "Role not found",
        data: null,
      });
    }

    res.status(200).json({
      status: "Success",
      message: "Role updated successfully",
      data: updatedRole,
    });
  } catch (error) {
    res.status(500).json({
      status: "Error",
      message: error.message,
      data: null,
    });
  }
};

// Delete role by ID
export const deleteRoleById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        status: "Error",
        message: "Role ID is required",
        data: null,
      });
    }

    // Start a session for transaction
    const session = await Role.startSession();
    session.startTransaction();

    try { 
      const role = await Role.findOneAndDelete({ roleId: id }, { session }); 
      if (!role) {
        await session.abortTransaction();
        return res.status(404).json({
          status: "Error",
          message: "Role not found",
          data: null,
        });
      }

      // Remove corresponding permissions for the role
      await Permission.deleteMany({ roleId: id }, { session });

      await session.commitTransaction();

      res.status(200).json({
        status: "Success",
        message: "Role and corresponding permissions deleted successfully",
        data: role,
      });
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    res.status(500).json({
      status: "Error",
      message: error.message,
      data: null,
    });
  }
};

// Delete all roles
export const deleteAllRoles = async (_, res) => {
  try {
    const result = await Role.deleteMany({});

    res.status(200).json({
      status: "Success",
      message: "All roles deleted successfully",
      data: {
        deletedCount: result.deletedCount,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "Error",
      message: error.message,
      data: null,
    });
  }
};
