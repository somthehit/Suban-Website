import { Request, Response } from 'express';
import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

// Ensure uploads directories exist
const ensureDirExists = (dir: string) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), 'uploads');
    const thumbDir = path.join(process.cwd(), 'uploads', 'thumbnails');
    ensureDirExists(uploadDir);
    ensureDirExists(thumbDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Check if file is an image
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  }
});

// Upload single image
export const uploadImage = async (req: Request, res: Response) => {
  try {
    console.log('Upload request received:', req.file);
    
    if (!req.file) {
      console.log('No file in request');
      return res.status(400).json({ success: false, error: 'No image file provided' });
    }

    const file = req.file;
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const imageUrl = `${baseUrl}/uploads/${file.filename}`;
    
    // Generate thumbnail
    const thumbnailFilename = `thumb-${file.filename}`;
    const thumbnailPath = path.join(process.cwd(), 'uploads', 'thumbnails', thumbnailFilename);
    
    try {
      await sharp(file.path)
        .resize(300, 300, { 
          fit: 'cover',
          position: 'center'
        })
        .jpeg({ quality: 80 })
        .toFile(thumbnailPath);
        
      const thumbnailUrl = `${baseUrl}/uploads/thumbnails/${thumbnailFilename}`;
      
      res.json({
        success: true,
        data: {
          filename: file.filename,
          originalName: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
          imageUrl,
          thumbnailUrl
        },
        message: 'Image uploaded successfully'
      });
    } catch (thumbnailError) {
      console.error('Error generating thumbnail:', thumbnailError);
      // Still return success even if thumbnail generation fails
      res.json({
        success: true,
        data: {
          filename: file.filename,
          originalName: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
          imageUrl,
          thumbnailUrl: imageUrl // Fallback to original image
        },
        message: 'Image uploaded successfully (thumbnail generation failed)'
      });
    }
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to upload image',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Upload multiple images
export const uploadMultipleImages = async (req: Request, res: Response) => {
  try {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      return res.status(400).json({ success: false, error: 'No image files provided' });
    }

    const files = req.files as Express.Multer.File[];
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const uploadedImages = [];

    for (const file of files) {
      const imageUrl = `${baseUrl}/uploads/${file.filename}`;
      
      // Generate thumbnail
      const thumbnailFilename = `thumb-${file.filename}`;
      const thumbnailPath = path.join(process.cwd(), 'uploads', 'thumbnails', thumbnailFilename);
      
      let thumbnailUrl = imageUrl;
      try {
        await sharp(file.path)
          .resize(300, 300, { 
            fit: 'cover',
            position: 'center'
          })
          .jpeg({ quality: 80 })
          .toFile(thumbnailPath);
          
        thumbnailUrl = `${baseUrl}/uploads/thumbnails/${thumbnailFilename}`;
      } catch (thumbnailError) {
        console.error('Error generating thumbnail for', file.filename, ':', thumbnailError);
      }
      
      uploadedImages.push({
        filename: file.filename,
        originalName: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        imageUrl,
        thumbnailUrl
      });
    }

    res.json({
      success: true,
      data: uploadedImages,
      message: `${uploadedImages.length} image(s) uploaded successfully`
    });
  } catch (error) {
    console.error('Error uploading multiple images:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to upload images',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Delete uploaded image
export const deleteImage = async (req: Request, res: Response) => {
  try {
    const { filename } = req.params;
    
    if (!filename) {
      return res.status(400).json({ success: false, error: 'Filename is required' });
    }

    const imagePath = path.join(process.cwd(), 'uploads', filename);
    const thumbnailPath = path.join(process.cwd(), 'uploads', 'thumbnails', `thumb-${filename}`);

    // Delete main image
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    // Delete thumbnail
    if (fs.existsSync(thumbnailPath)) {
      fs.unlinkSync(thumbnailPath);
    }

    res.json({
      success: true,
      message: 'Image deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to delete image',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
