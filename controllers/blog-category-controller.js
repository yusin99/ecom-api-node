const BCategory = require("../models/blogCategoryModel");
const asyncHandler = require("express-async-handler");
const validateMongoDBId = require("../utils/validateMDBId");

const createCategory = asyncHandler(async (req, res) => {
  try {
    const newCategory = await BCategory.create(req.body);
    res.json(newCategory);
  } catch (error) {
    throw new Error(error);
  }
});

const getSingleCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDBId(id);
  try {
    const category = await BCategory.findById(id);
    if (!category) {
      return res
        .status(404)
        .json({ message: "Blog category not found", status: 404 });
    }
    res.json({ category });
  } catch (error) {
    throw new Error(error);
  }
});

const getAllCategories = asyncHandler(async (req, res) => {
  try {
    const categories = await BCategory.find();
    if (!categories) {
      return res
        .status(404)
        .json({ message: "Blog categories not found", status: 404 });
    }
    res.json({ categories });
  } catch (error) {
    throw new Error(error);
  }
});

const updateSingleCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDBId(id);
  try {
    const category = await BCategory.findByIdAndUpdate(
      id,
      {
        name: req?.body?.name,
      },
      { new: true }
    );
    res.json({ category });
  } catch (error) {
    throw new Error(error);
  }
});

const deleteSingleCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  validateMongoDBId(id);
  try {
    const category = await BCategory.findByIdAndDelete(id);
    res.json({ category });
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
