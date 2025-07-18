import express from 'express';
import { registerSchool, getSchoolDetails, updateSubscriptionStatus } from '../controllers/schoolController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public route for school registration
router.post('/register', registerSchool);

// Protected routes
router.get('/:schoolId', protect, getSchoolDetails);
router.patch('/:schoolId/subscription', protect, authorize('admin'), updateSubscriptionStatus);

export default router;
