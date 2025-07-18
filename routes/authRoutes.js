import express from 'express';
import {
    login,
    getUserProfile,
    createUser
} from '../controllers/authController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/login', login);

// Protected routes
router.get('/profile', protect, getUserProfile);
router.post('/users', protect, authorize('manage_users'), createUser);

export default router;
