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
  state: {
    type: String,
    required: true, // state is mandatory
  },
  city: {
    type: String,
    default: null, // city is optional
  },
  dob: {
    type: Date,
    default: null, // city is optional
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically sets the creation timestamp
  },
  updatedAt: {
    type: Date,
    default: Date.now, // Automatically sets the update timestamp
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Associate with user
});

// Add a pre-save hook to automatically update the `updatedAt` field
CustomerSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Create and export the Customer model
const Customer = mongoose.model("Customer", CustomerSchema);

export default Customer;
