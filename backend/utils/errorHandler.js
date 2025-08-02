// utils/errorHandler.js
module.exports = (res, statusCode, message, err = null) => {
  const errorResponse = {
    success: false,
    message,
  };

  // Include stack trace only in development mode
  if (process.env.NODE_ENV === 'development' && err?.stack) {
    errorResponse.stack = err.stack;
  }

  res.status(statusCode).json(errorResponse);
};
