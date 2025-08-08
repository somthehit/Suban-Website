import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GALLERY_CATEGORIES } from '../constants';
import {
  PhotoIcon,
  EyeIcon,
  HeartIcon,
  ShareIcon,
  MagnifyingGlassIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';

const GalleryPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Sample gallery data with different categories and colors
  const galleryItems = [
    { id: 1, category: 'Wildlife', title: 'Bengal Tiger', location: 'Chitwan National Park', color: 'from-orange-500 to-red-500', emoji: '🐅' },
    { id: 2, category: 'Birds', title: 'Himalayan Monal', location: 'Everest Region', color: 'from-blue-500 to-purple-500', emoji: '🦚' },
    { id: 3, category: 'Landscapes', title: 'Mountain Vista', location: 'Annapurna Circuit', color: 'from-green-500 to-blue-500', emoji: '🏔️' },
    { id: 4, category: 'Wildlife', title: 'Snow Leopard', location: 'Upper Mustang', color: 'from-gray-500 to-blue-500', emoji: '❄️' },
    { id: 5, category: 'Birds', title: 'Great Hornbill', location: 'Bardia National Park', color: 'from-yellow-500 to-orange-500', emoji: '🦅' },
    { id: 6, category: 'Landscapes', title: 'Forest Canopy', location: 'Chitwan', color: 'from-green-400 to-emerald-500', emoji: '🌳' },
    { id: 7, category: 'Macro', title: 'Butterfly Wing', location: 'Shivapuri Hills', color: 'from-pink-500 to-purple-500', emoji: '🦋' },
    { id: 8, category: 'Wildlife', title: 'One-horned Rhino', location: 'Chitwan National Park', color: 'from-gray-600 to-gray-800', emoji: '🦏' },
    { id: 9, category: 'Birds', title: 'Spiny Babbler', location: 'Kathmandu Valley', color: 'from-amber-500 to-yellow-500', emoji: '🐦' },
    { id: 10, category: 'Landscapes', title: 'Alpine Lake', location: 'Langtang Region', color: 'from-cyan-500 to-blue-500', emoji: '🏞️' },
    { id: 11, category: 'Macro', title: 'Dewdrop Magic', location: 'Nagarkot', color: 'from-teal-500 to-green-500', emoji: '💧' },
    { id: 12, category: 'Wildlife', title: 'Red Panda', location: 'Eastern Nepal', color: 'from-red-500 to-orange-500', emoji: '🐾' }
  ];

  const categories = ['All', ...GALLERY_CATEGORIES];

  const filteredItems = galleryItems.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        duration: 0.6
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-orange-900/20">
      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 right-20 w-32 h-32 bg-purple-200/30 dark:bg-purple-400/10 rounded-full blur-xl" />
        <div className="absolute bottom-20 left-20 w-40 h-40 bg-pink-200/30 dark:bg-pink-400/10 rounded-full blur-xl" />
        <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-orange-200/30 dark:bg-orange-400/10 rounded-full blur-xl" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-16 lg:py-24 relative">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <PhotoIcon className="w-4 h-4" />
              Wildlife Photography Collection
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Photography
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent ml-3">
                Gallery
              </span>
            </h1>
            
            <div className="w-24 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 mx-auto mb-8" />
            
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Explore Nepal's incredible biodiversity through my lens. Each photograph captures 
              the raw beauty and untamed spirit of wildlife in their natural habitat.
            </p>
          </motion.div>

          {/* Search and Filter */}
          <motion.div variants={itemVariants} className="mb-12">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search photos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 dark:text-white"
                />
              </div>

              {/* Category Filter */}
              <div className="flex items-center gap-2">
                <FunnelIcon className="w-5 h-5 text-gray-500" />
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                        selectedCategory === category
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Gallery Grid */}
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                variants={itemVariants}
                whileHover={{ scale: 1.02, y: -5 }}
                className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700"
              >
                {/* Image Placeholder */}
                <div className={`relative aspect-square bg-gradient-to-br ${item.color} flex items-center justify-center overflow-hidden`}>
                  <div className="text-6xl filter drop-shadow-lg">{item.emoji}</div>
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex gap-3">
                      <button className="p-2 bg-white/90 text-gray-800 rounded-full hover:bg-white transition-colors duration-200">
                        <EyeIcon className="w-5 h-5" />
                      </button>
                      <button className="p-2 bg-white/90 text-gray-800 rounded-full hover:bg-white transition-colors duration-200">
                        <HeartIcon className="w-5 h-5" />
                      </button>
                      <button className="p-2 bg-white/90 text-gray-800 rounded-full hover:bg-white transition-colors duration-200">
                        <ShareIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-3 py-1 bg-gradient-to-r ${item.color} text-white text-xs font-medium rounded-full`}>
                      {item.category}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
                    {item.title}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-300 text-sm flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    {item.location}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* No Results */}
          {filteredItems.length === 0 && (
            <motion.div 
              variants={itemVariants}
              className="text-center py-16"
            >
              <div className="text-6xl mb-4">📸</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No photos found
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Try adjusting your search or filter criteria
              </p>
            </motion.div>
          )}

          {/* Load More Button */}
          <motion.div variants={itemVariants} className="text-center mt-12">
            <button className="group inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
              <PhotoIcon className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
              Load More Photos
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default GalleryPage;
