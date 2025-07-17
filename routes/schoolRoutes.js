import express from 'express';
import {
    registerSchool,
    getSchools,
    getSchool,
    updateSchool,
    updateSubscription,
    getSchoolStats
} from '../controllers/schoolController.js';

const router = express.Router();

router.route('/')
    .post(registerSchool)
    .get(getSchools);

router.route('/:id')
    .get(getSchool)
    .put(updateSchool);

router.route('/:id/subscription')
    .put(updateSubscription);

router.route('/:id/stats')
    .get(getSchoolStats);

export default router;
