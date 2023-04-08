const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");

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
  if(findUser && await findUser.isPasswordMatched(password)){
    res.json(findUser)
  }else{
    throw new Error('Invalid username or password. Please verify your credeltials')
  }
});

module.exports = { createUser, loginUser };
