const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const { generateToken } = require("../config/jwt-token");
const validateMongoDBId = require("../utils/validateMDBId");
const { generateRefreshToken } = require("../config/refresh-token");
const jwt = require("jsonwebtoken");
const sendEmail = require("./email-controller");
const crypto = require("crypto");

const handleRefreshToken = asyncHandler(async (req, res, next) => {
  const cookie = req.cookies;
  if (!cookie.refreshToken)
    throw new Error("No refresh token found in cookies");
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) throw new Error("No user found with the provided refresh token");
  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err || user.id !== decoded.id) {
      throw new Error(
        "There is something wrong with the provided refresh token"
      );
    }
    const accessToken = generateToken(user?.id);
    res.json({ accessToken });
  });
});

const createUser = asyncHandler(async (req, res) => {
  const email = req.body.email;
  const findUser = await User.findOne({ email: email });

  if (!findUser) {
    //Create a new User
    const newUser = await User.create(req.body);
    res.json(newUser);
  } else {
    // User with that email alredy exists
    throw new Error("User with that email already exists");
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  // checking if user exists
  const findUser = await User.findOne({ email: email });
  if (findUser && (await findUser.isPasswordMatched(password))) {
    const refreshToken = await generateRefreshToken(findUser?.id);
    const updateUserRefreshToken = await User.findByIdAndUpdate(
      findUser?.id,
      {
        refreshToken: refreshToken,
      },
      { new: true }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });
    res.json({
      id: findUser?._id,
      firstname: findUser?.firstname,
      lastname: findUser?.lastname,
      email: findUser?.email,
      mobile: findUser?.mobile,
      token: generateToken(findUser?._id),
    });
  } else {
    throw new Error(
      "Invalid username or password. Please verify your credeltials"
    );
  }
});
const logoutUser = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken)
    throw new Error("No refresh token found in cookies");
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    return res.sendStatus(204);
  }
  await User.findOneAndUpdate(refreshToken, {
    refreshToken: "",
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  res.sendStatus(204);
});

const updateSingleUser = asyncHandler(async (req, res) => {
  const { id } = req.user;
  validateMongoDBId(id);
  try {
    const updateUser = await User.findByIdAndUpdate(
      id,
      {
        firstname: req.body?.firstname,
        lastname: req.body?.lastname,
        mobile: req.body?.mobile,
        email: req.body?.email,
      },
      { new: true }
    );
    res.json({updateUser});
  } catch (error) {
    throw new Error(error);
  }
});

const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const getUsers = await User.find();
    res.json({getUsers});
  } catch (error) {
    throw new Error(error);
  }
});

const getSingleUsers = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDBId(id);
  try {
    const getUsers = await User.findById(id);
    if (!getUsers) {
      return res.status(404).json({ message: "User not found", status: 404 });
    }
    res.json({getUsers});
  } catch (error) {
    throw new Error(error);
  }
});

const deleteSingleUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDBId(id);
  try {
    const deleteUser = await User.findByIdAndDelete(id);
    res.json({deleteUser});
  } catch (error) {
    throw new Error(error);
  }
});

const blockSingleUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDBId(id);

  try {
    const blockedUser = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: true,
      },
      { new: true }
    );
    res.json({
      message: "User blocked",
      blockedUser: blockedUser,
    });
  } catch (error) {
    throw new Error(error);
  }
});
const unblockSingleUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDBId(id);

  try {
    const unblockedUser = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: false,
      },
      { new: true }
    );
    res.json({
      message: "User unblocked",
      unblockedUser: unblockedUser,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const updatePassword = asyncHandler(async (req, res, next) => {
  const { id } = req.user;
  const { password } = req.body;
  validateMongoDBId(id);
  const user = await User.findById(id);
  if (!user) {
    throw new Error("User not found");
  }
  if (password) {
    user.password = password;
    const updatedPassword = await user.save();
    res.json({ updatedPassword });
  } else {
    res.json({ user });
  }
});

const forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found with this email");

  try {
    const token = await user.createPasswordResetToken();
    await user.save();
    const resetURL = `Hello!
    Please click on the following link in order to reset your password. This link is valid for only 10 minutes, after that, you are obliged to restart the procedure! <a href='http://localhost:5000/api/user/reset-password/${token}'>LINK</a>`;
    const data = {
      to: email,
      text: "Lorem ipsum...",
      subject: "Reset password Ecom Store",
      htm: resetURL,
    };
    sendEmail(data);
    res.json({token});
  } catch (error) {
    throw new Error(error);
  }
});

const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) throw new Error("Token Expired! Restart the process");
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  res.json({user});
});
module.exports = {
  createUser,
  loginUser,
  getAllUsers,
  getSingleUsers,
  deleteSingleUser,
  updateSingleUser,
  blockSingleUser,
  unblockSingleUser,
  handleRefreshToken,
  logoutUser,
  updatePassword,
  forgotPassword,
  resetPassword,
};
