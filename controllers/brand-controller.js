const Brand = require("../models/brandModel");
const asyncHandler = require("express-async-handler");
const validateMongoDBId = require("../utils/validateMDBId");

const createBrand = asyncHandler(async (req, res) => {
  try {
    const brand = await Brand.create(req.body);
    res.json(brand);
  } catch (error) {
    throw new Error(error);
  }
});

const getSingleBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDBId(id);
  try {
    const brand = await Brand.findById(id);
    if (!brand) {
      return res.status(404).json({ message: "Brand not found", status: 404 });
    }
    res.json(brand);
  } catch (error) {
    throw new Error(error);
  }
});

const getAllBrands = asyncHandler(async (req, res) => {
  try {
    const brands = await Brand.find();
    if (!brands) {
      return res.status(404).json({ message: "Brands not found", status: 404 });
    }
    res.json(brands);
  } catch (error) {
    throw new Error(error);
  }
});

const updateSingleBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDBId(id);
  try {
    const brand = await Brand.findByIdAndUpdate(
      id,
      {
        name: req?.body?.name,
      },
      { new: true }
    );
    res.json(brand);
  } catch (error) {
    throw new Error(error);
  }
});

const deleteSingleBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  validateMongoDBId(id);
  try {
    const brand = await Brand.findByIdAndDelete(id);
    res.json(brand);
  } catch (error) {
    throw new Error(error);
  }
});
module.exports = {
  createBrand,
  getSingleBrand,
  getAllBrands,
  updateSingleBrand,
  deleteSingleBrand,
};
