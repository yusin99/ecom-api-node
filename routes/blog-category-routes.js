const express = require("express");
const {
  createCategory,
  getSingleCategory,
  getAllCategories,
  updateSingleCategory,
  deleteSingleCategory,
} = require("../controllers/blog-category-controller");
const { authMiddleware, isAdmin } = require("../middlewares/auth-middleware");

const router = express.Router();

router.post("/", authMiddleware, isAdmin, createCategory);
router.get("/all-blog-categories", authMiddleware, isAdmin, getAllCategories);
router.get("/:id", authMiddleware, isAdmin, getSingleCategory);
router.put("/:id", authMiddleware, isAdmin, updateSingleCategory);
router.delete("/:id", authMiddleware, isAdmin, deleteSingleCategory);

module.exports = router;
