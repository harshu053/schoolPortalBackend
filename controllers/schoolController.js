import School from "../models/schoolModel.js";
import bcrypt from "bcryptjs";
import { generatePassword } from "../utils/auth.js";
import generateToken from "../utils/generateToken.js";

// @desc    Register new school
// @route   POST /api/schools
// @access  Private/Admin

const registerSchool = async (req, res) => {
  try {
    console.log(req.body);
    const {
      schoolName,
      diceCode,
      type, // Changed from schoolType to type
      address: {
        landmark,
        city,
        state,
        country,
        pinCode // Changed from pincode to pinCode
      },
      contact: {
        schoolEmail,
        schoolPhone
      },
      adminInfo: {
        principalName,
        schoolEmail: principalEmail, // Mapping principal's email
        schoolPhone: principalPhone  // Mapping principal's phone
      },
      features
    } = req.body;
    
     
     

    // Generate a unique school ID
    const schoolId = "SCH" + Date.now().toString().slice(-6);

    // Generate a random password
    const plainPassword = generatePassword();

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(plainPassword, salt);

    // Create the new school
    const school = new School({
      schoolName,
      schoolId,
      diceCode,
      type,
      address: {
        landmark,
        city,
        state,
        country: country || 'India',
        pinCode
      },
      userRole:'schoolAdmin',
      contact: {
        schoolEmail,
        schoolPhone
      },
      adminInfo: {
        principalName,
        schoolEmail: principalEmail,
        schoolPhone: principalPhone
      },
      status: "Active",
      password: hashedPassword,
      features: features || {
        attendance: true,
        examManagement: true,
        onlineClasses: false,
        libraryManagement: false,
        transportManagement: false,
        feeManagement: true
      }
    });

    await school.save();

    res.status(201).json({
      success: true,
      message: "School registered successfully",
      data: {
        schoolId,
        schoolEmail,
        initialPassword: plainPassword, // Send plain password only in registration response
      },
    });
  } catch (error) {
    console.error("School registration error:", error);
    res.status(500).json({
      success: false,
      message: "Error registering school",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc    Login school admin
// @route   POST /api/schools/login
// @access  Public
const loginSchool = async (req, res) => {
  try{
    const { schoolEmail, password } = req.body; 
    
    console.log("Login attempt with:", { schoolEmail, password });
    
    // Check if school exists with the email
    const school = await School.findOne({ "contact.schoolEmail": schoolEmail });
    console.log("School found:", school ? school.schoolName : "No school found");
    if (!school) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    
    // Check if password matches
    console.log("Comparing passwords...");
    console.log("Stored hashed password:", school.password ? "exists" : "missing");
    const isMatch = await bcrypt.compare(password, school.password); 
    console.log("Password match:", isMatch ? "Yes" : "No");
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate JWT token
    const token = generateToken(school._id);

    res.json({
      success: true,
      data: {
        _id: school._id,
        schoolId: school.schoolId,
        schoolName: school.schoolName,
        email: school.contact.schoolEmail,
        token,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during login",
    });
  }
};

// @desc    Get all schools
// @route   GET /api/schools
// @access  Private/Admin
const getSchools = async (req, res) => {
  try {
    const schools = await School.find({});
    res.status(200).json(schools);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get school by ID
// @route   GET /api/schools/:id
// @access  Private/School
const getSchool = async (req, res) => {
  try {
    const school = await School.findById(req.params.id);
    if (!school) {
      return res.status(404).json({ message: "School not found" });
    }
    res.status(200).json(school);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update school
// @route   PUT /api/schools/:id
// @access  Private/School
const updateSchool = async (req, res) => {
  try {
    const school = await School.findById(req.params.id);
    if (!school) {
      return res.status(404).json({ message: "School not found" });
    }

    const updatedSchool = await School.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedSchool);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update subscription
// @route   PUT /api/schools/:id/subscription
// @access  Private/Admin
const updateSubscription = async (req, res) => {
  try {
    const school = await School.findById(req.params.id);
    if (!school) {
      return res.status(404).json({ message: "School not found" });
    }

    school.subscription = {
      ...school.subscription,
      ...req.body,
    };

    await school.save();
    res.status(200).json(school);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get school stats
// @route   GET /api/schools/:id/stats
// @access  Private/School
const getSchoolStats = async (req, res) => {
  try {
    const school = await School.findById(req.params.id);
    if (!school) {
      return res.status(404).json({ message: "School not found" });
    }

    // You can add more complex aggregation here
    const stats = {
      subscriptionStatus: school.subscription.status,
      features: school.features,
      daysUntilExpiry: Math.ceil(
        (new Date(school.subscription.endDate) - new Date()) /
          (1000 * 60 * 60 * 24)
      ),
    };

    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get school details
// @route   GET /api/schools/details/:schoolId
// @access  Private/School
const getSchoolDetails = async (req, res) => {
  try {
    const { schoolId } = req.params;

    const school = await School.findOne({ schoolId }).select("-password"); // Exclude password from the response

    if (!school) {
      return res.status(404).json({
        success: false,
        message: "School not found",
      });
    }

    res.status(200).json({
      success: true,
      data: school,
    });
  } catch (error) {
    console.error("Get school details error:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving school details",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc    Update subscription status
// @route   PUT /api/schools/subscription/:schoolId
// @access  Private/Admin
const updateSubscriptionStatus = async (req, res) => {
  try {
    const { schoolId } = req.params;
    const { subscriptionStatus, subscriptionEndDate } = req.body;

    const school = await School.findOneAndUpdate(
      { schoolId },
      {
        subscriptionStatus,
        subscriptionEndDate: new Date(subscriptionEndDate),
      },
      { new: true }
    ).select("-password");

    if (!school) {
      return res.status(404).json({
        success: false,
        message: "School not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Subscription status updated successfully",
      data: school,
    });
  } catch (error) {
    console.error("Update subscription status error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating subscription status",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export {
  registerSchool,
  loginSchool,
  getSchools,
  getSchool,
  updateSchool,
  updateSubscription,
  getSchoolStats,
  getSchoolDetails,
  updateSubscriptionStatus,
};
