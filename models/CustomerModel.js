import mongoose from "mongoose";

// Define the schema for the Customer model
const CustomerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // Name is mandatory
  },
  phone: {
    type: String,
    required: true, // Phone number is mandatory
    unique: true, // Ensures phone number uniqueness
  },
  email: {
    type: String,
    default: null, // Email is optional
  },
  address: {
    type: String,
    required: true, // Address is mandatory
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
CustomerSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Create and export the Customer model
const Customer = mongoose.model("Customer", CustomerSchema);

export default Customer;
