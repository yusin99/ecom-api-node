const Product = require("../models/productModel");
const asyncHandler = require("express-async-handler");
const validateMongoDBId = require("../utils/validateMDBId");
const slugify = require("slugify")

const createProduct = asyncHandler(async (req, res, next) => {
  try {
    const newProduct = await Product.create(req.body);
    res.json({ newProduct });
  } catch (error) {
    throw new Error(error);
  }
});
const updateSingleProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  validateMongoDBId(id);
  try {
    if (req.body.title) {
        req.body.slug = slugify(req.body.title);
    }
    const updateProduct = await Product.findOneAndUpdate(id , req.body, {
      new: true,
    });
    res.json({updateProduct});
  } catch (error) {
    throw new Error(error);
  }
});
const deleteSingleProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  validateMongoDBId(id);
  try {
    const deleteProduct = await Product.findByIdAndDelete(id);
    res.json({ deleteProduct });
  } catch (error) {
    throw new Error(error);
  }
});
const getSingleProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  validateMongoDBId(id);
  try {
    const getProduct = await Product.findById(id);
    if (!getProduct) {
      return res
        .status(404)
        .json({ message: "Product not found", status: 404 });
    }
    res.json({ getProduct });
  } catch (error) {
    throw new Error(error);
  }
});
const getAllProducts = asyncHandler(async (req, res, next) => {
  try {
    const getProducts = await Product.find();
    res.json({ getProducts });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createProduct,
  updateSingleProduct,
  deleteSingleProduct,
  getSingleProduct,
  getAllProducts,
};
