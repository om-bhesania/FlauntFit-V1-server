import jwt from "jsonwebtoken";
import dotenv from "dotenv";  
import TokenBlacklist from "./blackListToken.js";
dotenv.config();

// JWT secret should match the one used for signing tokens
const JWT_SECRET = process.env.JWT_SECRET;
// Middleware to verify JWT token


 
/**
 * Middleware to verify if the token is blacklisted
 */
export const verifyToken = async (req, res, next) => {
  const token =
    req.headers.authorization?.split(" ")[1]

  if (!token) {
    return res.status(400).json({ message: "No token provided" });
  }

  // Check if the token is blacklisted
  const blacklistedToken = await TokenBlacklist.findOne({ token });
  if (blacklistedToken) {
    return res.status(401).json({ message: "Token has been invalidated" });
  }

  // Verify the token
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res
        .status(401)
        .json({ status: "invalid", message: "Invalid or expired token" });
    }

    req.user = decoded; // Attach user information to the request
    next(); // Allow the request to continue
  });
};
