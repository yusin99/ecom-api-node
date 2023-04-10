const notFound = (req, res, next) => {
  const error = new Error(`Not Found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";
  
  // Create a sanitized copy of the error object
  const sanitizedError = {
    message: message,
    status: statusCode
  };

  // Log the error with additional information
  console.error(`Error: ${message}`, {
    timestamp: new Date(),
    url: req.url,
    method: req.method,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });

  res.status(statusCode).json({
    error: sanitizedError
  });
};

module.exports = { errorHandler, notFound };
