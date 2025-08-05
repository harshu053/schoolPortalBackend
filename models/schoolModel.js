import mongoose from 'mongoose'; 
import Student from './studentModel.js';
import teacher from './teacherModel.js';

// =======================
// Subscription Sub-Schema
// =======================
const subscriptionSchema = new mongoose.Schema({
    planType: {
        type: String,
        enum: ['Basic', 'Premium', 'Enterprise'],
        default: 'Basic'
    },
    startDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    endDate: {
        type: Date,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Active', 'Expired', 'Trial', 'Cancelled'],
        default: 'Trial'
    },
    paymentHistory: [{
        amount: Number,
        date: Date,
        transactionId: String,
        status: {
            type: String,
            enum: ['Success', 'Failed', 'Pending']
        }
    }]
});

// ===================
// Main School Schema
// ===================
const schoolSchema = new mongoose.Schema({
    schoolName: {
        type: String,
        required: [true, 'School name is required'],
        trim: true
    },
    schoolId: {
        type: String,
        required: [true, 'School ID is required'],
        unique: true,
        trim: true
    },
    diceCode: {
        type: String,
        required: [true, 'DICE code is required'],
        unique: true,
        trim: true,
        match: [/^[0-9]{11}$/, 'DICE code must be 11 digits']
    },
    type: {
        type: String,
        enum: ['Primary','public', 'Secondary', 'High School', 'K-12', 'Other'],
        required: [true, 'School type is required']
    },
    address: {
        landmark: {
            type: String,
            required: [true, 'Street address is required']
        },
        city: {
            type: String,
            required: [true, 'City is required']
        },
        state: {
            type: String,
            required: [true, 'State is required']
        },
        country: {
            type: String,
            required: [true, 'Country is required'],
            default: 'India'
        },
        pinCode: {
            type: String,
            required: [true, 'PIN code is required'],
            match: [/^[0-9]{6}$/, 'Please enter a valid 6-digit PIN code']
        }
    },
    userRole:{
        type: String,
        required: [true, 'user role is required'],
    },
    contact: {
        schoolEmail: {
            type: String,
            required: [true, 'School email is required'],
            unique: true,
            sparse: true,
            trim: true,
            lowercase: true,
            match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
        },
        schoolPhone: {
            type: String,
            required: [true, 'School phone is required'],
            match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number']
        },
        website: {
            type: String,
            trim: true
        }
    },
    adminInfo: {
        principalName: {
            type: String,
            required: [true, 'Principal name is required']
        },
        schoolEmail: {
            type: String,
            required: [true, 'Principal email is required'],
            unique: true,
            sparse: true,
            trim: true,
            lowercase: true,
            match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
        },
        schoolPhone: {
            type: String,
            required: [true, 'Principal phone is required'],
            match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number']
        }
    },
    teachers:[teacher.schema],
    students: [Student.schema],
    subscription: subscriptionSchema,
    password: {
        type: String,  
        required: [true, 'Password is required']
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive', 'Suspended'],
        default: 'Active'
    },
    features: {
        attendance: { type: Boolean, default: true },
        examManagement: { type: Boolean, default: true },
        onlineClasses: { type: Boolean, default: false },
        libraryManagement: { type: Boolean, default: false },
        transportManagement: { type: Boolean, default: false },
        feeManagement: { type: Boolean, default: true }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// ======================
// Indexes (no duplicates)
// ======================
schoolSchema.index({ schoolId: 1 }, { unique: true });
schoolSchema.index({ diceCode: 1 }, { unique: true, sparse: true });
schoolSchema.index({ 'contact.schoolEmail': 1 }, { unique: true, sparse: true });
schoolSchema.index({ 'adminInfo.schoolEmail': 1 }, { unique: true, sparse: true });
schoolSchema.index({ status: 1 });
schoolSchema.index({ 'subscription.status': 1 });

// =======================
// Middleware & Methods
 

schoolSchema.pre('save', function (next) {
    if (this.subscription && this.subscription.endDate) {
        const now = new Date();
        if (now > this.subscription.endDate) {
            this.subscription.status = 'Expired';
        }
    }
    next();
});

// ================
// Model Export
// ================
const School = mongoose.model('School', schoolSchema);
export default School;
