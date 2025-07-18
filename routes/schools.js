import express from 'express';
import { registerSchool, getSchoolDetails, updateSubscriptionStatus, loginSchool } from '../controllers/schoolController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', registerSchool);
router.post('/login', loginSchool);

// Protected routes
router.get('/:schoolId', protect, getSchoolDetails);
router.patch('/:schoolId/subscription', protect, authorize('admin'), updateSubscriptionStatus);

export default router;
