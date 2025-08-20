import express from "express";
import {
  createTeacher,
  getTeacherById,
  getTeachers,
  updateTeacher
} from "../controllers/teachersController.js";
import { updateStudent } from "../controllers/studentController.js";

const router = express.Router();

router.post("/addteacher", createTeacher);
router.get("/allteachers/:schoolId", getTeachers);
router.get("/:schoolId", getTeacherById);
router.put("/update/:schoolId", updateTeacher);

export default router;
