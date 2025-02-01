// controllers/userController.js

import { body, validationResult } from "express-validator";
import User from "../models/UserModel.js";

// Validation for creating a user
export const validateUser = [
  body("name").isString().notEmpty().withMessage("Name is required."),
  body("email").isEmail().withMessage("Valid email is required."),
];

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find(); // Use find() for MongoDB to get all users
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

  const { name, email } = req.body;
  try {
    const user = new User({ name, email }); // Create a new user instance
    await user.save(); // Save the user instance to MongoDB
    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Bad Request" });
  }
};

// Update an existing user
export const updateUser = async (req, res) => {
  console.log('res', res);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id: userId } = req.params; // Destructure `id` from the route params
  const { name, email, phone, role } = req.body;

  try {
    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user fields if provided in the request body
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (role) user.role = role;

    // Save the updated user data
    await user.save();

    res.status(200).json(user); // Send updated user as response
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//get user by id
export const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    console.log("user", user);
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

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.remove();
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Bad Request" });
  }
};
