import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['superadmin', 'schoolAdmin', 'principal', 'teacher', 'staff'],
        required: true
    },
    schoolId: {
        type: String,
        required: function() {
            // School ID is required for all roles except superadmin
            return this.role !== 'superadmin';
        }
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'suspended'],
        default: 'active'
    },
    permissions: [{
        type: String,
        enum: [
            'manage_students',
            'view_students',
            'manage_teachers',
            'view_teachers',
            'manage_staff',
            'view_staff',
            'manage_classes',
            'view_classes',
            'manage_attendance',
            'view_attendance',
            'manage_school_settings',
            'manage_subscriptions',
            'view_reports',
            'manage_users'
        ]
    }],
    lastLogin: Date,
    passwordResetToken: String,
    passwordResetExpires: Date
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// Set default permissions based on role
userSchema.pre('save', function(next) {
    if (this.isModified('role')) {
        switch (this.role) {
            case 'superadmin':
                this.permissions = [
                    'manage_students', 'view_students',
                    'manage_teachers', 'view_teachers',
                    'manage_staff', 'view_staff',
                    'manage_classes', 'view_classes',
                    'manage_attendance', 'view_attendance',
                    'manage_school_settings',
                    'manage_subscriptions',
                    'view_reports',
                    'manage_users'
                ];
                break;
            case 'schoolAdmin':
            case 'principal':
                this.permissions = [
                    'manage_students', 'view_students',
                    'manage_teachers', 'view_teachers',
                    'manage_staff', 'view_staff',
                    'manage_classes', 'view_classes',
                    'manage_attendance', 'view_attendance',
                    'manage_school_settings',
                    'view_reports'
                ];
                break;
            case 'teacher':
                this.permissions = [
                    'view_students',
                    'view_teachers',
                    'view_classes',
                    'manage_attendance',
                    'view_attendance'
                ];
                break;
            case 'staff':
                this.permissions = [
                    'view_students',
                    'view_classes',
                    'view_attendance'
                ];
                break;
        }
    }
    next();
});

// Method to check if password is correct
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
