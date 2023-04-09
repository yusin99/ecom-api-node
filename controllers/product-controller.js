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
const getAllProducts = asyncHandler(async (req, res) => {
  try {
    // Filtering
    const queryObj = { ...req.query };
    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach((el) => delete queryObj[el]);
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    let query = Product.find(JSON.parse(queryStr));

    // Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    // limiting the fields
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }

    // pagination
    const page = req.query.page;
    const limit = req.query.limit;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);
    if (req.query.page) {
      const productCount = await Product.countDocuments();
      if (skip >= productCount) throw new Error("This page does not exist");
    }
    const products = await query;
    if (products.length <= 0) {
      throw new Error("No products where found for the selected filters");
    } else {
      console.log(products.length);
      res.json({ products });
    }
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
