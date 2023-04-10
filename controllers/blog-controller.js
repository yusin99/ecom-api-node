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
  const { postId } = req.body;
  validateMongoDBId(postId);
  const blog = await Blog.findById(postId);
  const loginUserId = req?.user?._id; // Use _id instead of id
  const isLiked = blog?.isLiked;
  const alreadyDisliked = blog?.dislikes?.includes(loginUserId); // Use includes() instead of find()
  let updatedBlog = null; // Declare a variable to store the updated blog object

  if (alreadyDisliked) {
    updatedBlog = await Blog.findByIdAndUpdate(
      postId,
      {
        $pull: { dislikes: loginUserId },
        isDisliked: false,
      },
      { new: true }
    );
  }

  if (isLiked) {
    updatedBlog = await Blog.findByIdAndUpdate(
      postId,
      {
        $pull: { likes: loginUserId },
        isLiked: false,
      },
      { new: true }
    );
  } else {
    updatedBlog = await Blog.findByIdAndUpdate(
      postId,
      {
        $push: { likes: loginUserId },
        isLiked: true,
      },
      { new: true }
    );
  }

  res.json({ blog: updatedBlog }); // Send the updated blog object in the response
});
const dislikeBlogPost = asyncHandler(async (req, res) => {
  const { postId } = req.body;
  // Validate postId as a valid MongoDB ObjectID
  validateMongoDBId(postId);

  // Find the blog post by ID
  const blog = await Blog.findById(postId);

  const loginUserId = req?.user?._id;
  const alreadyLiked = blog?.likes?.includes(loginUserId);
  const isDisliked = blog?.dislikes?.includes(loginUserId);

  // Check if the user has already liked the blog post
  if (alreadyLiked) {
    const updatedBlog = await Blog.findByIdAndUpdate(
      postId,
      {
        $pull: { likes: loginUserId },
        isLiked: false,
      },
      { new: true }
    );
    res.json({ blog: updatedBlog });
  }
  // Check if the blog post is already disliked
  else if (isDisliked) {
    const updatedBlog = await Blog.findByIdAndUpdate(
      postId,
      {
        $pull: { dislikes: loginUserId },
        isDisliked: false,
      },
      { new: true }
    );
    res.json({ blog: updatedBlog });
  }
  // If not already liked or disliked, add the dislike for the user
  else {
    const updatedBlog = await Blog.findByIdAndUpdate(
      postId,
      {
        $push: { dislikes: loginUserId },
        isDisliked: true,
      },
      { new: true }
    );
    res.json({ blog: updatedBlog });
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
