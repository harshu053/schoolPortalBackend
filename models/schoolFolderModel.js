import mongoose from 'mongoose';

const SchoolFolderSchema = new mongoose.Schema({
    schoolId: {
        type: String,
        required: true,
        unique: true
    },
    folderName: {
        type: String,
        required: true
    },
    subFolders: [{
        name: String,
        path: String,
        type: {
            type: String,
            enum: ['students', 'teachers', 'classes', 'subjects', 'exams', 'attendance']
        }
    }],
    status: {
        type: String,
        enum: ['active', 'archived'],
        default: 'active'
    }
}, {
    timestamps: true
});

// Create compound index for faster queries
SchoolFolderSchema.index({ schoolId: 1, 'subFolders.type': 1 });

const SchoolFolder = mongoose.model('SchoolFolder', SchoolFolderSchema);

export default SchoolFolder;
