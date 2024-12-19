import express from "express";
import { body, validationResult } from "express-validator";
import User from "../models/User.js"; // Ensure the User model uses Mongoose

const userRoutes = express.Router();

// Get all users
userRoutes.get("/get", async (req, res) => {
  try {
    const users = await User.find(); // Use find() for MongoDB to get all users
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Create a new user
userRoutes.post(
  "/post",
  [
    body("name").isString().notEmpty().withMessage("Name is required."),
    body("email").isEmail().withMessage("Valid email is required."),
  ],
  async (req, res) => {
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
  }
);

export default userRoutes;
