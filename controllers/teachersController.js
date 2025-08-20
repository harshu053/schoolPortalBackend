import School from "../models/schoolModel.js";
import Teacher from "../models/teacherModel.js";

const createTeacher = async (req, res) => {
  const { schoolId, dateOfBirth, ...teacherData } = req.body;
  console.log("Received data:", req.body);

  try {
    const employeeId = `EMPID${dateOfBirth.replace(/-/g, "")}`;
    const teacher = new Teacher({
      employeeId,
      dateOfBirth,
      ...teacherData,
    });

    // const updatedSchool = await School.findOneAndUpdate(
    //   { schoolId },
    //   {
    //     $push: {
    //       teachers: {
    //         employeeId,
    //         dateOfBirth,
    //         ...teacherData,
    //       },
    //     },
    //   },
    //   { new: true }
    // );

    // if (!updatedSchool) {
    //   return res
    //     .status(404)
    //     .json({ success: false, message: "School not found" });
    // }

    res.status(200).json({
      success: true,
      message: "Teacher added successfully",
      data: teacher,
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

    const teachers = await Teacher.find({ schoolId });

    // const school = await School.findOne({ schoolId });

    if (teachers.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No teachers found" });
    }

    res.status(200).json({
      success: true,
      message: "Teachers fetched successfully",
      data: teachers,
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
    // const school = await School.findOne({ schoolId });
    // if (!school) {
    //   return res
    //     .status(404)
    //     .json({ success: false, message: "School not found" });
    // }

    const teachers = await Teacher.find({ schoolId });

    const teacher = teachers.find(
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

const updateTeacher = async (req, res) => {
  const { schoolId } = req.params;
  const { employeeId } = req.query;
  const updateData = req.body;

  try {
    if (!schoolId || !employeeId) {
      return res
        .status(400)
        .json({
          success: false,
          message: "schoolId or employeid is not provided.",
        });
    }

    // Build dot notation update object
    const setObj = {};
    function buildDotNotation(obj, prefix) {
      Object.entries(obj).forEach(([key, value]) => {
        if (
          value !== null &&
          typeof value === "object" &&
          !Array.isArray(value)
        ) {
          buildDotNotation(value, prefix ? `${prefix}.${key}` : key);
        } else {
          setObj[`teachers.$${prefix ? "." + prefix : ""}.${key}`] = value;
        }
      });
    }
    buildDotNotation(updateData, "");

    // const school = await School.findOneAndUpdate(
    //   { schoolId, "teachers.employeeId": employeeId },
    //   { $set: setObj },
    //   { new: true }
    // ).select("teachers");

    const teacher = await Teacher.findOneAndUpdate(
      { schoolId, employeeId },
      { $set: setObj },
      { new: true }
    );

    if (!teacher) {
      return res
        .status(404)
        .json({ success: false, message: "Teacher not found" });
    }

    res.status(200).json({
      success: true,
      message: "Teacher updated successfully",
      data: teacher,
    });
  } catch (err) {
    console.error("Error updating teacher:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export { createTeacher, getTeachers, getTeacherById, updateTeacher };
