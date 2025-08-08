import { Router } from 'express';
import { loginAdmin } from '../controllers/authController';

const router = Router();

// POST /api/auth/login
router.post('/auth/login', loginAdmin);

export default router;
