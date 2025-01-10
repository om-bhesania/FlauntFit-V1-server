// routes/authRoutes.js
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import User from "../models/User.js"; // Ensure your User model is set up with Mongoose
import { stat } from "fs";

const authRoutes = express.Router();
const JWT_SECRET =
  process.env.JWT_SECRET ||
  "@(&)!@#iasdhasdhJASDHASJKD9123290@UudbU@h2eniUHU@NBEUINID32"; // Use a strong secret in production

// Signup route
authRoutes.post(
  "/register",
  [
    body("username").isString().notEmpty().withMessage("Username is required."),
    body("email").isEmail().withMessage("Valid email is required."),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters."),
    body("contact")
      .optional()
      .isString()
      .withMessage("Contact must be a string."),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password, contact } = req.body;
    try {
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email already in use" });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create the new user
      const user = new User({
        name: username,
        email,
        password: hashedPassword,
        contact,
      });

      // Save the user to the database
      await user.save();

      res.status(200).json({ message: "User registered successfully", user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

// Login route
authRoutes.post("/login", async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });

    // Set the token in a secure HttpOnly cookie
    res.cookie("authToken", token, {
      httpOnly: true, // Prevent JavaScript access
      secure: process.env.NODE_ENV === "production", // Use HTTPS in production
      sameSite: "strict", // Prevent CSRF
      maxAge: 3600 * 4000, // 4 hour
    });

    // Send response with user details (excluding token)
    res.json({
      status: "success",
      data: {
        data: { userEmail: user.email, name: user.name, token },
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default authRoutes;
