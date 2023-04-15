const Coupon = require("../models/couponModel");
const asyncHandler = require("express-async-handler");
const validateMongoDBId = require("../utils/validateMDBId");

const createCoupon = asyncHandler(async (req, res) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.json({ coupon });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = { createCoupon };
