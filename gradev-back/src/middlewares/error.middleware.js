const errorMiddleware = (error, req, res, next) => {
  let statusCode = error.statusCode || error.status || 500;
  let message = error.message || "Internal server error.";

  // Mongoose validation errors
  if (error.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(error.errors)
      .map((item) => item.message)
      .join(" ");
  }

  // MongoDB duplicate key error
  if (error.code === 11000) {
    statusCode = 409;

    const duplicatedField = Object.keys(error.keyValue || {})[0];

    message = duplicatedField
      ? `${duplicatedField} already exists.`
      : "A duplicate value already exists.";
  }

  // Invalid MongoDB ObjectId
  if (error.name === "CastError") {
    statusCode = 400;
    message = "Invalid resource identifier.";
  }

  // JWT errors
  if (error.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid authentication token.";
  }

  if (error.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Authentication token has expired.";
  }

  if (process.env.NODE_ENV === "development") {
    console.error(error);
  }

  return res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && {
      stack: error.stack,
    }),
  });
};

export default errorMiddleware;
