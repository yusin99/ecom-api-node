const User = require("../models/userModel");
const Product = require("../models/productModel");
const Cart = require("../models/cartModel");
const Coupon = require("../models/couponModel");
const Order = require("../models/orderModel");
const asyncHandler = require("express-async-handler");
const { generateToken } = require("../config/jwt-token");
const validateMongoDBId = require("../utils/validateMDBId");
const { generateRefreshToken } = require("../config/refresh-token");
const jwt = require("jsonwebtoken");
const sendEmail = require("./email-controller");
const crypto = require("crypto");
const uniqid = require("uniqid");

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

const loginUserAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  // checking if user exists
  const admin = await User.findOne({ email: email });
  if (admin.role !== "admin") throw new Error("Not authorized");
  if (admin && (await admin.isPasswordMatched(password))) {
    const refreshToken = await generateRefreshToken(admin?.id);
    const updateUserRefreshToken = await User.findByIdAndUpdate(
      admin?.id,
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
      id: admin?._id,
      firstname: admin?.firstname,
      lastname: admin?.lastname,
      email: admin?.email,
      mobile: admin?.mobile,
      token: generateToken(admin?._id),
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
    res.json({ updateUser });
  } catch (error) {
    throw new Error(error);
  }
});

const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const getUsers = await User.find();
    res.json({ getUsers });
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
    res.json({ getUsers });
  } catch (error) {
    throw new Error(error);
  }
});

const deleteSingleUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDBId(id);
  try {
    const deleteUser = await User.findByIdAndDelete(id);
    res.json({ deleteUser });
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
    res.json({ token });
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
  res.json({ user });
});

const getWishlist = asyncHandler(async (req, res) => {
  const { id } = req.user;
  try {
    const user = await User.findById(id).populate("wishlist");
    res.json({ wishlist: user.wishlist });
  } catch (error) {
    throw new Error(error);
  }
});

const updateAddress = asyncHandler(async (req, res) => {
  const { id } = req.user;
  validateMongoDBId(id);
  try {
    const user = await User.findByIdAndUpdate(
      id,
      {
        address: req.body?.address,
      },
      { new: true }
    );
    res.json({ user });
  } catch (error) {
    throw new Error(error);
  }
});

const userCart = asyncHandler(async (req, res) => {
  const { cart } = req.body;
  const { id } = req.user;
  validateMongoDBId(id);
  try {
    let products = [];
    const user = await User.findById(id);
    const existingCart = await Cart.findOne({ ordered_by: user.id });
    if (existingCart) {
      await Cart.findOneAndDelete({ _id: existingCart._id });
    }
    for (let i = 0; i < cart.length; i++) {
      let object = {};
      let price = await Product.findById(cart[i]._id).select("price").exec();
      object.product = cart[i]._id;
      object.count = cart[i].count;
      object.color = cart[i].color;
      object.price = price.price;
      products.push(object);
    }
    let cartTotal = 0;
    for (let i = 0; i < products.length; i++) {
      cartTotal = cartTotal + products[i].price * products[i].count;
    }
    let updatedCart = await new Cart({
      products,
      cart_total: cartTotal.toFixed(2),
      ordered_by: user.id,
    }).save();
    res.json({ updatedCart });
  } catch (error) {
    throw new Error(error);
  }
});

const getUserCart = asyncHandler(async (req, res) => {
  const { id } = req.user;
  validateMongoDBId(id);

  try {
    const cart = await Cart.findOne({ ordered_by: id }).populate(
      "products.product",
      "id title brand price images total_after_discount"
    );
    res.json({ cart });
  } catch (error) {
    throw new Error(error);
  }
});

const emptyCart = asyncHandler(async (req, res) => {
  const { id } = req.user;
  validateMongoDBId(id);
  try {
    const user = await User.findById(id);
    const cart = await Cart.findOneAndRemove({ ordered_by: user.id });
    res.json({ cart });
  } catch (error) {
    throw new Error(error);
  }
});

const applyCoupon = asyncHandler(async (req, res) => {
  const { id } = req.user;
  validateMongoDBId(id);
  const coupon = req.body;
  const validCoupon = await Coupon.findOne({ name: coupon.coupon });

  if (!validCoupon) {
    return res.status(400).json({ error: "Invalid coupon", status: 400 });
  }

  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({ error: "User not found", status: 404 });
  }

  const cart = await Cart.findOne({ ordered_by: user.id }).populate(
    "products.product"
  );
  if (!cart) {
    return res.status(404).json({ error: "Cart not found", status: 404 });
  }

  let { cart_total } = cart;
  let totalAfterDiscount = (
    cart_total -
    (cart_total * validCoupon.discount) / 100
  ).toFixed(2);
  await Cart.findOneAndUpdate(
    { ordered_by: user.id },
    { total_after_discount: totalAfterDiscount },
    { new: true }
  );
  res.json({ totalAfterDiscount });
});

const createOrder = asyncHandler(async (req, res) => {
  const { COD, couponApplied } = req.body;
  const { id } = req.user;
  validateMongoDBId(id);
  try {
    if (!COD) {
      throw new Error("Cash on Delivery failed");
    }

    const user = await User.findById(id);
    if (!user) {
      throw new Error("User not found");
    }

    let userCart = await Cart.findOne({ ordered_by: user.id });
    if (!userCart) {
      throw new Error("Cart not found");
    }

    let finalAmount = 0;
    if (couponApplied && userCart.total_after_discount) {
      finalAmount = userCart.total_after_discount;
    } else {
      finalAmount = userCart.cart_total;
    }

    let order = await new Order({
      products: userCart.products,
      paymentIntent: {
        id: uniqid(),
        method: "COD",
        amount: finalAmount,
        status: "Cash on Delivery",
        created: Date.now(),
        currency: "USD",
      },
      ordered_by: user.id,
      orderStatus: "Cash on Delivery",
    }).save();

    let updateQuantity = userCart.products.map((item) => {
      return {
        updateOne: {
          filter: { id: item.product.id },
          update: { $inc: { quantity: -item.count, sold: +item.count } },
        },
      };
    });

    const updatedProduct = await Product.bulkWrite(updateQuantity, {});
    res.json({ message: "Success" });
  } catch (error) {
    throw new Error(error);
  }
});

const getAllOrders = asyncHandler(async (req, res) => {
  try {
    const orders = await Orders.find();
    res.json({ orders });
  } catch (error) {
    throw new Error(error);
  }
});

const getAllUserOrders = asyncHandler(async (req, res) => {
  const { id } = req.user;
  validateMongoDBId(id);
  try {
    const orders = await Order.findOne({ ordered_by: id })
      .populate("products.product")
      .exec();
    console.log(orders, id);
    res.json({ orders });
  } catch (error) {
    throw new Error(error);
  }
});

const getSingleOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDBId(id);
  try {
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found", status: 404 });
    }
    res.json({ order });
  } catch (error) {
    throw new Error(error);
  }
});

const deleteSingleOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDBId(id);
  try {
    const deletedOrder = await Order.findByIdAndDelete(id);
    res.json({ deletedOrder });
  } catch (error) {
    throw new Error(error);
  }
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;
  validateMongoDBId(id);
  try {
    const order = await Order.findByIdAndUpdate(
      id,
      {
        orderStatus: status,
        paymentIntent: {
          status: status,
        },
      },
      { new: true }
    );
    if (!order) {
      // If order is not found, return an error response
      return res.status(404).json({ error: "Order not found" });
    }
    res.json({ order });
  } catch (error) {
    // Log the error for debugging purposes
    console.error(error);
    // Send an appropriate response to the client
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = {
  createUser,
  loginUser,
  loginUserAdmin,
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
  getWishlist,
  updateAddress,
  userCart,
  getUserCart,
  emptyCart,
  applyCoupon,
  createOrder,
  getAllOrders,
  getAllUserOrders,
  getSingleOrder,
  deleteSingleOrder,
  updateOrderStatus,
};
