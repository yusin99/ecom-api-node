const express = require("express");
const router = express.Router();
const {
  createProduct,
  updateSingleProduct,
  deleteSingleProduct,
  getSingleProduct,
  getAllProducts,
  addToWishlist,
} = require("../controllers/product-controller");
const { isAdmin, authMiddleware } = require("../middlewares/auth-middleware");

router.post("/", authMiddleware, isAdmin, createProduct);
router.get("/:id", getSingleProduct);
router.get("/", getAllProducts);
router.delete("/:id", authMiddleware, isAdmin, deleteSingleProduct);
router.put("/wishlist", authMiddleware, isAdmin, addToWishlist);
router.put("/:id", authMiddleware, isAdmin, updateSingleProduct);

module.exports = router;
