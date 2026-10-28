import express from 'express';
import { body } from 'express-validator';
import authMiddleware from '../middleware/authMiddleware.js';
import validateRequest from '../middleware/validateRequest.js';
import {
  getProfile,
  updateProfile,
  deleteProfile,
} from '../controllers/profileController.js';

const router = express.Router();

// All profile endpoints require authentication
router.use(authMiddleware);

// Optional validation rules for profile updates
const updateProfileValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .optional()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('bio')
    .optional()
    .trim()
    .isLength({ max: 250 })
    .withMessage('Bio cannot exceed 250 characters'),
  body('headline')
    .optional()
    .isString()
    .withMessage('Headline must be a string'),
  body('skills')
    .optional()
    .isArray()
    .withMessage('Skills must be an array'),
  body('education')
    .optional()
    .isArray()
    .withMessage('Education must be an array'),
  validateRequest,
];

// Profile routes
router.get('/', getProfile);
router.put('/', updateProfileValidation, updateProfile);
router.delete('/', deleteProfile);

export default router;
