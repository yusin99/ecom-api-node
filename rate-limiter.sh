#!/bin/bash

# Prompt for input values
read -p "Enter the value for windowMs (in milliseconds): " windowMs
read -p "Enter the value for max (maximum requests allowed): " max

# Evaluate math expressions in comments
windowMsComment="windowMs: $((windowMs)) ms"
maxComment="maximum requests allowed: $((max))"

# Create a Node.js module with the input values as string literals
echo "const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: $windowMs, // $windowMsComment
  max: $max, // $maxComment
});

module.exports = limiter;" > middlewares/rate-limiter.js
echo "middlewares/rate-limiter.js module has been created with the input values."
