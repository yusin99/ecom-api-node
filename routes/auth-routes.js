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
} = require("../controllers/user-controller");
const { authMiddleware, isAdmin } = require("../middlewares/auth-middleware");
const router = express.Router();

router.post("/register", createUser);
router.post("/login", loginUser);
router.get("/all-users", authMiddleware, getAllUsers);
router.get("/:id", authMiddleware, isAdmin, getSingleUsers);
router.delete("/:id",authMiddleware, isAdmin, deleteSingleUser);
router.put("/edit-user", authMiddleware, isAdmin, updateSingleUser);
router.put("/block-user/:id", authMiddleware, isAdmin, blockSingleUser);
router.put("/unblock-user/:id", authMiddleware, isAdmin, unblockSingleUser);

module.exports = router;
