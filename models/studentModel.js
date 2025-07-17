import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    rollNumber: {
        type: String,
        required: true,
        unique: true
    },
    class: {
        type: String,
        required: true
    },
    section: {
        type: String,
        required: true
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        required: true
    },
    contactInfo: {
        email: {
            type: String,
            required: true,
            unique: true
        },
        phone: {
            type: String,
            required: true
        },
        address: {
            street: String,
            city: String,
            state: String,
            pinCode: String
        }
    },
    parentInfo: {
        fatherName: {
            type: String,
            required: true
        },
        motherName: {
            type: String,
            required: true
        },
        guardianContact: {
            type: String,
            required: true
        }
    },
    academicInfo: {
        admissionDate: {
            type: Date,
            default: Date.now
        },
        previousSchool: String,
        academicYear: {
            type: String,
            required: true
        }
    },
    attendance: [{
        date: {
            type: Date,
            required: true
        },
        status: {
            type: String,
            enum: ['Present', 'Absent', 'Late'],
            required: true
        }
    }],
    performanceMetrics: {
        currentGrade: String,
        remarks: String,
        achievements: [String]
    }
}, {
    timestamps: true // This will add createdAt and updatedAt fields automatically
});

// Create indexes for frequently queried fields
studentSchema.index({ rollNumber: 1 });
studentSchema.index({ 'contactInfo.email': 1 });
studentSchema.index({ class: 1, section: 1 });

const Student = mongoose.model('Student', studentSchema);

export default Student;
