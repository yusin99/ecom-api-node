const express = require("express");
const {
  createUser,
  loginUser,
  getAllUsers,
  getSingleUsers,
  deleteSingleUser,
  updateSingleUser,
  blockSingleUser,
  unblockSingleUser,
  handleRefreshToken,
  updatePassword,
  logoutUser,
  forgotPassword,
  resetPassword,
  loginUserAdmin,
  getWishlist,
  updateAddress,
  userCart,
  getUserCart,
  emptyCart,
  applyCoupon,
  createOrder,
  getAllUserOrders,
  updateOrderStatus,
} = require("../controllers/user-controller");
const { authMiddleware, isAdmin } = require("../middlewares/auth-middleware");
const router = express.Router();

router.post("/register", createUser);
router.post("/login", loginUser);
router.post("/admin-login", loginUserAdmin);
router.post("/logout", logoutUser);
router.post("/cart", authMiddleware, userCart);
router.post("/apply-coupon", authMiddleware, applyCoupon);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/cart/create-order", authMiddleware, createOrder);

router.get("/all-users", authMiddleware, getAllUsers);
router.get("/refresh", handleRefreshToken);
router.get("/wishlist", authMiddleware, getWishlist);
router.get("/cart", authMiddleware, getUserCart);
router.get("/orders", authMiddleware, getAllUserOrders);
router.get("/:id", authMiddleware, isAdmin, getSingleUsers);

router.delete("/empty-cart", authMiddleware, emptyCart);
router.delete("/:id", authMiddleware, isAdmin, deleteSingleUser);

router.put("/edit-user", authMiddleware, isAdmin, updateSingleUser);
router.put("/block-user/:id", authMiddleware, isAdmin, blockSingleUser);
router.put("/unblock-user/:id", authMiddleware, isAdmin, unblockSingleUser);
router.put("/update-password", authMiddleware, updatePassword);
router.put("/update-address", authMiddleware, updateAddress);
router.put("/order/update-order-status/:id", authMiddleware, isAdmin, updateOrderStatus);

module.exports = router;
