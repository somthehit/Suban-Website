import { Request, Response } from 'express';
import db from '../config/database';
import { paymentMethods, donors, donations } from '../db/schema';
import type { NewPaymentMethod, NewDonor, NewDonation } from '../db/schema';
import { eq, desc, sum, count, sql } from 'drizzle-orm';

// Payment Methods
export const getPaymentMethods = async (req: Request, res: Response) => {
  try {
    const data = await db
      .select()
      .from(paymentMethods)
      .orderBy(desc(paymentMethods.created_at));

    res.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch payment methods' });
  }
};

export const createPaymentMethod = async (req: Request, res: Response) => {
  try {
    const newPaymentMethod: NewPaymentMethod = {
      name: req.body.name,
      type: req.body.type,
      details: req.body.details,
      qr_code: req.body.qr_code,
      is_active: req.body.is_active ?? true,
    };

    const [data] = await db
      .insert(paymentMethods)
      .values(newPaymentMethod)
      .returning();

    res.status(201).json({ success: true, data, message: 'Payment method created successfully' });
  } catch (error) {
    console.error('Error creating payment method:', error);
    res.status(500).json({ success: false, error: 'Failed to create payment method' });
  }
};

export const updatePaymentMethod = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const updateData = {
      name: req.body.name,
      type: req.body.type,
      details: req.body.details,
      qr_code: req.body.qr_code,
      is_active: req.body.is_active,
      updated_at: new Date(),
    };

    const [data] = await db
      .update(paymentMethods)
      .set(updateData)
      .where(eq(paymentMethods.id, id))
      .returning();

    if (!data) {
      return res.status(404).json({ success: false, error: 'Payment method not found' });
    }

    res.json({ success: true, data, message: 'Payment method updated successfully' });
  } catch (error) {
    console.error('Error updating payment method:', error);
    res.status(500).json({ success: false, error: 'Failed to update payment method' });
  }
};

export const deletePaymentMethod = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const [deletedMethod] = await db
      .delete(paymentMethods)
      .where(eq(paymentMethods.id, id))
      .returning({ id: paymentMethods.id });

    if (!deletedMethod) {
      return res.status(404).json({ success: false, error: 'Payment method not found' });
    }

    res.json({ success: true, message: 'Payment method deleted successfully' });
  } catch (error) {
    console.error('Error deleting payment method:', error);
    res.status(500).json({ success: false, error: 'Failed to delete payment method' });
  }
};

// Donors
export const getDonors = async (req: Request, res: Response) => {
  try {
    const data = await db
      .select()
      .from(donors)
      .orderBy(desc(donors.created_at));

    res.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching donors:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch donors' });
  }
};

export const getDonorById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const [donor] = await db
      .select()
      .from(donors)
      .where(eq(donors.id, id))
      .limit(1);

    if (!donor) {
      return res.status(404).json({ success: false, error: 'Donor not found' });
    }

    // Get donations for this donor
    const donorDonations = await db
      .select()
      .from(donations)
      .where(eq(donations.donor_id, id))
      .orderBy(desc(donations.date));

    res.json({ success: true, data: { ...donor, donations: donorDonations } });
  } catch (error) {
    console.error('Error fetching donor:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch donor' });
  }
};

// Donations
export const getDonations = async (req: Request, res: Response) => {
  try {
    const data = await db
      .select({
        id: donations.id,
        donor_id: donations.donor_id,
        donor_name: donors.name,
        amount: donations.amount,
        currency: donations.currency,
        payment_method: donations.payment_method,
        message: donations.message,
        is_anonymous: donations.is_anonymous,
        status: donations.status,
        transaction_id: donations.transaction_id,
        date: donations.date,
        created_at: donations.created_at,
      })
      .from(donations)
      .leftJoin(donors, eq(donations.donor_id, donors.id))
      .orderBy(desc(donations.date));

    res.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching donations:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch donations' });
  }
};

export const createDonation = async (req: Request, res: Response) => {
  try {
    const db_transaction = await db.transaction(async (tx) => {
      // First, create or update donor
      let donor_id = req.body.donor_id;
      
      if (!donor_id) {
        // Create new donor
        const newDonor: NewDonor = {
          name: req.body.donor_name,
          email: req.body.donor_email,
          phone: req.body.donor_phone,
          country: req.body.donor_country,
          is_anonymous: req.body.is_anonymous ?? false,
        };

        const [createdDonor] = await tx
          .insert(donors)
          .values(newDonor)
          .returning();
        
        donor_id = createdDonor.id;
      }

      // Create donation
      const newDonation: NewDonation = {
        donor_id,
        amount: req.body.amount,
        currency: req.body.currency || 'USD',
        payment_method: req.body.payment_method,
        message: req.body.message,
        is_anonymous: req.body.is_anonymous ?? false,
        status: req.body.status || 'pending',
        transaction_id: req.body.transaction_id,
      };

      const [donation] = await tx
        .insert(donations)
        .values(newDonation)
        .returning();

      // Update donor statistics
      await tx
        .update(donors)
        .set({
          total_donated: sql`${donors.total_donated} + ${req.body.amount}`,
          donation_count: sql`${donors.donation_count} + 1`,
          last_donation: new Date(),
          updated_at: new Date(),
        })
        .where(eq(donors.id, donor_id));

      return donation;
    });

    res.status(201).json({ success: true, data: db_transaction, message: 'Donation created successfully' });
  } catch (error) {
    console.error('Error creating donation:', error);
    res.status(500).json({ success: false, error: 'Failed to create donation' });
  }
};

export const updateDonationStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const [data] = await db
      .update(donations)
      .set({ status })
      .where(eq(donations.id, id))
      .returning();

    if (!data) {
      return res.status(404).json({ success: false, error: 'Donation not found' });
    }

    res.json({ success: true, data, message: 'Donation status updated successfully' });
  } catch (error) {
    console.error('Error updating donation status:', error);
    res.status(500).json({ success: false, error: 'Failed to update donation status' });
  }
};

// Dashboard stats
export const getDonationStats = async (req: Request, res: Response) => {
  try {
    // Get total donations
    const [totalDonationsResult] = await db
      .select({ total: sum(donations.amount) })
      .from(donations)
      .where(eq(donations.status, 'completed'));

    // Get total donors
    const [totalDonorsResult] = await db
      .select({ count: count() })
      .from(donors);

    // Get active payment methods
    const [activeMethodsResult] = await db
      .select({ count: count() })
      .from(paymentMethods)
      .where(eq(paymentMethods.is_active, true));

    const totalDonations = Number(totalDonationsResult.total) || 0;
    const totalDonors = totalDonorsResult.count;
    const activeMethods = activeMethodsResult.count;
    const averageDonation = totalDonors > 0 ? totalDonations / totalDonors : 0;

    res.json({
      success: true,
      data: {
        totalDonations,
        totalDonors,
        activeMethods,
        averageDonation: Math.round(averageDonation),
      },
    });
  } catch (error) {
    console.error('Error fetching donation stats:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch donation stats' });
  }
};
