const BCategory = require("../models/blogCategoryModel");
const asyncHandler = require("express-async-handler");
const validateMongoDBId = require("../utils/validateMDBId");

/**
 * @description Creates a new blog category
 * @route POST /api/blog-category
 * @access Private
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @returns {json} - JSON object containing the newly created blog category
 */
const createCategory = asyncHandler(async (req, res) => {
  try {
    const newCategory = await BCategory.create(req.body);
    res.json(newCategory);
  } catch (error) {
    throw new Error(error);
  }
});

/**
 * @description Retrieves a single blog category by ID
 * @route GET /api/blog-category/:id
 * @access Public
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @returns {json} - JSON object containing the retrieved blog category or an error message
 */
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

/**
 * @description Retrieves all blog categories
 * @route GET /api/blog-category/all-blog-categories
 * @access Public
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @returns {json} - JSON object containing the retrieved blog categories or an error message
 */
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

/**
 * @description Updates a single blog category by ID
 * @route PUT /api/blog-category/:id
 * @access Private
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @returns {json} - JSON object containing the updated blog category or an error message
 * @throws {Error} - If an error occurs during category update
 */
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

/**
 * @description Deletes a single blog category by ID
 * @route DELETE /api/blog-category/:id
 * @access Private
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @returns {json} - JSON object containing the deleted blog category or an error message
 * @throws {Error} - If an error occurs during category deletion
 */
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
