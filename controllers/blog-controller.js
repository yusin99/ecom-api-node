const Blog = require("../models/blogModel");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const validateMongoDBId = require("../utils/validateMDBId");

const createBlogPost = asyncHandler(async (req, res, next) => {
  try {
    const newPost = await Blog.create(req.body);
    res.json({ status: "success", newPost });
  } catch (error) {
    throw new Error(error);
  }
});
const updateBlogPost = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    validateMongoDBId(id);
    try {
      const updatedBlogPost = await Blog.findOneAndUpdate(id, req.body, {
        new: true,
      });
      res.json({ updatedBlogPost });
    } catch (error) {
      throw new Error(error);
    }
});
const deleteBlogPost = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    validateMongoDBId(id);
    try {
      const deleteBlogPost = await Blog.findByIdAndDelete(id);
      res.json({ deleteBlogPost });
    } catch (error) {
      throw new Error(error);
    }
});
const getSingleBlogPost = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    validateMongoDBId(id);
    try {
      const getPost = await Blog.findById(id);
      if (!getPost) {
        return res
          .status(404)
          .json({ message: "Post not found", status: 404 });
      }
      res.json({ getPost });
    } catch (error) {
      throw new Error(error);
    }
});
const getAllBlogPosts = asyncHandler(async (req, res, next) => {
    try {
      const getPost = await Blog.find();
      if (!getPost) {
        return res
          .status(404)
          .json({ message: "Post not found", status: 404 });
      }
      res.json({ getPost });
    } catch (error) {
      throw new Error(error);
    }
});

module.exports = { createBlogPost, updateBlogPost, deleteBlogPost, getSingleBlogPost, getAllBlogPosts };
