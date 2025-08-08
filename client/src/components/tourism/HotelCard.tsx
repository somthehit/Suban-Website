import React from 'react';
import { Star, MapPin, Wifi, Car, Coffee, Calendar } from 'lucide-react';

interface Hotel {
  id: string;
  name: string;
  location: { city: string; address: string };
  starRating: number;
  rating: number;
  reviewCount: number;
  images: { url: string; alt: string }[];
  category: string;
  rooms: { type: string; pricePerNight: number }[];
}

interface HotelCardProps {
  hotel: Hotel;
  onBook: () => void;
}

const HotelCard: React.FC<HotelCardProps> = ({ hotel, onBook }) => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'budget': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'mid-range': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'luxury': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'resort': return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300';
      case 'boutique': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const amenityIcons = [
    { icon: Wifi, name: 'WiFi' },
    { icon: Car, name: 'Parking' },
    { icon: Coffee, name: 'Restaurant' }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      {/* Image */}
      <div className="relative">
        <img 
          src={hotel.images[0]?.url || '/images/placeholder-hotel.jpg'} 
          alt={hotel.images[0]?.alt || hotel.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getCategoryColor(hotel.category)}`}>
            {hotel.category}
          </span>
        </div>
        <div className="absolute top-3 right-3 bg-white dark:bg-gray-800 rounded-full px-2 py-1">
          <div className="flex items-center text-sm">
            <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
            <span className="text-gray-700 dark:text-gray-300">{hotel.rating}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title and Location */}
        <div className="mb-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            {hotel.name}
          </h3>
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <MapPin className="w-4 h-4 mr-1" />
            <span>{hotel.location.city}, {hotel.location.address}</span>
          </div>
        </div>

        {/* Star Rating */}
        <div className="flex items-center mb-3">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < hotel.starRating
                  ? 'text-yellow-400 fill-current'
                  : 'text-gray-300 dark:text-gray-600'
              }`}
            />
          ))}
          <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
            {hotel.starRating} Star Hotel
          </span>
        </div>

        {/* Amenities */}
        <div className="flex items-center space-x-3 mb-3">
          {amenityIcons.map((amenity, index) => {
            const Icon = amenity.icon;
            return (
              <div key={index} className="flex items-center text-gray-600 dark:text-gray-400">
                <Icon className="w-4 h-4 mr-1" />
                <span className="text-xs">{amenity.name}</span>
              </div>
            );
          })}
        </div>

        {/* Reviews */}
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-4">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(hotel.rating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300 dark:text-gray-600'
                }`}
              />
            ))}
          </div>
          <span className="ml-2">({hotel.reviewCount} reviews)</span>
        </div>

        {/* Price and Book Button */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              ${hotel.rooms[0]?.pricePerNight || 0}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              per night
            </div>
          </div>
          <button
            onClick={onBook}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-1"
          >
            <Calendar className="w-4 h-4" />
            <span>Book Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HotelCard;
