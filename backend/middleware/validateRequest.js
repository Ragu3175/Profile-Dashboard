import { validationResult } from 'express-validator';

/**
 * Reusable middleware that checks for express-validator errors
 * Returns HTTP 400 with structured validation messages if errors are present
 */
export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'fail',
      message: 'Validation failed',
      errors: errors.array().map((err) => ({
        field: err.path || err.param,
        message: err.msg,
      })),
    });
  }

  next();
};

export default validateRequest;
