import jwt from 'jsonwebtoken';

/**
 * Authentication middleware that verifies JWT stored in HTTP-only cookie 'token'
 * Attaches the verified user id to req.user and passes errors to centralized error handler
 */
export const authMiddleware = (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    const error = new Error('Authentication required. No token provided.');
    error.statusCode = 401;
    return next(error);
  }

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    const error = new Error('JWT secret is not configured on the server.');
    error.statusCode = 500;
    return next(error);
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    const userId = decoded.id || decoded.userId || decoded._id;

    if (!userId) {
      const error = new Error('Invalid token payload. User ID not found.');
      error.statusCode = 401;
      return next(error);
    }

    // Attach verified user ID; never trust body or param IDs as authenticated identity
    req.user = {
      id: userId,
    };

    next();
  } catch (err) {
    const error = new Error(
      err.name === 'TokenExpiredError'
        ? 'Authentication token has expired. Please log in again.'
        : 'Invalid authentication token.'
    );
    error.statusCode = 401;
    return next(error);
  }
};

export default authMiddleware;
