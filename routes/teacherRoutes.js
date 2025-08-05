import express from "express";
import {
  createTeacher,
  getTeacherById,
} from "../controllers/teachersController.js";

const router = express.Router();

router.post("/addteacher", createTeacher);
router.get("/allteachers/:schoolId", getTeacherById);

export default router;
