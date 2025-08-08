const crypto = require('crypto');

// Generate unique booking ID
const generateBookingId = () => {
  const timestamp = Date.now().toString();
  const random = crypto.randomBytes(4).toString('hex').toUpperCase();
  return `BK${timestamp.slice(-6)}${random}`;
};

// Generate slug from title
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

// Format price
const formatPrice = (price, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(price);
};

// Calculate distance between two coordinates
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  return distance;
};

// Validate email
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate phone number
const isValidPhone = (phone) => {
  const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
  return phoneRegex.test(phone);
};

// Generate random string
const generateRandomString = (length = 10) => {
  return crypto.randomBytes(length).toString('hex').slice(0, length);
};

// Clean and validate MongoDB ObjectId
const isValidObjectId = (id) => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

module.exports = {
  generateBookingId,
  generateSlug,
  formatPrice,
  calculateDistance,
  isValidEmail,
  isValidPhone,
  generateRandomString,
  isValidObjectId
};
