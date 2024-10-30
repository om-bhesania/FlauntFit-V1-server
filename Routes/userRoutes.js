// routes/userRoutes.js
import express from "express";
import { body, validationResult } from "express-validator";
import User from "../models/User.js";

const userRoutes = express.Router();

// Get all users
userRoutes.get("/get", async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

 
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
      const user = await User.create({ name, email });
      res.status(201).json(user);
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: "Bad Request" });
    }
  }
);

export default userRoutes;
