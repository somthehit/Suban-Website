import express from 'express';
import * as contactController from '../controllers/contactController';

const router = express.Router();

// Public routes
router.post('/contact', contactController.createContactMessage);

// Admin routes
router.get('/admin/messages', contactController.getContactMessages);
router.put('/admin/messages/:id/read', contactController.updateMessageReadStatus);
router.delete('/admin/messages/:id', contactController.deleteContactMessage);
router.delete('/admin/messages/bulk', contactController.bulkDeleteMessages);
router.get('/admin/message-stats', contactController.getMessageStats);

export default router;
