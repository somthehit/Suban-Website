import express from 'express';
import * as donationController from '../controllers/donationController';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = express.Router();

// Public Routes for Donation Page
router.get('/payment-methods', donationController.getPaymentMethods); // Public endpoint for donation page
router.get('/donation-stats', donationController.getDonationStats); // Public stats for donation page
router.get('/donors', donationController.getDonors); // Public donors list for donation page

// Payment Methods Routes (Admin)
router.get('/admin/payment-methods', authenticateToken, requireAdmin, donationController.getPaymentMethods);
router.post('/admin/payment-methods', authenticateToken, requireAdmin, donationController.createPaymentMethod);
router.put('/admin/payment-methods/:id', authenticateToken, requireAdmin, donationController.updatePaymentMethod);
router.delete('/admin/payment-methods/:id', authenticateToken, requireAdmin, donationController.deletePaymentMethod);

// Donors Routes (Admin)
router.get('/admin/donors', authenticateToken, requireAdmin, donationController.getDonors);
router.get('/admin/donors/:id', authenticateToken, requireAdmin, donationController.getDonorById);

// Donations Routes
router.get('/admin/donations', authenticateToken, requireAdmin, donationController.getDonations);
router.post('/donations', donationController.createDonation); // Public - for frontend donation form
router.put('/admin/donations/:id/status', authenticateToken, requireAdmin, donationController.updateDonationStatus);

// Stats Routes (Admin)
router.get('/admin/donation-stats', authenticateToken, requireAdmin, donationController.getDonationStats);

export default router;
