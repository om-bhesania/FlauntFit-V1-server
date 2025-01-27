import jwt from "jsonwebtoken";
import dotenv from "dotenv"; // Correct import syntax

// Load environment variables
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"; // The same secret used to sign the token



export const pingUser = (req, res) => {
  // Get token from either body, cookies, or authorization header
  const token = req.body.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(400).json({ message: "No token provided" });
  }

  // Verify the token
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res
        .status(401)
        .json({ status: "invalid", message: "Invalid or expired token" });
    }

    // Token is valid, return user info or success message
    res.json({
      message: "Token is valid",
      userId: decoded.id,
      username: decoded.username,
    });
  });
};
