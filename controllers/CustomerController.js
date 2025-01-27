import mongoose from "mongoose";
import Customer from "../models/CustomerModel.js"; // Ensure correct import path

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

// Create a new customer
export const createCustomer = async (req, res) => {
  const errors = validateCustomerData(req.body);
  if (Object.keys(errors).length) {
    return res.status(400).json(formatErrorResponse(errors));
  }

  // Check for duplicate email or phone
  const existingCustomer = await Customer.findOne({
    $or: [{ email: req.body.email }, { phone: req.body.phone }],
    user: req.user._id,
  });

  if (existingCustomer) {
    return res.status(400).json({
      message: "Customer with this email or phone already exists",
    });
  }

  try {
    const newCustomer = new Customer({
      ...req.body,
      user: req.user._id, // Associate the authenticated user
    });
    await newCustomer.save();
    return res.status(201).json({
      response: {
        status: "Success",
        message: "Customer Added Successfully",
        newCustomer,
      },
    });
  } catch (error) {
    return res.status(500).json(formatErrorResponse(error));
  }
};

// Get all customers
export const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find({ user: req.user._id });
    return res.status(200).json({
      response: {
        status: "Success",
        message: "Data fetched successfully",
        customers,
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
    return res.status(400).json({ message: "Invalid customer ID format" });
  }

  try {
    const customer = await Customer.findOne({ _id: id, user: req.user._id });
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    return res.status(200).json({
      response: {
        status: "Success",
        message: "Data fetched successfully",
        customer,
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
    return res.status(400).json({ message: "Invalid customer ID format" });
  }

  try {
    const customer = await Customer.findOne({ _id: id, user: req.user._id });
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const updatedCustomer = await Customer.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    return res.status(200).json({
      response: {
        status: "Success",
        message: "Customer Updated Successfully",
        updatedCustomer,
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
    return res.status(400).json({ message: "Invalid customer ID format" });
  }

  try {
    const customer = await Customer.findOneAndDelete({
      _id: id,
      user: req.user._id,
    });

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    return res.status(200).json({
      response: {
        status: "Success",
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
