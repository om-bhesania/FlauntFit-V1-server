import Customer from "../models/CustomerModel.js"; // Ensure correct import path
import mongoose from "mongoose";
import jwt from "jsonwebtoken"; // Assuming you're using JWT for authentication

// Custom validation function for customer data
const validateCustomerData = (data) => {
  const errors = {};

  if (!data.name) {
    errors.name = "Name is required";
  }

  if (!data.phone) {
    errors.phone = "Phone number is required";
  } else if (!/^\d{10}$/.test(data.phone)) {
    errors.phone = "Phone number must be 10 digits";
  }

  if (data.email && !/^\S+@\S+\.\S+$/.test(data.email)) {
    errors.email = "Invalid email format";
  }

  if (!data.address) {
    errors.address = "Address is required";
  }

  return errors;
};

// Format error responses
const formatErrorResponse = (errors) => {
  const messages = Object.values(errors);
  return {
    messages,
  };
};

// Middleware to check authentication
const authenticateUser = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(401).json({
      message: "Authentication token is required",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

// Create a new customer
export const createCustomer = async (req, res) => {
  const errors = validateCustomerData(req.body);
  if (Object.keys(errors).length) {
    return res.status(400).json(formatErrorResponse(errors));
  }

  // Check for duplicate email or phone
  const existingCustomer = await Customer.findOne({
    $or: [{ email: req.body.email }, { phone: req.body.phone }],
  });

  if (existingCustomer) {
    return res.status(400).json({
      message: "Customer with this email or phone already exists",
    });
  }

  try {
    const newCustomer = new Customer(req.body);
    await newCustomer.save();
    return res.status(201).json({
      response: {
        message:'Customer Added Successfully',
        data: {
          data: {
            customers: [newCustomer],
          },
        },
      },
    });
  } catch (error) {
    return res.status(500).json(formatErrorResponse(error));
  }
};

// Get all customers
export const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
    return res.status(200).json({
      response: {
        data: {
          data: {
            customers,
          },
        },
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong with the server",
      error: error.message,
    });
  }
};

// Get a customer by ID
export const getCustomerById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      message: "Invalid customer ID format",
    });
  }

  try {
    const customer = await Customer.findById(id);
    if (!customer) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }
    return res.status(200).json({
      response: {
        data: {
          data: {
            customers: [customer],
          },
        },
      },
    });
  } catch (error) {
    return res.status(500).json(formatErrorResponse(error));
  }
};

// Update a customer by ID
export const updateCustomer = async (req, res) => {
  const { id } = req.params;
  const errors = validateCustomerData(req.body);

  if (Object.keys(errors).length) {
    return res.status(400).json(formatErrorResponse(errors));
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      message: "Invalid customer ID format",
    });
  }

  // Check for duplicate email or phone
  const existingCustomer = await Customer.findOne({
    $or: [{ email: req.body.email }, { phone: req.body.phone }],
    _id: { $ne: id },
  });

  if (existingCustomer) {
    return res.status(400).json({
      message: "Customer already exists",
    });
  }

  try {
    const updatedCustomer = await Customer.findByIdAndUpdate(
      id,
      req.body,
      { new: true } // Return the updated customer after update
    );
    if (!updatedCustomer) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }
    return res.status(200).json({
      response: {
        message:'Customer Updated Successfully',
        data: {
          data: {
            customers: [updatedCustomer],
          },
        },
      },
    });
  } catch (error) {
    return res.status(500).json(formatErrorResponse(error));
  }
};

// Delete a customer by ID
export const deleteCustomer = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      message: "Invalid customer ID format",
    });
  }

  try {
    const deletedCustomer = await Customer.findByIdAndDelete(id);
    if (!deletedCustomer) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }
    return res.status(200).json({
      response: {
        status: 'Success',
        message: "Customer Deleted Successfully",
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred while deleting the customer",
      error: error.message,
    });
  }
};

// Delete all customers
export const deleteAllCustomers = async (req, res) => {
  try {
    const result = await Customer.deleteMany({});
    return res.status(200).json({
      message: "All customers deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred while deleting customers",
      error: error.message,
    });
  }
};
