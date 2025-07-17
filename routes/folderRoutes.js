import express from 'express';
import {
    createSchoolFolder,
    getSchoolFolder,
    addSubFolder,
    archiveSchoolFolder
} from '../controllers/schoolFolderController.js';

const router = express.Router();

// Create school folder structure
router.post('/', createSchoolFolder);

// Get school folder structure
router.get('/:schoolId', getSchoolFolder);

// Add new subfolder
router.post('/:schoolId/subfolder', addSubFolder);

// Archive school folder
router.put('/:schoolId/archive', archiveSchoolFolder);

export default router;
