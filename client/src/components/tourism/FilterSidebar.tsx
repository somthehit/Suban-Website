import React from 'react';
import { Star, DollarSign, Mountain, MapPin } from 'lucide-react';

interface FilterSidebarProps {
  activeTab: 'tours' | 'homestay' | 'activities' | 'events';
  filters: {
    category: string;
    priceRange: number[];
    rating: number;
    difficulty: string;
    destination: string;
  };
  onFiltersChange: (filters: any) => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ activeTab, filters, onFiltersChange }) => {
  const updateFilter = (key: string, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const tourCategories = [
    { value: 'trekking', label: 'Trekking' },
    { value: 'cultural', label: 'Cultural Tours' },
    { value: 'adventure', label: 'Adventure' },
    { value: 'wildlife', label: 'Wildlife Safari' },
    { value: 'pilgrimage', label: 'Pilgrimage' },
    { value: 'heritage', label: 'Heritage Sites' },
    { value: 'honeymoon', label: 'Honeymoon' },
    { value: 'family', label: 'Family Tours' }
  ];

  const homestayCategories = [
    { value: 'traditional', label: 'Traditional' },
    { value: 'modern', label: 'Modern' },
    { value: 'family', label: 'Family Run' },
    { value: 'farm', label: 'Farm Stay' },
    { value: 'mountain', label: 'Mountain View' },
    { value: 'lakeside', label: 'Lakeside' }
  ];

  const eventCategories = [
    { value: 'cultural', label: 'Cultural Events' },
    { value: 'music', label: 'Music & Entertainment' },
    { value: 'festival', label: 'Festivals' },
    { value: 'religious', label: 'Religious Ceremonies' },
    { value: 'sports', label: 'Sports Events' },
    { value: 'food', label: 'Food & Culinary' }
  ];

  const activityCategories = [
    { value: 'adventure', label: 'Adventure' },
    { value: 'cultural', label: 'Cultural' },
    { value: 'nature', label: 'Nature' },
    { value: 'spiritual', label: 'Spiritual' },
    { value: 'food', label: 'Food & Dining' },
    { value: 'sports', label: 'Sports' },
    { value: 'photography', label: 'Photography' }
  ];

  const difficulties = [
    { value: 'easy', label: 'Easy' },
    { value: 'moderate', label: 'Moderate' },
    { value: 'challenging', label: 'Challenging' },
    { value: 'extreme', label: 'Extreme' }
  ];

  const destinations = [
    'Kathmandu Valley',
    'Everest Region',
    'Annapurna Region',
    'Langtang Region',
    'Pokhara',
    'Chitwan National Park',
    'Lumbini',
    'Bandipur',
    'Gorkha',
    'Mustang'
  ];

  const getCategories = () => {
    switch (activeTab) {
      case 'tours':
        return tourCategories;
      case 'homestay':
        return homestayCategories;
      case 'activities':
        return activityCategories;
      case 'events':
        return eventCategories;
      default:
        return [];
    }
  };

  const clearFilters = () => {
    onFiltersChange({
      category: '',
      priceRange: [0, 5000],
      rating: 0,
      difficulty: '',
      destination: ''
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h3>
        <button
          onClick={clearFilters}
          className="text-sm text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
        >
          Clear all
        </button>
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">Category</h4>
        <div className="space-y-2">
          {getCategories().map((category) => (
            <label key={category.value} className="flex items-center">
              <input
                type="radio"
                name="category"
                value={category.value}
                checked={filters.category === category.value}
                onChange={(e) => updateFilter('category', e.target.value)}
                className="w-4 h-4 text-emerald-600 border-gray-300 focus:ring-emerald-500"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                {category.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="mb-6">
        <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3 flex items-center">
          <DollarSign className="w-4 h-4 mr-1" />
          Price Range
        </h4>
        <div className="space-y-2">
          <input
            type="range"
            min="0"
            max="5000"
            step="50"
            value={filters.priceRange[1]}
            onChange={(e) => updateFilter('priceRange', [0, parseInt(e.target.value)])}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
          />
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>$0</span>
            <span>${filters.priceRange[1]}</span>
          </div>
        </div>
      </div>

      {/* Rating Filter */}
      <div className="mb-6">
        <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3 flex items-center">
          <Star className="w-4 h-4 mr-1" />
          Minimum Rating
        </h4>
        <div className="space-y-2">
          {[4, 3, 2, 1].map((rating) => (
            <label key={rating} className="flex items-center">
              <input
                type="radio"
                name="rating"
                value={rating}
                checked={filters.rating === rating}
                onChange={(e) => updateFilter('rating', parseInt(e.target.value))}
                className="w-4 h-4 text-emerald-600 border-gray-300 focus:ring-emerald-500"
              />
              <div className="ml-2 flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < rating
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300 dark:text-gray-600'
                    }`}
                  />
                ))}
                <span className="ml-1 text-sm text-gray-700 dark:text-gray-300">
                  & up
                </span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Difficulty Filter (for tours and activities) */}
      {(activeTab === 'tours' || activeTab === 'activities') && (
        <div className="mb-6">
          <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3 flex items-center">
            <Mountain className="w-4 h-4 mr-1" />
            Difficulty Level
          </h4>
          <div className="space-y-2">
            {difficulties.map((difficulty) => (
              <label key={difficulty.value} className="flex items-center">
                <input
                  type="radio"
                  name="difficulty"
                  value={difficulty.value}
                  checked={filters.difficulty === difficulty.value}
                  onChange={(e) => updateFilter('difficulty', e.target.value)}
                  className="w-4 h-4 text-emerald-600 border-gray-300 focus:ring-emerald-500"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  {difficulty.label}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Destination Filter */}
      <div className="mb-6">
        <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3 flex items-center">
          <MapPin className="w-4 h-4 mr-1" />
          Destination
        </h4>
        <select
          value={filters.destination}
          onChange={(e) => updateFilter('destination', e.target.value)}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
        >
          <option value="">All Destinations</option>
          {destinations.map((destination) => (
            <option key={destination} value={destination}>
              {destination}
            </option>
          ))}
        </select>
      </div>

      {/* Apply Filters Button */}
      <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-lg font-medium transition-colors">
        Apply Filters
      </button>
    </div>
  );
};

export default FilterSidebar;
