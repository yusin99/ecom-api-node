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
} = require("../controllers/user-controller");
const { authMiddleware, isAdmin } = require("../middlewares/auth-middleware");
const router = express.Router();

router.post("/register", createUser);
router.post("/login", loginUser);
router.post("/admin-login", loginUserAdmin);
router.post("/logout", logoutUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

router.get("/all-users", authMiddleware, getAllUsers);
router.get("/refresh", handleRefreshToken);
router.get("/wishlist", authMiddleware, getWishlist);
router.get("/:id", authMiddleware, isAdmin, getSingleUsers);

router.delete("/:id", authMiddleware, isAdmin, deleteSingleUser);

router.put("/edit-user", authMiddleware, isAdmin, updateSingleUser);
router.put("/block-user/:id", authMiddleware, isAdmin, blockSingleUser);
router.put("/unblock-user/:id", authMiddleware, isAdmin, unblockSingleUser);
router.put("/update-password", authMiddleware, updatePassword);

module.exports = router;
