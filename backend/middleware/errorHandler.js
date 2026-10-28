/**
 * Centralized error-handling middleware for Express
 * Handles Mongoose validation, MongoDB duplicate keys, CastErrors, JWT errors, and general errors
 */
export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || (res.statusCode >= 400 ? res.statusCode : 500);
  let message = err.message || 'Internal server error';
  let errors = err.errors || undefined;

  // Handle Mongoose CastError (invalid ObjectId format)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid format for field '${err.path}'`;
  }

  // Handle MongoDB duplicate key error (code 11000)
  if (err.code === 11000) {
    statusCode = 400;
    const duplicatedField = Object.keys(err.keyValue || {})[0] || 'field';
    message = `Duplicate value entered for '${duplicatedField}'. Please use another value.`;
  }

  // Handle Mongoose schema validation errors
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation failed';
    errors = Object.values(err.errors).map((e) => e.message);
  }

  // Handle JWT errors if passed directly
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid authentication token';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Authentication token expired';
  }

  // Log diagnostic info on the server without exposing sensitive tokens or credentials
  console.error(`[Error] ${statusCode} - ${req.method} ${req.originalUrl}: ${message}`);

  const isProduction = process.env.NODE_ENV === 'production';

  // Build consistent JSON response
  const response = {
    status: statusCode >= 500 ? 'error' : 'fail',
    message: statusCode >= 500 && isProduction ? 'Internal server error' : message,
  };

  if (errors) {
    response.errors = errors;
  }

  // Only attach stack trace in development for 500 errors
  if (!isProduction && statusCode >= 500 && err.stack) {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

export default errorHandler;
