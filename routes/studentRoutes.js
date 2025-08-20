import express from 'express';
import {
    getAllStudents,
    getStudentById,
    createStudent,
    searchStudentsByQuery,
    updateStudent,
    deleteStudent,
    getStudentsByClass
} from '../controllers/studentController.js';

const router = express.Router();

// Get all students and Create new student

router.post('/addstudent',createStudent);  
router.get('/search', searchStudentsByQuery); 
router.get('/', getAllStudents);
router.get('/:schoolId', getStudentById); 
router.put('/update/:schoolId', updateStudent); 


export default router;
