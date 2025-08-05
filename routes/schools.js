import express from 'express';
import { registerSchool, getSchoolDetails, updateSubscriptionStatus } from '../controllers/schoolController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerSchool); 

router.get('/:schoolId', protect, getSchoolDetails);
router.patch('/:schoolId/subscription', protect, authorize('admin'), updateSubscriptionStatus);

export default router;
