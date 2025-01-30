import mongoose from "mongoose";

// Define the schema for the invoice
const invoiceSchema = new mongoose.Schema(
  {
    currentDate: { type: String, required: false },
    invoiceNumber: { type: String, required: false },
    cashier: { type: String, required: false },
    items: [
      {
        id: { type: String, required: false },
        item: { type: String, required: false },
        quantity: { type: Number, required: false },
        hsnSac: { type: String, required: false },
        price: { type: Number, required: false },
        total: { type: Number, required: false },
        unitPrice: { type: Number, required: false },
        gst: { type: Number, required: false },
        productDiscount: { type: Number, required: false },
      },
    ],
    gstPercentage: { type: String, required: false },
    discountRate: { type: Number, required: false },
    flatDiscount: { type: Number, required: false },
    name: { type: String, required: false },
    phone: { type: String, required: false },
    address: { type: String, required: false },
    email: { type: String, required: false },
    state: { type: String, required: false },
    city: { type: String, required: false },
    dob: { type: Date, required: false },
    subtotal: { type: Number, required: false },
    totalDiscount: { type: Number, required: false },
    subtotalAfterDiscount: { type: Number, required: false },
    totalBillingAmount: { type: Number, required: false },
    sgst: { type: Number, required: false },
    cgst: { type: Number, required: false },
    totalUntaxedAmount: { type: Number, required: false },
    gstAmount: { type: Number, required: false },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, // Ref to the user model
  },
  { timestamps: true }
);

// Create the model
const InvoiceData = mongoose.model("InvoiceModel", invoiceSchema);

export default InvoiceData;
