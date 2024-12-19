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
      required: true,
      validate: {
        validator: (value) => value >= 0,
        message: "Quantity in stock must be a positive number",
      },
    },
    productImages: {
      type: [String], // Array of strings
      default: [],
    },
    video: {
      type: String,
    },
    sizeOptions: {
      type: String,
    },
    colorOptions: {
      type: String,
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
      enum: ["In Stock", "Out of Stock", "Discontinued"],
      required: true,
    },
    countryOfOrigin: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Create and export the Product model
const Product = mongoose.model("Product", ProductSchema);

export default Product;
