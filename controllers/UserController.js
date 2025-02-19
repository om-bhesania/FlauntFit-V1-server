import { body, validationResult } from "express-validator";
import User from "../models/UserModel.js";
import bcrypt from "bcrypt";
import { v4 } from "uuid";

// Updated validation middleware to match User model
export const validateUser = [
  body("username").isString().notEmpty().withMessage("Username is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").isString().notEmpty().withMessage("Password is required"),
  body("phone").isNumeric().withMessage("Phone must be a number"),
  body("address").isString().notEmpty().withMessage("Address is required"),
  body("role").isString().notEmpty().withMessage("Role is required"),
  body("roleName").isString().notEmpty().withMessage("Role name is required"),
  body("createdBy").isString().notEmpty().withMessage("createdBy is required"),
];

// Get all users created by a specific user
export const getAllUsers = async (req, res) => {
  const { createdBy } = req.query;
  try {
    const users = await User.find({ createdBy });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Create a new user
export const createUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, email, password, phone, address, role, roleName, createdBy } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      userId: v4(),
      username,
      email,
      password: hashedPassword,
      phone: Number(phone),
      address,
      role,
      roleName,
      createdBy,
    });

    await user.save();
    res.status(201).json({
      user,
      message: "User created successfully",
    });
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Email already exists",
        error: error.message,
      });
    }
    res.status(400).json({
      message: "Bad Request",
      error: error.message,
    });
  }
};

// Update an existing user
export const updateUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id: userId } = req.params;
  const { _id, username, email, phone, address, role, roleName, createdBy } = req.body;
  try {
    const user = await User.findOne({ _id: userId, createdBy });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (username) user.username = username;
    if (email) user.email = email;
    if (phone) user.phone = Number(phone);
    if (address) user.address = address;
    if (role) user.role = role;
    if (roleName) user.roleName = roleName;

    await user.save();
    res.status(200).json({
      user,
      message: "User updated successfully",
    });
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Email already exists",
        error: error.message,
      });
    }
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// Get user by id
export const getUserById = async (req, res) => {
  const { userId } = req.params;
  const { createdBy } = req.query;
  try {
    const user = await User.findOne({ userId, createdBy });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Delete a user
export const deleteUser = async (req, res) => {
  const { id } = req.params;
  const { createdBy } = req.body;

  try {
    const user = await User.findOneAndDelete({ userId: id, createdBy });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteAllUser = async (req, res) => {
  const { createdBy } = req.body;
  try {
    const result = await User.deleteMany({ createdBy });
    res.json({
      status: 200,
      message: "All users deleted successfully",
      total: result.deletedCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Assign role to the user
export const assignRole = async (req, res) => {
  const { id: userId } = req.params;
  const { role, createdBy } = req.body;

  if (!["owner", "manager", "employee"].includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  try {
    const user = await User.findOne({ _id: userId, createdBy });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.role = role;
    await user.save();

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

