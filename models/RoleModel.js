// models/Role.js
import mongoose from "mongoose";
import crypto from "crypto";
import { v4 } from "uuid";

const RoleSchema = new mongoose.Schema({
  roleId: {
    type: String,
    unique: true,
    required: true,
    default: () => v4(), // Generates a 16-character alphanumeric ID
  },
  name: {
    type: String,
    required: true,
    unique: true, // Ensures role name is unique
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Role = mongoose.model("Role", RoleSchema);
export default Role;
