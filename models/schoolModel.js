import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
    planType: {
        type: String,
        enum: ['Basic', 'Premium', 'Enterprise'],
        required: true
    },
    startDate: {
        type: Date,
        required: true
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
        enum: ['Active', 'Expired', 'Cancelled'],
        default: 'Active'
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

const schoolSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    type: {
        type: String,
        enum: ['Primary', 'Secondary', 'High School', 'K-12', 'Other'],
        required: true
    },
    address: {
        street: String,
        city: String,
        state: String,
        country: String,
        pinCode: String
    },
    contact: {
        email: {
            type: String,
            required: true,
            unique: true
        },
        phone: {
            type: String,
            required: true
        },
        alternatePhone: String,
        website: String
    },
    adminInfo: {
        principalName: String,
        principalEmail: String,
        principalPhone: String
    },
    subscription: subscriptionSchema,
    configuration: {
        academicYear: {
            start: Date,
            end: Date
        },
        workingDays: [{
            type: String,
            enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        }],
        holidayCalendar: [{
            date: Date,
            description: String
        }],
        customization: {
            logo: String,
            theme: {
                primaryColor: String,
                secondaryColor: String
            }
        }
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
    }
}, {
    timestamps: true
});

// Indexes for better query performance
schoolSchema.index({ code: 1 }, { unique: true });
schoolSchema.index({ 'contact.email': 1 }, { unique: true });
schoolSchema.index({ status: 1 });
schoolSchema.index({ 'subscription.status': 1 });

const School = mongoose.model('School', schoolSchema);

export default School;
