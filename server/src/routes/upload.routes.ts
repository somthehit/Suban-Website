import express from 'express';
import { upload, uploadImage, uploadMultipleImages, deleteImage } from '../controllers/uploadController';
// import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = express.Router();

// Single image upload (temporarily without auth for testing)
router.post('/upload', upload.single('image'), uploadImage);

// Multiple images upload (temporarily without auth for testing)
router.post('/upload/multiple', upload.array('images', 10), uploadMultipleImages);

// Delete uploaded image (temporarily without auth for testing)
router.delete('/upload/:filename', deleteImage);

// Test route
router.get('/upload/test', (req, res) => {
  res.json({ success: true, message: 'Upload routes are working!' });
});

export default router;
