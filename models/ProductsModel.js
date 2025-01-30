import mongoose from "mongoose";

// Define the schema for the Product model
const ProductSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
    },
    productDescription: {
      type: String,
      validate: {
        validator: (value) => value.length <= 1000,
        message: "Description can't exceed 1000 characters",
      },
    },
    category: {
      type: String,
      required: true,
    },
    subcategory: {
      type: String,
      required: true,
    },
    productType: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      validate: {
        validator: (value) => value >= 0,
        message: "Price must be a positive number",
      },
    },
    gst: {
      type: String,
      required: true,
      validate: {
        validator: (value) => ["5%", "12%", "18%", "28%"].includes(value),
        message: "GST must be one of the following values: 5%, 12%, 18%, 28%",
      },
      default: "0",
    },
    costPrice: {
      type: Number,
      required: true,
      validate: {
        validator: (value) => value >= 0,
        message: "Cost Price must be a positive number",
      },
      default: 0,
    },
    salePrice: {
      type: Number,
      validate: {
        validator: function (value) {
          return value >= 0 && value <= this.price;
        },
        message: "Sale Price should be less than or equal to Price",
      },
    },
    sku: {
      type: String,
      required: true,
    },
    quantityInStock: {
      type: Number,
      required: false,
      validate: {
        validator: (value) => value >= 0,
        message: "Quantity in stock must be a positive number",
      },
    },
    video: {
      type: String,
    },
    sizeOptions: {
      type: Array,
    },
    careInstructions: {
      type: String,
      validate: {
        validator: (value) => value.length <= 500,
        message: "Care instructions can't exceed 500 characters",
      },
    },
    inventoryStatus: {
      type: String,
      enum: ["In Stock", "Out of Stock", "Discontinued", "Coming Soon"],
      required: true,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the user who created the product
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Create and export the Product model
const Product = mongoose.model("Products", ProductSchema);

export default Product;
