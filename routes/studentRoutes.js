import express from 'express';
import {
    getStudents,
    getStudentById,
    createStudent,
    updateStudent,
    deleteStudent,
    getStudentsByClass
} from '../controllers/studentController.js';

const router = express.Router();

// Get all students and Create new student

router.post('/addstudent',createStudent);  
router.get('/allstudents/:schoolId', getStudentById); 

// Get, update and delete student by ID
// router.route('/:id')
//     .get(getStudent)
//     .put(updateStudent)
//     .delete(deleteStudent);

// // Get students by class and section
// router.route('/class/:class/section/:section')
//     .get(getStudentsByClass);

export default router;
