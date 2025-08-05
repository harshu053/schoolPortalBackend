import jwt from 'jsonwebtoken';
import School from '../models/schoolModel.js';
import bcrypt from "bcryptjs";

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

const validateToken = async (req, res) => {
  try {
    const user = await School.findById(req.userId).select('-password'); // exclude password
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json(user); // Return user profile data
  } catch (err) {
    console.error('Profile fetch error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try{
    const { schoolEmail, password } = req.body; 
     
    
    // Check if school exists with the email
    const school = await School.findOne({ "contact.schoolEmail": schoolEmail }); 

    if (!school) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    
    // Check if password matches
    const loginPassword = String(password).trim(); 
    
    // Verify the password
    const isMatch = await bcrypt.compare(loginPassword, school.password);
     
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
        role: school.userRole , 
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

// @desc    Get current user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            schoolId: user.schoolId,
            permissions: user.permissions
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new user
// @route   POST /api/auth/users
// @access  Private/Admin
const createUser = async (req, res) => {
    try {
        const { email, password, name, role, schoolId } = req.body;

        // Check if user exists
        if (await User.findOne({ email })) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            email,
            password,
            name,
            role,
            schoolId
        });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            schoolId: user.schoolId,
            permissions: user.permissions
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export {
    validateToken,
    login,
    getUserProfile,
    createUser
};
