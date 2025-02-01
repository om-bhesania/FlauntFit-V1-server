import mongoose from "mongoose";

// Define user roles
const ROLES = ["owner", "manager", "employee"];

const UserSchema = new mongoose.Schema({
  id: {
    type: String, // UUID stored as a string
    default: () => new mongoose.Types.ObjectId().toString(),
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensures email uniqueness
  },
  password: {
    type: String,
    required: true,
  },
  contact: {
    type: String,
    default: null, // Optional field
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically sets the creation timestamp
  },
  updatedAt: {
    type: Date,
    default: Date.now, // Automatically sets the update timestamp
  },
  role: {
    type: String,
    enum: ROLES, // Restricts role values to predefined roles
    default: "employee", // Default role is 'user'
  },
});

// Auto-update `updatedAt` field before saving
UserSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Export User model
const User = mongoose.model("User", UserSchema);
export default User;
