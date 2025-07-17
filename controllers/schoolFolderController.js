import SchoolFolder from '../models/schoolFolderModel.js';

// @desc    Create school folder structure
// @route   POST /api/folder-structure
const createSchoolFolder = async (req, res) => {
    try {
        const { schoolId, folderName } = req.body;

        // Create base folder structure for a school
        const folderStructure = {
            schoolId,
            folderName,
            subFolders: [
                { name: 'Students', type: 'students', path: `${schoolId}/students` },
                { name: 'Teachers', type: 'teachers', path: `${schoolId}/teachers` },
                { name: 'Classes', type: 'classes', path: `${schoolId}/classes` },
                { name: 'Subjects', type: 'subjects', path: `${schoolId}/subjects` },
                { name: 'Exams', type: 'exams', path: `${schoolId}/exams` },
                { name: 'Attendance', type: 'attendance', path: `${schoolId}/attendance` }
            ]
        };

        const schoolFolder = await SchoolFolder.create(folderStructure);
        res.status(201).json(schoolFolder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get school folder structure
// @route   GET /api/folder-structure/:schoolId
const getSchoolFolder = async (req, res) => {
    try {
        const schoolFolder = await SchoolFolder.findOne({ schoolId: req.params.schoolId });
        if (!schoolFolder) {
            return res.status(404).json({ message: 'School folder structure not found' });
        }
        res.status(200).json(schoolFolder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add new subfolder
// @route   POST /api/folder-structure/:schoolId/subfolder
const addSubFolder = async (req, res) => {
    try {
        const { name, type } = req.body;
        const schoolFolder = await SchoolFolder.findOne({ schoolId: req.params.schoolId });
        
        if (!schoolFolder) {
            return res.status(404).json({ message: 'School folder structure not found' });
        }

        schoolFolder.subFolders.push({
            name,
            type,
            path: `${req.params.schoolId}/${type}`
        });

        await schoolFolder.save();
        res.status(200).json(schoolFolder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Archive school folder
// @route   PUT /api/folder-structure/:schoolId/archive
const archiveSchoolFolder = async (req, res) => {
    try {
        const schoolFolder = await SchoolFolder.findOneAndUpdate(
            { schoolId: req.params.schoolId },
            { status: 'archived' },
            { new: true }
        );

        if (!schoolFolder) {
            return res.status(404).json({ message: 'School folder structure not found' });
        }

        res.status(200).json(schoolFolder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export {
    createSchoolFolder,
    getSchoolFolder,
    addSubFolder,
    archiveSchoolFolder
};
