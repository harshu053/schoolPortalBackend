import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

// Protect routes - Authentication check
const protect = async (req, res, next) => {
    try {
        let token;
        
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({ message: 'Not authorized - No token' });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user || user.status !== 'active') {
            return res.status(401).json({ message: 'Not authorized - Invalid token' });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Not authorized - Token failed' });
    }
};

// Check user role and permissions
const authorize = (...permissions) => {
    return (req, res, next) => {
        // Check if user has required permissions
        const hasPermission = permissions.some(permission => 
            req.user.permissions.includes(permission)
        );

        if (!hasPermission) {
            return res.status(403).json({ 
                message: 'Not authorized - Insufficient permissions' 
            });
        }

        // For non-superadmin users, check if they're accessing their own school's data
        if (req.user.role !== 'superadmin' && req.params.schoolId) {
            if (req.user.schoolId !== req.params.schoolId) {
                return res.status(403).json({ 
                    message: 'Not authorized - School mismatch' 
                });
            }
        }

        next();
    };
};

export { protect, authorize };
