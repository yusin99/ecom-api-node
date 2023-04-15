const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const dbConnection = require("./config/db-connection");
const { errorHandler, notFound } = require("./middlewares/error-handler");
const dotenv = require("dotenv").config();
const PORT = process.env.PORT || 4000;
const authRouter = require("./routes/auth-routes");
const productRouter = require("./routes/product-routes");
const blogRouter = require("./routes/blog-routes");
const categoryRouter = require("./routes/category-routes");
const blogCategoryRouter = require("./routes/blog-category-routes");
const brandRouter = require("./routes/brand-routes");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const rateLimiter = require("./middlewares/rate-limiter");

dbConnection();

// Apply rate limiter middleware to all routes
app.use(rateLimiter);

app.use(morgan("combined"));
// Middleware for parsing JSON request bodies
app.use(bodyParser.json()); // Use body-parser.json() for parsing JSON request bodies
// Middleware for parsing URL-encoded request bodies
app.use(bodyParser.urlencoded({ extended: true })); // Use body-parser.urlencoded() for parsing URL-encoded request bodies
app.use(cookieParser());

app.use("/api/user", authRouter);
app.use("/api/product", productRouter);
app.use("/api/blog", blogRouter);
app.use("/api/category", categoryRouter);
app.use("/api/blog-category", blogCategoryRouter);
app.use("/api/brand", brandRouter);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running at ${PORT}`);
});
