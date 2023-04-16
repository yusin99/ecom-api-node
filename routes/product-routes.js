const express = require("express");
const router = express.Router();
const {
  createProduct,
  updateSingleProduct,
  deleteSingleProduct,
  getSingleProduct,
  getAllProducts,
  addToWishlist,
  rating,
  uploadImages,
} = require("../controllers/product-controller");
const { isAdmin, authMiddleware } = require("../middlewares/auth-middleware");
const {
  uploadImage,
  productImgResize,
} = require("../middlewares/upload-image-middleware");

router.put(
  "/upload-image/:id",
  authMiddleware,
  isAdmin,
  uploadImage.array("images", 10),
  productImgResize,
  uploadImages
);
router.post("/", authMiddleware, isAdmin, createProduct);
router.get("/:id", getSingleProduct);
router.get("/", getAllProducts);
router.delete("/:id", authMiddleware, isAdmin, deleteSingleProduct);
router.put("/wishlist", authMiddleware, isAdmin, addToWishlist);
router.put("/rating", authMiddleware, rating);
router.put("/:id", authMiddleware, isAdmin, updateSingleProduct);

module.exports = router;
