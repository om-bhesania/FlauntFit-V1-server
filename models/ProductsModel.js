import { DataTypes } from "sequelize";
import sequelize from "../config/config.js";

const Product = sequelize.define(
  "Product",
  {
    productName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    productDescription: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [0, 1000],
          msg: "Description can't exceed 1000 characters",
        },
      },
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    subcategory: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    productType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    brand: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        isFloat: { msg: "Price must be a positive number" },
        min: 0,
      },
    },
    salePrice: {
      type: DataTypes.FLOAT,
      validate: {
        isFloat: true,
        min: 0,
        max(value) {
          if (value > this.price) {
            throw new Error("Sale Price should be less than or equal to Price");
          }
        },
      },
    },
    sku: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    quantityInStock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    productImages: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: [],
    },

    video: {
      type: DataTypes.STRING,
    },
    sizeOptions: {
      type: DataTypes.STRING,
    },
    colorOptions: {
      type: DataTypes.STRING,
    },
    careInstructions: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [0, 500],
          msg: "Care instructions can't exceed 500 characters",
        },
      },
    },
    inventoryStatus: {
      type: DataTypes.ENUM("In Stock", "Out of Stock", "Discontinued"),
      allowNull: false,
    },
    countryOfOrigin: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

export default Product;
