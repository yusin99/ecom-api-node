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
    if (!deleteBlogPost) {
      throw new Error("Coudn't delete blog post! Blog post was not found");
    } else {
      res.json({ deleteBlogPost });
    }
  } catch (error) {
    throw new Error(error);
  }
});
const getSingleBlogPost = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  validateMongoDBId(id);
  try {
    const blogPost = await Blog.findById(id)
      .populate("likes")
      .populate("dislikes");
    const updateViews = await Blog.findByIdAndUpdate(
      id,
      {
        $inc: { numViews: 1 },
      },
      { new: true }
    );
    res.json({ blogPost });
  } catch (error) {
    throw new Error(error);
  }
});
const getAllBlogPosts = asyncHandler(async (req, res, next) => {
  try {
    const posts = await Blog.find();
    if (!posts) {
      return res.status(404).json({ message: "Post not found", status: 404 });
    }
    res.json({ posts });
  } catch (error) {
    throw new Error(error);
  }
});
const likeBlogPost = asyncHandler(async (req, res) => {
  const { blogId } = req.body;
  validateMongoDBId(blogId);
  const blog = await Blog.findById(blogId);
  const loginUserId = req?.user?.id;
  const isLiked = blog?.isLiked;
  const alreadyDisliked = blog?.dislikes?.find(
    (userId) => userId?.toString() === loginUserId?.toString()
  );
  if (alreadyDisliked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { dislikes: loginUserId },
        isDisliked: false,
      },
      { new: true }
    );
    res.json(blog);
  }
  if (isLiked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { likes: loginUserId },
        isLiked: false,
      },
      { new: true }
    );
    res.json(blog);
  } else {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $push: { likes: loginUserId },
        isLiked: true,
      },
      { new: true }
    );
    res.json(blog);
  }
});
const dislikeBlogPost = asyncHandler(async (req, res) => {
  const { blogId } = req.body;
  validateMongoDBId(blogId);
  const blog = await Blog.findById(blogId);
  const loginUserId = req?.user?._id;
  const isDisLiked = blog?.isDisliked;
  const alreadyLiked = blog?.likes?.find(
    (userId) => userId?.toString() === loginUserId?.toString()
  );
  if (alreadyLiked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { likes: loginUserId },
        isLiked: false,
      },
      { new: true }
    );
    res.json(blog);
  }
  if (isDisLiked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { dislikes: loginUserId },
        isDisliked: false,
      },
      { new: true }
    );
    res.json(blog);
  } else {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $push: { dislikes: loginUserId },
        isDisliked: true,
      },
      { new: true }
    );
    res.json(blog);
  }
});

module.exports = {
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  getSingleBlogPost,
  getAllBlogPosts,
  likeBlogPost,
  dislikeBlogPost,
};
