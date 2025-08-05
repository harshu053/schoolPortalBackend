import School from "../models/schoolModel.js";

const createTeacher = async (req, res) => {
  const { schoolId, dateOfBirth, ...teacherData } = req.body;
  console.log("Received data:", req.body);

  try {
    const employeeId = `EMPID${dateOfBirth.replace(/-/g, "")}`;

    const updatedSchool = await School.findOneAndUpdate(
      { schoolId },
      {
        $push: {
          teachers: {
            employeeId,
            dateOfBirth,
            ...teacherData,
          },
        },
      },
      { new: true }
    );

    if (!updatedSchool) {
      return res
        .status(404)
        .json({ success: false, message: "School not found" });
    }

    res.status(200).json({
      success: true,
      message: "Teacher added successfully",
      data: updatedSchool.teachers,
    });
  } catch (err) {
    console.error("Error adding teacher:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getTeachers = async (req, res) => {
  try {
    const { schoolId } = req.params;
    console.log("Fetching teachers for schoolId:", schoolId);

    const school = await School.findOne({ schoolId });
    if (!school) {
      return res
        .status(404)
        .json({ success: false, message: "School not found" });
    }
    if (!school.teachers || school.teachers.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No teachers found" });
    }

    res.status(200).json({
      success: true,
      message: "Teachers fetched successfully",
      data: school?.teachers,
    });
  } catch (err) {
    console.error("Error fetching teachers:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getTeacherById = async (req, res) => {
   
  try {
    const { schoolId } = req.params;  
    const { employeeId } = req.query;
    const school = await School.findOne({ schoolId });
    if (!school) {
      return res
        .status(404)
        .json({ success: false, message: "School not found" });
    }

    console.log("Fetching teacher with employeeId:", employeeId); 
     const teacher = school.teachers.find(
      (s) => s.employeeId.toString() === employeeId
    );
    if (!teacher) {
      return res
        .status(404)
        .json({ success: false, message: "Teacher not found" });
    }
    res.status(200).json({
      success: true,
      message: "Teacher fetched successfully",
      data: teacher,
    });
  } catch (err) {
    console.error("Error fetching teacher:", err);
  }
};

export { createTeacher, getTeachers,getTeacherById };
