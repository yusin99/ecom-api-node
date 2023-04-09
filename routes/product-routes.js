const express = require("express");
const router = express.Router();
const {
  createProduct,
  updateSingleProduct,
  deleteSingleProduct,
  getSingleProduct,
  getAllProducts,
} = require("../controllers/product-controller");
const { isAdmin, authMiddleware } = require("../middlewares/auth-middleware");

router.post("/", authMiddleware, isAdmin, createProduct);
router.get("/:id", authMiddleware, isAdmin, getSingleProduct);
router.get("/", authMiddleware, isAdmin, getAllProducts);
router.delete("/:id", authMiddleware, isAdmin, deleteSingleProduct);
router.put("/:id", authMiddleware, isAdmin, updateSingleProduct);

module.exports = router;
