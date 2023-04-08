const express = require("express");
const {
  createUser,
  loginUser,
  getAllUsers,
  getSingleUsers,
  deleteSingleUser,
  updateSingleUser,
} = require("../controllers/user-controller");
const router = express.Router();

router.post("/register", createUser);
router.post("/login", loginUser);
router.get("/all-users", getAllUsers);
router.get("/:id", getSingleUsers);
router.delete("/:id", deleteSingleUser);
router.put("/:id", updateSingleUser);

module.exports = router;
