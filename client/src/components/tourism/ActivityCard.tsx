import React from 'react';
import { Star, MapPin, Clock, Calendar, Mountain } from 'lucide-react';

interface Activity {
  id: string;
  title: string;
  location: { name: string };
  duration: { hours: number; type: string };
  price: { amount: number; currency: string };
  images: { url: string; alt: string }[];
  rating: number;
  reviewCount: number;
  category: string;
  difficulty: string;
  shortDescription: string;
}

interface ActivityCardProps {
  activity: Activity;
  onBook: () => void;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ activity, onBook }) => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'adventure': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'cultural': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'nature': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'spiritual': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'food': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'sports': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300';
      case 'photography': return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'moderate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'challenging': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const formatDuration = () => {
    if (activity.duration.type === 'hours') {
      return `${activity.duration.hours} hours`;
    }
    return activity.duration.type.replace('-', ' ');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      {/* Image */}
      <div className="relative">
        <img 
          src={activity.images[0]?.url || '/images/placeholder-activity.jpg'} 
          alt={activity.images[0]?.alt || activity.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-3 left-3 flex space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getCategoryColor(activity.category)}`}>
            {activity.category}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getDifficultyColor(activity.difficulty)}`}>
            {activity.difficulty}
          </span>
        </div>
        <div className="absolute top-3 right-3 bg-white dark:bg-gray-800 rounded-full px-2 py-1">
          <div className="flex items-center text-sm">
            <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
            <span className="text-gray-700 dark:text-gray-300">{activity.rating}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title and Location */}
        <div className="mb-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2">
            {activity.title}
          </h3>
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <MapPin className="w-4 h-4 mr-1" />
            <span>{activity.location.name}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
          {activity.shortDescription}
        </p>

        {/* Duration */}
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-3">
          <Clock className="w-4 h-4 mr-1" />
          <span>{formatDuration()}</span>
        </div>

        {/* Reviews */}
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-4">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(activity.rating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300 dark:text-gray-600'
                }`}
              />
            ))}
          </div>
          <span className="ml-2">({activity.reviewCount} reviews)</span>
        </div>

        {/* Price and Book Button */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              ${activity.price.amount}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              per person
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

export default ActivityCard;
