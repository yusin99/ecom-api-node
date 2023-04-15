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

const getAllCoupons = asyncHandler(async (req, res) => {
  try {
    const coupons = await Coupon.find();
    res.json({ coupons });
  } catch (error) {
    throw new Error(error);
  }
});

const getSingleCoupon = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDBId(id);
  try {
    const coupons = await Coupon.findById(id);
    if (!coupons) {
      return res.status(404).json({ message: "Coupon not found", status: 404 });
    }
    res.json({ coupons });
  } catch (error) {
    throw new Error(error);
  }
});

const updateSingleCoupon = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDBId(id);
  try {
    const coupon = await Coupon.findOneAndUpdate(id, req.body, {
      new: true,
    });
    res.json({ coupon });
  } catch (error) {
    throw new Error(error);
  }
});

const deleteSingleCoupon = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  validateMongoDBId(id);
  try {
    const coupon = await Coupon.findByIdAndDelete(id);
    res.json({ coupon });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createCoupon,
  getAllCoupons,
  getSingleCoupon,
  updateSingleCoupon,
  deleteSingleCoupon,
};
