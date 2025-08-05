import Student from "../models/studentModel.js";
import School from "../models/schoolModel.js";

// @desc    Get all students
// @route   GET /api/students
// @access  Public
const getStudents = async (req, res) => {
  try {
    const { schoolId } = req.query;
    const school = await School.findOne({ schoolId });
    if (!school) {
      return res.status(404).json({ message: "School not found" });
    }
    if (!school.students || school.students.length === 0) {
      return res.status(404).json({ message: "No students found" });
    }
    res.status(200).json(school.students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single student
// @route   GET /api/students/:id
// @access  Public
const getStudentById = async (req, res) => {
  try {
    const { schoolId } = req.params; // from route
    const { studentId } = req.query;
    const school = await School.findOne({ schoolId });
    if (!school) {
      return res.status(404).json({ message: "School not found" });
    }
    const student = school.students.find(
      (s) => s.studentId.toString() === studentId
    );
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new student
// @route   POST /api/students
// @access  Public
const createStudent = async (req, res) => {
  const { schoolId, dateOfBirth, ...studentData } = req.body;

  try {
    const studentId = `STUID${dateOfBirth.replace(/-/g, "")}`;

    const updatedSchool = await School.findOneAndUpdate(
      { schoolId }, // match your custom ID
      { $push: { students: { studentId, dateOfBirth, ...studentData } } },
      { new: true }
    );

    if (!updatedSchool) {
      return res
        .status(404)
        .json({ success: false, message: "School not found" });
    }

    res.status(200).json({
      success: true,
      message: "Student added successfully",
      data: updatedSchool.students,
    });
  } catch (err) {
    console.error("Error adding student:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc    Update student
// @route   PUT /api/students/:id
// @access  Public
const updateStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedStudent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete student
// @route   DELETE /api/students/:id
// @access  Public
const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    await Student.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Student removed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get students by class and section
// @route   GET /api/students/class/:class/section/:section
// @access  Public
const getStudentsByClass = async (req, res) => {
  try {
    const students = await Student.find({
      class: req.params.class,
      section: req.params.section,
    });
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentsByClass,
};
