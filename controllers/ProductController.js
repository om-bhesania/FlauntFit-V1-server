import Product from "../models/ProductsModel.js"; // Ensure correct import path

// Custom validation function for product data
const validateProductData = (data) => {
  const errors = {};

  if (!data.productName) {
    errors.productName = "Product Name is required";
  }

  if (data.productDescription && data.productDescription.length > 1000) {
    errors.productDescription = "Description can't exceed 1000 characters";
  }

  if (!data.category) {
    errors.category = "Category is required";
  }

  if (!data.subcategory) {
    errors.subcategory = "Subcategory is required";
  }

  if (!data.productType) {
    errors.productType = "Product Type is required";
  }

  if (!data.brand) {
    errors.brand = "Brand is required";
  }

  if (data.price === undefined || data.price === null) {
    errors.price = "Price is required";
  } else if (typeof data.price !== "number" || data.price <= 0) {
    errors.price = "Price must be a positive number";
  }

  if (data.salePrice !== undefined) {
    if (data.salePrice <= 0) {
      errors.salePrice = "Sale Price must be positive";
    } else if (data.salePrice > data.price) {
      errors.salePrice = "Sale Price should be less than or equal to Price";
    }
  }

  if (!data.sku) {
    errors.sku = "SKU is required";
  }

  if (data.quantityInStock === undefined || data.quantityInStock === null) {
    errors.quantityInStock = "Stock quantity is required";
  } else if (
    !Number.isInteger(data.quantityInStock) ||
    data.quantityInStock < 0
  ) {
    errors.quantityInStock =
      "Quantity cannot be negative and must be an integer";
  }

  if (data.careInstructions && data.careInstructions.length > 500) {
    errors.careInstructions = "Care instructions can't exceed 500 characters";
  }
  if (
    !data.mediaContent ||
    !Array.isArray(data.mediaContent) ||
    data.mediaContent.length === 0
  ) {
    errors.mediaContent = "At least one product image is required";
  }

  const validStatuses = ["In Stock", "Out of Stock", "Discontinued"];
  if (!data.inventoryStatus || !validStatuses.includes(data.inventoryStatus)) {
    errors.inventoryStatus = "Invalid status";
  }

  return errors;
};

const formatErrorResponse = (errors) => {
  const messages = Object.values(errors);
  console.log(messages);
  return {
    messages,
  };
};
export const createProduct = async (req, res) => {
  const errors = validateProductData(req.body);
  if (Object.keys(errors).length) {
    return res.status(400).json(formatErrorResponse(errors));
  }

  try {
    const newProduct = await Product.create(req.body);
    return res.status(201).json({
      message: "Product created successfully",
      newProduct,
    });
  } catch (error) {
    return res.status(500).json(formatErrorResponse(error));
  }
};

export const getProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    return res.status(200).json({
      message: "Products retrieved successfully",
      count: products.length,
      products,
    });
  } catch (error) {
    return res.status(500).json(formatErrorResponse(error));
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    return res.status(200).json({
      message: "Product retrieved successfully",
      product,
      count: product.length,
    });
  } catch (error) {
    return res.status(500).json(formatErrorResponse(error));
  }
};

export const updateProduct = async (req, res) => {
  const errors = validateProductData(req.body);
  if (Object.keys(errors).length) {
    return res.status(400).json({ errors });
  }

  try {
    const [updatedRows, updatedProducts] = await Product.update(req.body, {
      where: { id: req.params.id },
      returning: true,
    });
    if (!updatedRows)
      return res.status(404).json({ message: "Product not found" });
    return res.status(200).json({
      message: "Product updated successfully",
      updatedProduct: updatedProducts[0],
    });
  } catch (error) {
    return res.status(500).json(formatErrorResponse(error));
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.destroy({
      where: { id: req.params.id },
    });
    if (!deletedProduct)
      return res.status(404).json({ message: "Product not found" });
    return res.status(204).send({
      message: "Product deleted successfully",
    }); // No content
  } catch (error) {
    return res.status(500).json(formatErrorResponse(error));
  }
};
