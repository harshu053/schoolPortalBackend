import express from 'express';
import {
    validateToken,
    login,
    getUserProfile,
    createUser
} from '../controllers/authController.js';
import { protect, authorize,verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/login', login)
router.get('/validate/profile',verifyToken, validateToken);

// Protected routes
// router.get('/profile', protect, getUserProfile);
// router.post('/users', protect, authorize('manage_users'), createUser);

export default router;
