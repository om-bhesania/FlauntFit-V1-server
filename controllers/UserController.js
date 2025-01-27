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
