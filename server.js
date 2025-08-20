import express from 'express';
import connectDB from './config/db.js';
import cors from 'cors';
import dotenv from 'dotenv';
import studentRoutes from './routes/studentRoutes.js';
import schoolRoutes from './routes/schools.js';
import authRoutes from './routes/authRoutes.js';
import teacherRoutes from './routes/teacherRoutes.js';
import fileUploadRoutes from './routes/fileUploadRoutes.js';

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic route for testing
app.get('/', (req, res) => {
    res.send('School Portal API is running');
});

// Routes
app.use('/api/students', studentRoutes);
app.use('/api/schools',  schoolRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/teacher',teacherRoutes);  
app.use('/api/files', fileUploadRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
