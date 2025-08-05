import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import Schools from '../models/schoolModel.js';

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

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: 'No token provided' });

  const token = authHeader.split(' ')[1]; // Bearer <token>
  if (!token) return res.status(401).json({ error: 'Token missing' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id; // or decoded._id, depending on your token payload
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

export { protect, authorize , verifyToken};
