import jwt from "jsonwebtoken";
import User from "../models/User.js"; // Ensure you have the correct User model

export const protect = async (req, res, next) => {
  const token =
    req.headers.authorization && req.headers.authorization.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(
      token,
      "@(&)!@#iasdhasdhJASDHASJKD9123290@UudbU@h2eniUHU@NBEUINID32"
    ); // Ensure you have the JWT_SECRET set correctly
    req.user = await User.findById(decoded.id); // Add the user to the request object
    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }
    next();
  } catch (error) {
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};
