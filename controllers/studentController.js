import Student from "../models/studentModel.js";
import School from "../models/schoolModel.js";

// @desc    Get all students
// @route   GET /api/students
// @access  Public
const getAllStudents = async (req, res) => { 
  try {
    const { schoolId } = req.query;
    const students = await Student.find({ schoolId});
    
    if (students.length === 0) {
      return res.status(404).json({ message: "No students found" });
    }
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const searchStudentsByQuery = async (req, res) => { 
  try {
    const { searchQuery, schoolId } = req.query; 
    if (!searchQuery) {
      return res.status(400).json({ message: "Search query is required" });
    }
    const students = await Student.find({ schoolId});
    if (!students) {
      return res.status(404).json({ message: `students not found with school id :${schoolId}`});
    }

    // Search in embedded students array
    const results = (students || []).filter((student) => {
      const regex = new RegExp(searchQuery, "i");
      return (
        regex.test(student.name) ||
        regex.test(student.studentId) ||
        regex.test(student.class) ||
        regex.test(student.section)
      );
    });

    if (results.length === 0) {
      return res.status(404).json({ message: "No students found" });
    }
    res.status(200).json({ message: "Filtered data by the search query", results });
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
    const students = await Student.find({ schoolId});
    if (!students) {
      return res.status(404).json({ message: `students not found with schoolId: ${schoolId}` });
    }
    const student =students.find(
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

    const student=new Student({
      studentId,
      dateOfBirth,
      ...studentData
    });

    // const updatedSchool = await School.findOneAndUpdate(
    //   { schoolId }, // match your custom ID
    //   { $push: { students: { studentId, dateOfBirth, ...studentData } } },
    //   { new: true }
    // );

    // if (!updatedSchool) {
    //   return res
    //     .status(404)
    //     .json({ success: false, message: "School not found" });
    // }

    res.status(200).json({
      success: true,
      message: "Student added successfully",
      data: student,
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
  const { schoolId } = req.params;
  const { studentId } = req.query;
  const updateData = req.body;

  try {
 
    if (!schoolId || !studentId) {
      return res.status(400).json({ success: false, message: "schoolId or  studentId is not provided." });
    }

    // Build dot notation update object
    const setObj = {};
    function buildDotNotation(obj, prefix) {
      Object.entries(obj).forEach(([key, value]) => {
        if (value !== null && typeof value === "object" && !Array.isArray(value)) {
          buildDotNotation(value, prefix ? `${prefix}.${key}` : key);
        } else {
          setObj[`students.$${prefix ? '.' + prefix : ''}.${key}`] = value;
        }
      });
    }
    buildDotNotation(updateData, "");

    // const school = await School.findOneAndUpdate(
    //   { schoolId, "students.studentId": studentId },
    //   { $set: setObj },
    //   { new: true }
    // ).select("students");

    const student=await Student.findOneAndUpdate(
      { schoolId, studentId },  
      { $set: setObj },
      { new: true }
    );

    if (!student) {
      return res.status(404).json({ success: false, message: " student not found" });
    }
    // Find the updated teacher object
    const updatedStudent = Student.find(t => t.studentId.toString() === studentId);
    res.status(200).json({
      success: true,
      message: "student updated successfully",
      data: updatedStudent,
    });
  } catch (err) {
    console.error("Error updating students details:", err);
    res.status(500).json({ success: false, message: "Server error" });
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
  searchStudentsByQuery,
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentsByClass,
};
