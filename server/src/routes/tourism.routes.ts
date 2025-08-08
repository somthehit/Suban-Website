import { Router } from 'express';
import { authMiddleware, adminMiddleware } from '../middleware/auth';
import {
  getAllTourism,
  getTourismById,
  createTourism,
  updateTourism,
  deleteTourism,
  getTourismStats
} from '../controllers/tourismController';

const router = Router();

// Public routes
router.get('/', getAllTourism);
router.get('/:id', getTourismById);

// Admin routes (protected)
router.post('/admin/tourism', authMiddleware, adminMiddleware, createTourism);
router.put('/admin/tourism/:id', authMiddleware, adminMiddleware, updateTourism);
router.delete('/admin/tourism/:id', authMiddleware, adminMiddleware, deleteTourism);
router.get('/admin/tourism/stats', authMiddleware, adminMiddleware, getTourismStats);

export default router;
