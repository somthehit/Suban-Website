import express from 'express';
import * as joinRequestController from '../controllers/joinRequestController';

const router = express.Router();

// Public routes
router.post('/join-requests', joinRequestController.createJoinRequest);

// Admin routes
router.get('/admin/join-requests', joinRequestController.getJoinRequests);
router.put('/admin/join-requests/:id/status', joinRequestController.updateJoinRequestStatus);
router.delete('/admin/join-requests/:id', joinRequestController.deleteJoinRequest);
router.get('/admin/join-request-stats', joinRequestController.getJoinRequestStats);

export default router;
