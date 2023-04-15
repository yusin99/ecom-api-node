const express = require("express");
const {
  createBrand,
  getSingleBrand,
  getAllBrands,
  updateSingleBrand,
  deleteSingleBrand,
} = require("../controllers/brand-controller");
const { authMiddleware, isAdmin } = require("../middlewares/auth-middleware");

const router = express.Router();

router.post("/", authMiddleware, isAdmin, createBrand);
router.get("/all-brands", authMiddleware, isAdmin, getAllBrands);
router.get("/:id", authMiddleware, isAdmin, getSingleBrand);
router.put("/:id", authMiddleware, isAdmin, updateSingleBrand);
router.delete("/:id", authMiddleware, isAdmin, deleteSingleBrand);

module.exports = router;
