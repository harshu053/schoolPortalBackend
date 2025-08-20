import mongoose from 'mongoose';

const teacherSchema = new mongoose.Schema({
    schoolId: {
        type:  String, 
        required: true
    },
    employeeId: {
        type: String,
        required: true,
        unique: true
    },
    name: {
       type: String,
        required: true
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    departemnt:{
        type:  String,
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
            pinCode: String,
            country: String
        }
    },
    professionalInfo: {
        qualification: [{
            degree: String,
            institution: String,
            yearOfCompletion: Number,
            specialization: String
        }],
        experience: [{
            institution: String,
            position: String,
            fromYear: Number,
            toYear: Number,
            subject: String
        }],
        joiningDate: {
            type: Date,
            required: true
        },
        currentPosition: {
            type: String,
            required: true
        },
    },
    classTeacherOf: {
        class: String,
        section: String
    },
    schedule: [{
        day: {
            type: String,
            enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        },
        periods: [{
            periodNumber: Number,
            subject: String,
            class: String,
            section: String,
            timeSlot: {
                start: String,
                end: String
            }
        }]
    }],
    salary: {
        basic: Number,
        bankDetails: {
            accountNumber: String,
            bankName: String,
            ifscCode: String,
            accountType: String
        }
    },
    status: {
        type: String,
        enum: ['Active', 'On Leave', 'Terminated', 'Retired'],
        default: 'Active'
    }
}, {
    timestamps: true
});

// Create indexes for frequently queried fields
teacherSchema.index({ employeeId: 1 });
teacherSchema.index({ 'contactInfo.email': 1 });
teacherSchema.index({ 'professionalInfo.department': 1 });
teacherSchema.index({ 'classTeacherOf.class': 1, 'classTeacherOf.section': 1 });

const Teacher = mongoose.model('Teacher', teacherSchema);

export default Teacher;
