const express = require("express");
const router = express.Router();
const {
  createCoupon,
  getAllCoupons,
  getSingleCoupon,
  updateSingleCoupon,
  deleteSingleCoupon,
} = require("../controllers/coupon-controller");
const { authMiddleware, isAdmin } = require("../middlewares/auth-middleware");

router.post("/", authMiddleware, isAdmin, createCoupon);
router.get("/all-coupons", authMiddleware, isAdmin, getAllCoupons);
router.get("/:id", authMiddleware, isAdmin, getSingleCoupon);
router.put("/:id", authMiddleware, isAdmin, updateSingleCoupon);
router.delete("/:id", authMiddleware, isAdmin, deleteSingleCoupon);

module.exports = router;
