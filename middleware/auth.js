import jwt from 'jsonwebtoken';
import School from '../models/schoolModel.js';
import Teacher from '../models/teacherModel.js';
import ErrorResponse from '../utils/errorHandler.js';

export const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.token) {
        token = req.cookies.token;
    }

    if (!token) {
        return next(new ErrorResponse('Not authorized to access this route', 401));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.role === 'school') {
            req.user = await School.findById(decoded.id);
        } else if (decoded.role === 'teacher') {
            req.user = await Teacher.findById(decoded.id);
        }

        if (!req.user) {
            return next(new ErrorResponse('User not found', 401));
        }

        next();
    } catch (err) {
        return next(new ErrorResponse('Not authorized to access this route', 401));
    }
};

export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new ErrorResponse(
                    `User role ${req.user.role} is not authorized to access this route`,
                    403
                )
            );
        }
        next();
    };
};
