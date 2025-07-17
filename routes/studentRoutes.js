import express from 'express';
import {
    getStudents,
    getStudent,
    createStudent,
    updateStudent,
    deleteStudent,
    getStudentsByClass
} from '../controllers/studentController.js';

const router = express.Router();

// Get all students and Create new student
router.route('/')
    .get(getStudents)
    .post(createStudent);

// Get, update and delete student by ID
router.route('/:id')
    .get(getStudent)
    .put(updateStudent)
    .delete(deleteStudent);

// Get students by class and section
router.route('/class/:class/section/:section')
    .get(getStudentsByClass);

export default router;
