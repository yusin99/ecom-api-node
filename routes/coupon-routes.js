const express = require("express");
const router = express.Router();
const { createCoupon } = require("../controllers/coupon-controller");
const { authMiddleware, isAdmin } = require("../middlewares/auth-middleware");

router.post("/", authMiddleware, isAdmin, createCoupon);

module.exports = router;
