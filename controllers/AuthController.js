import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { validationResult, body } from "express-validator";
import User from "../models/UserModel.js"; // Ensure your User model is correctly set up
import dotenv from "dotenv";
import TokenBlacklist from "../middleware/blackListToken.js";
import Role from "../models/RoleModel.js";
import Permission from "../models/PermissionModel.js";

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

  const { username, email, password, phone, address, role, roleName } =
    req.body;
console.log("role", role);
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: "Error",
        message: "Email already in use",
      });
    }

    // Find role by ID
    const roleData = await Role.findOne({ roleId: role });
    if (!roleData) {
      return res.status(400).json({
        status: "Error",
        message: "Invalid role specified",
      });
    }
console.log("roleData", roleData);
    // Verify role has permissions
    const permissions = await Permission.findOne({ roleId: role });
    console.log("permissions", permissions);
    if (!permissions) {
      return res.status(400).json({
        status: "Error",
        message: "Role permissions not configured",
      });
    }

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const user = new User({
      username,
      email,
      password: hashedPassword, // Ensure hashed password is stored
      phone,
      address,
      role,
      roleName,
    });

    await user.save();

    res.status(201).json({
      status: "Success",
      message: "User registered successfully",
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
        roleName: user.roleName,
      },
    });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({
      status: "Error",
      message: "Internal Server Error",
    });
  }
};

//✅  **Login user**
export const loginUser = async (req, res) => {
  // Validate request input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: "Error", errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    // ✅ Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        status: "Error",
        message: "User does not exist",
      });
    }

    console.log("Stored Hashed Password:", user.password);
    console.log("Entered Password:", password);
    // ✅ Verify password using bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);

    console.log("isPasswordValid:", isPasswordValid);
    if (!isPasswordValid) {
      return res.status(400).json({
        status: "Error",
        message: "Wrong email or password",
      });
    }

    // ✅ Check if user's role permissions exist
    const permissions = await Permission.findOne({ roleId: user.role });
    if (!permissions) {
      return res.status(400).json({
        status: "Error",
        message: "User role permissions not found",
      });
    }

    // ✅ Generate a new JWT token
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: JWT_EXPIRATION,
    });

    // ✅ Set the token in a secure HttpOnly cookie
    res.cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 5 * 60 * 60 * 1000, // 5 hours
    });

    // ✅ Send response with user data
    res.json({
      status: "Success",
      data: {
        id: user._id,
        email: user.email,
        username: user.username,
        phone: user.phone,
        address: user.address,
        roleId: user.role,
        roleName: user.roleName,
        permissions: permissions.module,
        token,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      status: "Error",
      message: "Internal Server Error",
    });
  }
};

// ✅ **Logout User**
export const logoutUser = async (req, res) => {
  try {
    const token =
      req?.headers?.authorization?.split(" ")[1] || req?.cookies?.authToken;

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
