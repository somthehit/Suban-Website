import React from 'react';
import { Star, MapPin, Clock, Users, Calendar } from 'lucide-react';

interface Tour {
  id: string;
  title: string;
  destination: string;
  duration: { days: number; nights: number };
  price: { adult: number; child: number; currency: string };
  images: { url: string; alt: string }[];
  rating: number;
  reviewCount: number;
  category: string;
  difficulty: string;
  shortDescription: string;
}

interface TourCardProps {
  tour: Tour;
  onBook: () => void;
}

const TourCard: React.FC<TourCardProps> = ({ tour, onBook }) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'moderate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'challenging': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'extreme': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      {/* Image */}
      <div className="relative">
        <img 
          src={tour.images[0]?.url || '/images/placeholder.jpg'} 
          alt={tour.images[0]?.alt || tour.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getDifficultyColor(tour.difficulty)}`}>
            {tour.difficulty}
          </span>
        </div>
        <div className="absolute top-3 right-3 bg-white dark:bg-gray-800 rounded-full px-2 py-1">
          <div className="flex items-center text-sm">
            <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
            <span className="text-gray-700 dark:text-gray-300">{tour.rating}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title and Location */}
        <div className="mb-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2">
            {tour.title}
          </h3>
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <MapPin className="w-4 h-4 mr-1" />
            <span>{tour.destination}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
          {tour.shortDescription}
        </p>

        {/* Duration */}
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-3">
          <Clock className="w-4 h-4 mr-1" />
          <span>{tour.duration.days} days, {tour.duration.nights} nights</span>
        </div>

        {/* Reviews */}
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-4">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(tour.rating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300 dark:text-gray-600'
                }`}
              />
            ))}
          </div>
          <span className="ml-2">({tour.reviewCount} reviews)</span>
        </div>

        {/* Price and Book Button */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              ${tour.price.adult}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              per adult
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

export default TourCard;

