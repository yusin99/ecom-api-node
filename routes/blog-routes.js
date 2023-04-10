const express = require("express");
const { authMiddleware, isAdmin } = require("../middlewares/auth-middleware");
const {
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  getSingleBlogPost,
  getAllBlogPosts,
  likeBlogPost,
  dislikeBlogPost,
} = require("../controllers/blog-controller");
const router = express.Router();

router.put("/like-post", authMiddleware, likeBlogPost);
router.put("/dislike-post", authMiddleware, dislikeBlogPost);
router.post("/", authMiddleware, isAdmin, createBlogPost);
router.put("/:id", authMiddleware, isAdmin, updateBlogPost);
router.delete("/:id", authMiddleware, isAdmin, deleteBlogPost);
router.get("/all-posts", authMiddleware, isAdmin, getAllBlogPosts);
router.get("/:id", authMiddleware, isAdmin, getSingleBlogPost);

module.exports = router;
