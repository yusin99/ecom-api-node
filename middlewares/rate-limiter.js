const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 2 * 60 * 1000, // 2 mins in milliseconds
  max: 200, // maximum requests allowed in 2 mins
});

module.exports = limiter;