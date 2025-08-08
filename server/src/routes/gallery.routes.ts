import express from 'express';
import * as galleryController from '../controllers/galleryController';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = express.Router();

// Public routes
router.get('/gallery', galleryController.getGalleryImages);
router.get('/gallery/featured', galleryController.getFeaturedImages);
router.get('/gallery/categories', galleryController.getGalleryCategories);
router.get('/gallery/:id', galleryController.getGalleryImageById);

// Admin routes
router.get('/admin/gallery', authenticateToken, requireAdmin, galleryController.getGalleryImages);
router.get('/admin/gallery/:id', authenticateToken, requireAdmin, galleryController.getGalleryImageById);
router.post('/admin/gallery', authenticateToken, requireAdmin, galleryController.createGalleryImage);
router.put('/admin/gallery/:id', authenticateToken, requireAdmin, galleryController.updateGalleryImage);
router.delete('/admin/gallery/:id', authenticateToken, requireAdmin, galleryController.deleteGalleryImage);

export default router;
