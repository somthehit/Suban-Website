import express from 'express';
import * as settingsController from '../controllers/settingsController';

const router = express.Router();

// Admin routes
router.get('/admin/settings', settingsController.getSiteSettings);
router.post('/admin/settings', settingsController.upsertSiteSetting);
router.put('/admin/settings/batch', settingsController.batchUpdateSettings);
router.delete('/admin/settings/:key', settingsController.deleteSiteSetting);

// Public route
router.get('/settings/public', settingsController.getPublicSettings);

export default router;
