import School from '../models/schoolModel.js';

// @desc    Register new school
// @route   POST /api/schools
// @access  Private/Admin
const registerSchool = async (req, res) => {
    try {
        // Generate unique school code
        const schoolCode = 'SCH' + Date.now().toString().slice(-6);
        
        const school = await School.create({
            ...req.body,
            code: schoolCode
        });
        
        res.status(201).json(school);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get all schools
// @route   GET /api/schools
// @access  Private/Admin
const getSchools = async (req, res) => {
    try {
        const schools = await School.find({});
        res.status(200).json(schools);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get school by ID
// @route   GET /api/schools/:id
// @access  Private/School
const getSchool = async (req, res) => {
    try {
        const school = await School.findById(req.params.id);
        if (!school) {
            return res.status(404).json({ message: 'School not found' });
        }
        res.status(200).json(school);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update school
// @route   PUT /api/schools/:id
// @access  Private/School
const updateSchool = async (req, res) => {
    try {
        const school = await School.findById(req.params.id);
        if (!school) {
            return res.status(404).json({ message: 'School not found' });
        }

        const updatedSchool = await School.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.status(200).json(updatedSchool);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update subscription
// @route   PUT /api/schools/:id/subscription
// @access  Private/Admin
const updateSubscription = async (req, res) => {
    try {
        const school = await School.findById(req.params.id);
        if (!school) {
            return res.status(404).json({ message: 'School not found' });
        }

        school.subscription = {
            ...school.subscription,
            ...req.body
        };

        await school.save();
        res.status(200).json(school);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get school stats
// @route   GET /api/schools/:id/stats
// @access  Private/School
const getSchoolStats = async (req, res) => {
    try {
        const school = await School.findById(req.params.id);
        if (!school) {
            return res.status(404).json({ message: 'School not found' });
        }

        // You can add more complex aggregation here
        const stats = {
            subscriptionStatus: school.subscription.status,
            features: school.features,
            daysUntilExpiry: Math.ceil(
                (new Date(school.subscription.endDate) - new Date()) / (1000 * 60 * 60 * 24)
            )
        };

        res.status(200).json(stats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export {
    registerSchool,
    getSchools,
    getSchool,
    updateSchool,
    updateSubscription,
    getSchoolStats
};
