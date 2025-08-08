const express = require('express');
const router = express.Router();
const { auth, adminAuth } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  TourPackage,
  Hotel,
  Activity,
  Booking,
  Review,
  Destination
} = require('../models/Tourism');
const { generateBookingId } = require('../utils/helpers');

// Public Routes

// Get featured content for homepage
router.get('/featured', async (req, res) => {
  try {
    const [featuredTours, featuredHotels, featuredActivities, featuredDestinations] = await Promise.all([
      TourPackage.find({ featured: true, status: 'active' }).limit(6).sort({ rating: -1 }),
      Hotel.find({ featured: true, status: 'active' }).limit(4).sort({ rating: -1 }),
      Activity.find({ featured: true, status: 'active' }).limit(6).sort({ rating: -1 }),
      Destination.find({ featured: true, status: 'active' }).limit(8).sort({ popularity: -1 })
    ]);

    res.json({
      tours: featuredTours,
      hotels: featuredHotels,
      activities: featuredActivities,
      destinations: featuredDestinations
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Search functionality
router.get('/search', async (req, res) => {
  try {
    const { q, type, category, minPrice, maxPrice, destination, rating, sort } = req.query;
    let searchQuery = { status: 'active' };
    
    if (q) {
      searchQuery.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { destination: { $regex: q, $options: 'i' } }
      ];
    }

    if (category) searchQuery.category = category;
    if (destination) searchQuery.destination = { $regex: destination, $options: 'i' };
    if (rating) searchQuery.rating = { $gte: parseFloat(rating) };

    let sortOptions = {};
    switch (sort) {
      case 'price-low': sortOptions = { 'price.adult': 1 }; break;
      case 'price-high': sortOptions = { 'price.adult': -1 }; break;
      case 'rating': sortOptions = { rating: -1 }; break;
      case 'newest': sortOptions = { createdAt: -1 }; break;
      default: sortOptions = { featured: -1, rating: -1 };
    }

    let results = {};

    if (!type || type === 'tours') {
      let tourQuery = { ...searchQuery };
      if (minPrice || maxPrice) {
        tourQuery['price.adult'] = {};
        if (minPrice) tourQuery['price.adult'].$gte = parseFloat(minPrice);
        if (maxPrice) tourQuery['price.adult'].$lte = parseFloat(maxPrice);
      }
      results.tours = await TourPackage.find(tourQuery).sort(sortOptions).limit(20);
    }

    if (!type || type === 'hotels') {
      results.hotels = await Hotel.find(searchQuery).sort(sortOptions).limit(20);
    }

    if (!type || type === 'activities') {
      let activityQuery = { ...searchQuery };
      if (minPrice || maxPrice) {
        activityQuery['price.amount'] = {};
        if (minPrice) activityQuery['price.amount'].$gte = parseFloat(minPrice);
        if (maxPrice) activityQuery['price.amount'].$lte = parseFloat(maxPrice);
      }
      results.activities = await Activity.find(activityQuery).sort(sortOptions).limit(20);
    }

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Search failed', error: error.message });
  }
});

// Get all tour packages
router.get('/tours', async (req, res) => {
  try {
    const { page = 1, limit = 12, category, destination, sort } = req.query;
    let query = { status: 'active' };
    
    if (category) query.category = category;
    if (destination) query.destination = { $regex: destination, $options: 'i' };

    let sortOptions = {};
    switch (sort) {
      case 'price-low': sortOptions = { 'price.adult': 1 }; break;
      case 'price-high': sortOptions = { 'price.adult': -1 }; break;
      case 'rating': sortOptions = { rating: -1 }; break;
      default: sortOptions = { featured: -1, rating: -1 };
    }

    const tours = await TourPackage.find(query)
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await TourPackage.countDocuments(query);

    res.json({
      tours,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single tour package
router.get('/tours/:id', async (req, res) => {
  try {
    const tour = await TourPackage.findById(req.params.id);
    if (!tour || tour.status !== 'active') {
      return res.status(404).json({ message: 'Tour not found' });
    }

    // Get reviews for this tour
    const reviews = await Review.find({ 
      itemType: 'tour', 
      itemId: req.params.id, 
      status: 'approved' 
    }).sort({ createdAt: -1 });

    res.json({ tour, reviews });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all hotels
router.get('/hotels', async (req, res) => {
  try {
    const { page = 1, limit = 12, city, category, starRating } = req.query;
    let query = { status: 'active' };
    
    if (city) query['location.city'] = { $regex: city, $options: 'i' };
    if (category) query.category = category;
    if (starRating) query.starRating = parseInt(starRating);

    const hotels = await Hotel.find(query)
      .sort({ featured: -1, rating: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Hotel.countDocuments(query);

    res.json({
      hotels,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single hotel
router.get('/hotels/:id', async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel || hotel.status !== 'active') {
      return res.status(404).json({ message: 'Hotel not found' });
    }

    const reviews = await Review.find({ 
      itemType: 'hotel', 
      itemId: req.params.id, 
      status: 'approved' 
    }).sort({ createdAt: -1 });

    res.json({ hotel, reviews });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all activities
router.get('/activities', async (req, res) => {
  try {
    const { page = 1, limit = 12, category, location } = req.query;
    let query = { status: 'active' };
    
    if (category) query.category = category;
    if (location) query['location.name'] = { $regex: location, $options: 'i' };

    const activities = await Activity.find(query)
      .sort({ featured: -1, rating: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Activity.countDocuments(query);

    res.json({
      activities,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all destinations
router.get('/destinations', async (req, res) => {
  try {
    const destinations = await Destination.find({ status: 'active' })
      .sort({ featured: -1, popularity: -1 });
    res.json(destinations);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create booking
router.post('/bookings', async (req, res) => {
  try {
    const bookingData = {
      ...req.body,
      bookingId: generateBookingId()
    };

    const booking = new Booking(bookingData);
    await booking.save();

    res.status(201).json({
      message: 'Booking created successfully',
      booking: {
        bookingId: booking.bookingId,
        status: booking.status,
        totalAmount: booking.pricing.totalAmount
      }
    });
  } catch (error) {
    res.status(400).json({ message: 'Booking failed', error: error.message });
  }
});

// Get booking by ID
router.get('/bookings/:bookingId', async (req, res) => {
  try {
    const booking = await Booking.findOne({ bookingId: req.params.bookingId })
      .populate('itemId');
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Submit review
router.post('/reviews', async (req, res) => {
  try {
    const review = new Review(req.body);
    await review.save();

    res.status(201).json({ message: 'Review submitted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Review submission failed', error: error.message });
  }
});

// Admin Routes (Protected)

// Admin: Get all tours with admin privileges
router.get('/admin/tours', adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, category } = req.query;
    let query = {};
    
    if (status) query.status = status;
    if (category) query.category = category;

    const tours = await TourPackage.find(query)
      .populate('createdBy', 'username email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await TourPackage.countDocuments(query);

    res.json({
      tours,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Admin: Create tour package
router.post('/admin/tours', adminAuth, upload.array('images', 10), async (req, res) => {
  try {
    const tourData = {
      ...req.body,
      createdBy: req.user._id
    };

    if (req.files && req.files.length > 0) {
      tourData.images = req.files.map(file => ({
        url: `/uploads/${file.filename}`,
        alt: req.body.title,
        caption: req.body.title
      }));
    }

    const tour = new TourPackage(tourData);
    await tour.save();

    res.status(201).json({ message: 'Tour package created successfully', tour });
  } catch (error) {
    res.status(400).json({ message: 'Tour creation failed', error: error.message });
  }
});

// Admin: Update tour package
router.put('/admin/tours/:id', adminAuth, upload.array('images', 10), async (req, res) => {
  try {
    const tour = await TourPackage.findById(req.params.id);
    if (!tour) {
      return res.status(404).json({ message: 'Tour not found' });
    }

    const updateData = { ...req.body };

    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => ({
        url: `/uploads/${file.filename}`,
        alt: req.body.title || tour.title,
        caption: req.body.title || tour.title
      }));
      updateData.images = [...(tour.images || []), ...newImages];
    }

    const updatedTour = await TourPackage.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({ message: 'Tour updated successfully', tour: updatedTour });
  } catch (error) {
    res.status(400).json({ message: 'Tour update failed', error: error.message });
  }
});

// Admin: Delete tour package
router.delete('/admin/tours/:id', adminAuth, async (req, res) => {
  try {
    const tour = await TourPackage.findByIdAndDelete(req.params.id);
    if (!tour) {
      return res.status(404).json({ message: 'Tour not found' });
    }

    res.json({ message: 'Tour deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Deletion failed', error: error.message });
  }
});

// Admin: Get all bookings
router.get('/admin/bookings', adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 20, status, type } = req.query;
    let query = {};
    
    if (status) query.status = status;
    if (type) query.bookingType = type;

    const bookings = await Booking.find(query)
      .populate('itemId')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Booking.countDocuments(query);

    res.json({
      bookings,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Admin: Update booking status
router.put('/admin/bookings/:id/status', adminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json({ message: 'Booking status updated', booking });
  } catch (error) {
    res.status(400).json({ message: 'Status update failed', error: error.message });
  }
});

// Admin: Get all reviews
router.get('/admin/reviews', adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 20, status, itemType } = req.query;
    let query = {};
    
    if (status) query.status = status;
    if (itemType) query.itemType = itemType;

    const reviews = await Review.find(query)
      .populate('itemId')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Review.countDocuments(query);

    res.json({
      reviews,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Admin: Update review status
router.put('/admin/reviews/:id/status', adminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.json({ message: 'Review status updated', review });
  } catch (error) {
    res.status(400).json({ message: 'Status update failed', error: error.message });
  }
});

// Similar routes for hotels, activities, and destinations...
// (Adding them would make this file very long, but they follow the same pattern)

module.exports = router;
