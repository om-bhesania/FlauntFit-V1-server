// controllers/authController.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { validationResult, body } from "express-validator";
import User from "../models/UserModel.js"; // Ensure your User model is set up with Mongoose
import dotenv from "dotenv";
import TokenBlacklist from "../middleware/blackListToken.js";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
// Validation for registration
export const validateRegistration = [
  body("username").isString().notEmpty().withMessage("Username is required."),
  body("email").isEmail().withMessage("Valid email is required."),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters."),
  body("contact")
    .optional()
    .isString()
    .withMessage("Contact must be a string."),
];

// Validation for login
export const validateLogin = [
  body("email").isEmail().withMessage("Valid email is required."),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters."),
];

// Signup controller
export const registerUser = async (req, res) => {
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
};

// Login controller
export const loginUser = async (req, res) => {
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
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "5h" });

    // Set the token in a secure HttpOnly cookie
    res.cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600 * 5000,
    });

    res.json({
      status: "success",
      data: {
        data: { userEmail: user.email, name: user.name, token },
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//logout contrller
export const logoutUser = async (req, res) => {
  try {
    const token =
      req.headers.authorization?.split(" ")[1] || req.cookies.authToken;

    if (!token) {
      return res.status(400).json({ message: "No token provided" });
    }

    // Verify the token to make sure it's valid before logging out
    jwt.verify(token, JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
      }

      // Add the token to the blacklist (invalidating it)
      const blacklistedToken = new TokenBlacklist({ token });
      await blacklistedToken.save();

      // Clear the cookie
      res.clearCookie("authToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      res.json({ message: "Logged out successfully" });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};