import InvoiceData from "../models/InvoiceModel.js";
// Create a new invoice
export const createInvoice = async (req, res) => {
  try {
    const {
      currentDate,
      invoiceNumber,
      cashier,
      items,
      gstPercentage,
      discountRate,
      flatDiscount,
      name,
      phone,
      address,
      email,
      state,
      city,
      dob,
      subtotal,
      totalDiscount,
      subtotalAfterDiscount,
      totalBillingAmount,
      sgst,
      cgst,
      totalUntaxedAmount,
      gstAmount,
    } = req.body;

    // Create a new invoice
    const newInvoice = new InvoiceData({
      currentDate,
      invoiceNumber,
      cashier,
      items,
      gstPercentage,
      discountRate,
      flatDiscount,
      name,
      phone,
      address,
      email,
      state,
      city,
      dob,
      subtotal,
      totalDiscount,
      subtotalAfterDiscount,
      totalBillingAmount,
      sgst,
      cgst,
      totalUntaxedAmount,
      gstAmount,
      userId: req.user._id,
    });

    // Save to database
    await newInvoice.save();
    res.status(201).json({
      status: "Success",
      message: "Invoice Created Successfully",
      data: newInvoice,
    });
  } catch (err) {
    console.log(err)
    res.status(500).json({
      status: "Error",
      message: "Something went wrong while creating the invoice",
      data: err.message,
    });
  }
};

// Get all invoices of the user
export const getUserInvoices = async (req, res) => {
  try {
    const invoices = await InvoiceData.find({ userId: req.user._id });
    res.status(200).json({
      status: "Success",
      message: "Invoices Retrieved Successfully",
      data: invoices,
    });
  } catch (err) {
    res.status(500).json({
      status: "Error",
      message: "Something went wrong while retrieving invoices",
      data: err.message,
    });
  }
};

// Get a specific invoice by ID
export const getInvoiceById = async (req, res) => {
  try {
    const invoice = await InvoiceData.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!invoice) {
      return res.status(404).json({
        status: "Error",
        message: "Invoice not found",
        data: {},
      });
    }
    res.status(200).json({
      status: "Success",
      message: "Invoice Retrieved Successfully",
      data: invoice,
    });
  } catch (err) {
    res.status(500).json({
      status: "Error",
      message: "Something went wrong while retrieving the invoice",
      data: err.message,
    });
  }
};

// Delete an invoice
export const deleteInvoice = async (req, res) => {
  try {
    const invoice = await InvoiceData.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!invoice) {
      return res.status(404).json({
        status: "Error",
        message: "Invoice not found",
        data: {},
      });
    }
    res.status(200).json({
      status: "Success",
      message: "Invoice Deleted Successfully",
      data: {},
    });
  } catch (err) {
    res.status(500).json({
      status: "Error",
      message: "Something went wrong while deleting the invoice",
      data: err.message,
    });
  }
};

