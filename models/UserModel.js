import mongoose from "mongoose";
import { v4 } from "uuid";

const UserSchema = new mongoose.Schema({
  userId: {
    type: String,
    default: v4(), // Generates a UUID by default
    unique: true, // Ensures uniqueness
  },
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  role: {
    type: String, // UUID from the payload
    required: true,
  },
  roleName: {
    type: String,
    required: true,
  },
  createdBy: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Auto-update `updatedAt` field before saving
UserSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const User = mongoose.model("User", UserSchema);
export default User;

