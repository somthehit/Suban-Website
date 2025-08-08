const mongoose = require('mongoose');

// Tour Package Schema
const tourPackageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  shortDescription: {
    type: String,
    required: true,
    maxlength: 200
  },
  destination: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['trekking', 'cultural', 'adventure', 'wildlife', 'pilgrimage', 'heritage', 'honeymoon', 'family']
  },
  duration: {
    days: { type: Number, required: true },
    nights: { type: Number, required: true }
  },
  price: {
    adult: { type: Number, required: true },
    child: { type: Number, required: true },
    currency: { type: String, default: 'USD' }
  },
  images: [{
    url: { type: String, required: true },
    alt: { type: String, required: true },
    caption: String
  }],
  itinerary: [{
    day: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    activities: [String],
    accommodation: String,
    meals: [String]
  }],
  inclusions: [String],
  exclusions: [String],
  difficulty: {
    type: String,
    enum: ['easy', 'moderate', 'challenging', 'extreme'],
    default: 'moderate'
  },
  groupSize: {
    min: { type: Number, default: 1 },
    max: { type: Number, default: 15 }
  },
  bestSeason: [String],
  location: {
    country: { type: String, default: 'Nepal' },
    region: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  featured: { type: Boolean, default: false },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['active', 'inactive', 'draft'],
    default: 'active'
  },
  tags: [String],
  seoTitle: String,
  seoDescription: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Hotel Schema
const hotelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  location: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, default: 'Nepal' },
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  category: {
    type: String,
    enum: ['budget', 'mid-range', 'luxury', 'resort', 'boutique'],
    required: true
  },
  starRating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  amenities: [String],
  rooms: [{
    type: {
      type: String,
      required: true
    },
    description: String,
    capacity: { type: Number, required: true },
    pricePerNight: { type: Number, required: true },
    amenities: [String],
    images: [String]
  }],
  images: [{
    url: { type: String, required: true },
    alt: { type: String, required: true },
    caption: String
  }],
  contactInfo: {
    phone: String,
    email: String,
    website: String
  },
  policies: {
    checkIn: String,
    checkOut: String,
    cancellation: String,
    petPolicy: String
  },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0 },
  featured: { type: Boolean, default: false },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Activity Schema
const activitySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  shortDescription: {
    type: String,
    required: true,
    maxlength: 150
  },
  category: {
    type: String,
    required: true,
    enum: ['adventure', 'cultural', 'nature', 'spiritual', 'food', 'sports', 'photography']
  },
  location: {
    name: { type: String, required: true },
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  duration: {
    hours: Number,
    type: {
      type: String,
      enum: ['hours', 'half-day', 'full-day', 'multi-day']
    }
  },
  price: {
    amount: { type: Number, required: true },
    currency: { type: String, default: 'USD' }
  },
  images: [{
    url: { type: String, required: true },
    alt: { type: String, required: true }
  }],
  inclusions: [String],
  requirements: [String],
  difficulty: {
    type: String,
    enum: ['easy', 'moderate', 'challenging'],
    default: 'easy'
  },
  availability: {
    seasonal: Boolean,
    months: [String],
    daysOfWeek: [String]
  },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0 },
  featured: { type: Boolean, default: false },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Booking Schema
const bookingSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    unique: true,
    required: true
  },
  customer: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    nationality: String,
    passportNumber: String
  },
  bookingType: {
    type: String,
    enum: ['tour', 'hotel', 'activity'],
    required: true
  },
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'bookingType'
  },
  participants: [{
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    age: Number,
    type: {
      type: String,
      enum: ['adult', 'child', 'infant'],
      required: true
    }
  }],
  dates: {
    startDate: { type: Date, required: true },
    endDate: Date
  },
  pricing: {
    basePrice: { type: Number, required: true },
    taxes: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    currency: { type: String, default: 'USD' }
  },
  payment: {
    method: String,
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'failed', 'refunded'],
      default: 'pending'
    },
    transactionId: String,
    paidAmount: { type: Number, default: 0 }
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  specialRequests: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Review Schema
const reviewSchema = new mongoose.Schema({
  customer: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    avatar: String
  },
  itemType: {
    type: String,
    enum: ['tour', 'hotel', 'activity'],
    required: true
  },
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'itemType'
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  title: {
    type: String,
    required: true
  },
  comment: {
    type: String,
    required: true
  },
  images: [String],
  helpful: { type: Number, default: 0 },
  verified: { type: Boolean, default: false },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  }
}, {
  timestamps: true
});

// Destination Schema
const destinationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  shortDescription: {
    type: String,
    required: true,
    maxlength: 200
  },
  region: {
    type: String,
    required: true
  },
  country: {
    type: String,
    default: 'Nepal'
  },
  coordinates: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true }
  },
  images: [{
    url: { type: String, required: true },
    alt: { type: String, required: true },
    caption: String
  }],
  highlights: [String],
  bestTimeToVisit: [String],
  activities: [String],
  attractions: [String],
  gettingThere: String,
  localTips: [String],
  featured: { type: Boolean, default: false },
  popularity: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  seoTitle: String,
  seoDescription: String
}, {
  timestamps: true
});

// Create indexes for better performance
tourPackageSchema.index({ destination: 1, category: 1 });
tourPackageSchema.index({ featured: -1, rating: -1 });
tourPackageSchema.index({ status: 1, createdAt: -1 });

hotelSchema.index({ 'location.city': 1, category: 1 });
hotelSchema.index({ featured: -1, starRating: -1 });

activitySchema.index({ category: 1, 'location.name': 1 });
activitySchema.index({ featured: -1, rating: -1 });

bookingSchema.index({ bookingId: 1 });
bookingSchema.index({ 'customer.email': 1 });
bookingSchema.index({ status: 1, createdAt: -1 });

reviewSchema.index({ itemType: 1, itemId: 1 });
reviewSchema.index({ status: 1, createdAt: -1 });

destinationSchema.index({ featured: -1, popularity: -1 });

const TourPackage = mongoose.model('TourPackage', tourPackageSchema);
const Hotel = mongoose.model('Hotel', hotelSchema);
const Activity = mongoose.model('Activity', activitySchema);
const Booking = mongoose.model('Booking', bookingSchema);
const Review = mongoose.model('Review', reviewSchema);
const Destination = mongoose.model('Destination', destinationSchema);

module.exports = {
  TourPackage,
  Hotel,
  Activity,
  Booking,
  Review,
  Destination
};
