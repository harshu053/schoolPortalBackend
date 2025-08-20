import express from 'express';
import { uploadFile } from '../controllers/fileUploadController.js';

const router = express.Router();
console.log("File upload routes initialized");
router.post('/upload', uploadFile);

export default router;
