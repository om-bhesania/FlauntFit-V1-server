import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { validationResult, body } from "express-validator";
import User from "../models/UserModel.js"; // Ensure your User model is correctly set up
import dotenv from "dotenv";
import TokenBlacklist from "../middleware/blackListToken.js";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRATION = "5h"; // Token expiration time

// ✅ **Validation for registration**
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
  body("role").isString(true),
];

// ✅ **Validation for login**
export const validateLogin = [
  body("email").isEmail().withMessage("Valid email is required."),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters."),
];

// ✅ **Register User**
export const registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, email, password, contact, role } = req.body;

  try {
    // ✅ Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // ✅ Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create the new user with specified role
    const user = new User({
      name: username,
      email,
      password: hashedPassword,
      contact,
      role,
    });

    // ✅ Save the user to the database
    await user.save();

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ **Login User**
export const loginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    // ✅ Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // ✅ Compare password with hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // ✅ Check if the token is blacklisted
    const blacklistedToken = await TokenBlacklist.findOne({
      token: user.token,
    });
    if (blacklistedToken) {
      return res
        .status(401)
        .json({ message: "Token is blacklisted. Please log in again." });
    }

    // ✅ Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role }, // Include role in token
      JWT_SECRET,
      { expiresIn: JWT_EXPIRATION }
    );

    // ✅ Set the token in a secure HttpOnly cookie
    res.cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600 * 5000, // 5 hours
    });

    res.json({
      status: "success",
      data: {
        userEmail: user.email,
        name: user.name,
        role: user.role,
        token,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ **Logout User**
export const logoutUser = async (req, res) => {
  try {
    const token =
      req.headers.authorization?.split(" ")[1] || req.cookies.authToken;

    if (!token) {
      return res.status(400).json({ message: "No token provided" });
    }

    // ✅ Verify the token before blacklisting it
    jwt.verify(token, JWT_SECRET, async (err) => {
      if (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
      }

      // ✅ Add token to blacklist
      await TokenBlacklist.create({ token });

      // ✅ Clear the authentication cookie
      res.clearCookie("authToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      res.json({ message: "Logged out successfully" });
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
