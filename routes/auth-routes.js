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
} = require("../controllers/user-controller");
const { authMiddleware, isAdmin } = require("../middlewares/auth-middleware");
const router = express.Router();

router.get("/refresh", handleRefreshToken);
router.post("/register", createUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/all-users", authMiddleware, getAllUsers);
router.get("/:id", authMiddleware, isAdmin, getSingleUsers);
router.delete("/:id", authMiddleware, isAdmin, deleteSingleUser);
router.put("/edit-user", authMiddleware, isAdmin, updateSingleUser);
router.put("/block-user/:id", authMiddleware, isAdmin, blockSingleUser);
router.put("/unblock-user/:id", authMiddleware, isAdmin, unblockSingleUser);
router.put("/update-password", authMiddleware, updatePassword);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

module.exports = router;
