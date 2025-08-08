import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { GALLERY_CATEGORIES } from '../../constants';
import { 
  CameraIcon, 
  EyeIcon, 
  ArrowRightIcon,
  SparklesIcon, 
  PlayIcon, 
  PauseIcon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon 
} from '@heroicons/react/24/outline';
import { galleryAPI } from '../../services/api';

interface GalleryImage {
  id: string;
  title: string;
  category: string;
  image_url: string;
  thumbnail_url?: string;
  caption?: string;
  alt_text: string;
  featured: boolean;
  sort_order: number;
}

const GallerySection: React.FC = () => {
  const featuredCategories = GALLERY_CATEGORIES.slice(0, 6);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxImageIndex, setLightboxImageIndex] = useState(0);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const controls = useAnimation();

  useEffect(() => {
    const fetchGalleryImages = async () => {
      try {
        setLoading(true);
        const response = await galleryAPI.getImages({ 
          featured: true, 
          limit: 8 
        });
        setGalleryImages(response.data || []);
      } catch (err) {
        console.error('Error fetching gallery images:', err);
        setError('Failed to load gallery images');
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryImages();
  }, []);

  const nextImage = useCallback(() => {
    setCurrentImageIndex(prev => (prev + 1) % galleryImages.length);
    controls.start({
      x: [0, -20, 0],
      transition: { duration: 0.5, ease: "easeInOut" }
    });
  }, [galleryImages.length, controls]);

  const openLightbox = (index: number) => {
    setLightboxImageIndex(index);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
  };

  const nextLightboxImage = () => {
    setLightboxImageIndex(prev => (prev + 1) % galleryImages.length);
  };

  const prevLightboxImage = () => {
    setLightboxImageIndex(prev => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  useEffect(() => {
    if (!isAutoPlay) return;
    const interval = setInterval(() => {
      nextImage();
    }, 8000);
    return () => clearInterval(interval);
  }, [isAutoPlay, nextImage]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isLightboxOpen) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prevLightboxImage();
      if (e.key === 'ArrowRight') nextLightboxImage();
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen]);

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
    <section className="py-16 lg:py-24 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-orange-900/20 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-purple-200/30 dark:bg-purple-400/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-pink-200/30 dark:bg-pink-400/10 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-orange-200/30 dark:bg-orange-400/10 rounded-full blur-xl transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {/* Section Header */}
          <motion.div variants={itemVariants} className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <CameraIcon className="w-4 h-4" />
              Wildlife Gallery
            </div>
            
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Captured Moments in the Wild
            </h2>
            
            <div className="w-20 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 mx-auto mb-6" />
            
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-6">
              Discover breathtaking wildlife photography from Nepal's diverse ecosystems, 
              from the dense jungles to the towering peaks of the Himalayas.
            </p>

            {/* Gallery Controls */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <button
                onClick={() => setIsAutoPlay(!isAutoPlay)}
                className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-2 rounded-lg hover:shadow-md transition-all duration-300"
              >
                {isAutoPlay ? (
                  <>
                    <PauseIcon className="w-4 h-4" />
                    <span className="text-sm font-medium">Pause</span>
                  </>
                ) : (
                  <>
                    <PlayIcon className="w-4 h-4" />
                    <span className="text-sm font-medium">Auto Play</span>
                  </>
                )}
              </button>
              
              <button
                onClick={nextImage}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
              >
                <SparklesIcon className="w-4 h-4" />
                <span className="text-sm font-medium">Next View</span>
              </button>
            </div>
          </motion.div>

          {/* Horizontal Gallery */}
          <motion.div 
            animate={controls}
            className="mb-12"
          >
            {/* Loading State */}
            {loading && (
              <div className="mb-6">
                <div className="h-64 lg:h-80 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-2xl" />
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="text-center py-12 mb-6">
                <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="text-purple-600 dark:text-purple-400 hover:underline"
                >
                  Try again
                </button>
              </div>
            )}

            {/* Main Featured Image */}
            {!loading && !error && galleryImages.length > 0 && (
              <motion.div 
                key={currentImageIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="mb-6"
              >
                <div 
                  className="relative h-64 lg:h-80 rounded-2xl overflow-hidden shadow-2xl cursor-pointer group"
                  onClick={() => openLightbox(currentImageIndex)}
                >
                  <img
                    src={galleryImages[currentImageIndex].thumbnail_url || galleryImages[currentImageIndex].image_url}
                    alt={galleryImages[currentImageIndex].alt_text}
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.src = '/images/placeholder-gallery.jpg';
                    }}
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-sm text-gray-900 px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                      {galleryImages[currentImageIndex].category}
                    </span>
                  </div>
                  
                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="font-bold text-2xl mb-2 text-shadow-md">{galleryImages[currentImageIndex].title}</h3>
                    {galleryImages[currentImageIndex].caption && (
                      <p className="text-lg text-gray-200 text-shadow-md">{galleryImages[currentImageIndex].caption}</p>
                    )}
                  </div>

                  {/* Click to view indicator */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="bg-black/50 backdrop-blur-sm rounded-full p-2">
                      <EyeIcon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {galleryImages.map((image, index) => (
                <motion.div
                  key={image.id}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className={`relative h-24 lg:h-32 rounded-xl overflow-hidden shadow-lg cursor-pointer group ${
                    index === currentImageIndex ? 'ring-4 ring-purple-500' : ''
                  }`}
                  onClick={() => {
                    setCurrentImageIndex(index);
                    openLightbox(index);
                  }}
                >
                  <img
                    src={image.thumbnail_url || image.image_url}
                    alt={image.alt_text}
                    className="w-full h-full object-cover transition-all duration-300 group-hover:brightness-110"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = '/images/placeholder-gallery.jpg';
                    }}
                  />
                  
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Category label */}
                  <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <span className="bg-white/90 backdrop-blur-sm text-gray-900 px-2 py-1 rounded text-xs font-medium">
                      {image.category}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Lightbox Modal */}
          <AnimatePresence>
            {isLightboxOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
                onClick={closeLightbox}
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="relative max-w-7xl max-h-full"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Close button */}
                  <button
                    onClick={closeLightbox}
                    className="absolute top-4 right-4 z-10 bg-black/50 backdrop-blur-sm rounded-full p-2 text-white hover:bg-black/70 transition-colors"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>

                  {/* Navigation buttons */}
                  <button
                    onClick={prevLightboxImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 backdrop-blur-sm rounded-full p-2 text-white hover:bg-black/70 transition-colors"
                  >
                    <ChevronLeftIcon className="w-6 h-6" />
                  </button>
                  
                  <button
                    onClick={nextLightboxImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 backdrop-blur-sm rounded-full p-2 text-white hover:bg-black/70 transition-colors"
                  >
                    <ChevronRightIcon className="w-6 h-6" />
                  </button>

                  {/* Main image */}
                  <img
                    src={galleryImages[lightboxImageIndex].image_url}
                    alt={galleryImages[lightboxImageIndex].alt_text}
                    className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
                    onError={(e) => {
                      e.currentTarget.src = '/images/placeholder-gallery.jpg';
                    }}
                  />
                  
                  {/* Image info */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 text-white rounded-b-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                        {galleryImages[lightboxImageIndex].category}
                      </span>
                      <span className="text-sm opacity-70">
                        {lightboxImageIndex + 1} / {galleryImages.length}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold mb-1">{galleryImages[lightboxImageIndex].title}</h3>
                    {galleryImages[lightboxImageIndex].caption && (
                      <p className="text-lg opacity-90">{galleryImages[lightboxImageIndex].caption}</p>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Category Tags */}
          <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-3 mb-12">
            {featuredCategories.map((category, index) => (
              <motion.div
                key={category}
                whileHover={{ scale: 1.05, y: -2 }}
                className="bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 hover:border-purple-300 dark:hover:border-purple-600"
              >
                <span className="text-gray-700 dark:text-gray-300 font-medium text-sm">
                  {category}
                </span>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div 
            variants={itemVariants}
            className="text-center"
          >
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/gallery"
                className="group inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <EyeIcon className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                Explore Full Gallery
                <ArrowRightIcon className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              
              <Link
                to="/contact"
                className="group inline-flex items-center gap-2 border-2 border-purple-600 text-purple-600 dark:text-purple-400 dark:border-purple-400 hover:bg-purple-600 hover:text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
              >
                <SparklesIcon className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                Commission Photos
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default GallerySection;
