process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
import cloudinary from 'cloudinary';
import multer from 'multer';

cloudinary.config({
  cloud_name: "dhhbh77n6",
  api_key: "658948916865766",
  api_secret: "kIIJ62Vlv0ZDLqDmwVIACGTaKEA",
});

// Multer setup for single file upload
const storage = multer.memoryStorage();
const upload = multer({ storage });
 

export const uploadFile = [
  upload.single('file'),
  async (req, res) => { 
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }
      cloudinary.v2.uploader.upload_stream(
        { resource_type: "auto" },
        (error, result) => {
          if (error) {
            return res.status(500).json({ error: error.message });
          }
          if (result && result.secure_url) {
            return res.status(200).json({ message: "successfully uploaded", imageUrl: result.secure_url });
          } else {
            return res.status(500).json({ error: "Upload failed" });
          }
        }
      ).end(req.file.buffer);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
  }
];
 