import mongoose from "mongoose";

// Define the schema for the User model
const UserSchema = new mongoose.Schema({
  id: {
    type: String, // UUID is stored as a string in MongoDB
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
});

// Add a pre-save hook to automatically update the `updatedAt` field
UserSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Create and export the User model
const User = mongoose.model("User", UserSchema);

export default User;
