const Category = require("../models/categoryModel");
const asyncHandler = require("express-async-handler");
const validateMongoDBId = require("../utils/validateMDBId");

const createCategory = asyncHandler(async (req, res) => {
  try {
    const newCategory = await Category.create(req.body);
    res.json(newCategory);
  } catch (error) {
    throw new Error(error);
  }
});

const getSingleCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDBId(id);
  try {
    const category = await Category.findById(id);
    if (!category) {
      return res
        .status(404)
        .json({ message: "Category not found", status: 404 });
    }
    res.json(category);
  } catch (error) {
    throw new Error(error);
  }
});

const getAllCategories = asyncHandler(async (req, res) => {
  try {
    const categories = await Category.find();
    if (!categories) {
      return res
        .status(404)
        .json({ message: "Categories not found", status: 404 });
    }
    res.json(categories);
  } catch (error) {
    throw new Error(error);
  }
});

const updateSingleCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDBId(id);
  try {
    const category = await Category.findByIdAndUpdate(
      id,
      {
        name: req?.body?.name,
      },
      { new: true }
    );
    res.json(category);
  } catch (error) {
    throw new Error(error);
  }
});

const deleteSingleCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  validateMongoDBId(id);
  try {
    const category = await Category.findByIdAndDelete(id);
    res.json(category);
  } catch (error) {
    throw new Error(error);
  }
});
module.exports = {
  createCategory,
  getSingleCategory,
  getAllCategories,
  updateSingleCategory,
  deleteSingleCategory,
};
