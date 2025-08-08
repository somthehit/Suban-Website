import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PhotoIcon,
  StarIcon,
  TagIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';
import { galleryAPI } from '../../services/api';
import { GALLERY_CATEGORIES } from '../../constants';

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
  position?: number;
  size?: 'small' | 'medium' | 'large';
  is_active?: boolean;
}

const AdminGallery: React.FC = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterFeatured, setFilterFeatured] = useState<string>('all');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    setLoading(true);
    try {
      const response = await galleryAPI.getAllImages();
      if (response.success) {
        setImages(response.data || []);
      } else {
        throw new Error('Failed to fetch gallery images');
      }
    } catch (error) {
      console.error('Error fetching gallery:', error);
      toast.error('Failed to load gallery images');
      setImages([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredImages = images.filter(image => {
    const matchesSearch = image.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         image.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (image.caption && image.caption.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = filterCategory === 'all' || image.category === filterCategory;
    const matchesFeatured = filterFeatured === 'all' || 
                           (filterFeatured === 'featured' && image.featured) ||
                           (filterFeatured === 'not-featured' && !image.featured);
    
    return matchesSearch && matchesCategory && matchesFeatured;
  });

  const handleSelectImage = (imageId: string) => {
    setSelectedImages(prev => 
      prev.includes(imageId) 
        ? prev.filter(id => id !== imageId)
        : [...prev, imageId]
    );
  };

  const handleSelectAll = () => {
    if (selectedImages.length === filteredImages.length) {
      setSelectedImages([]);
    } else {
      setSelectedImages(filteredImages.map(image => image.id));
    }
  };
  const handleBulkDelete = async () => {
    if (selectedImages.length === 0) return;
    
    const confirmDelete = window.confirm(`Are you sure you want to delete ${selectedImages.length} image(s)?`);
    if (confirmDelete) {
      try {
        // Delete each selected image
        await galleryAPI.bulkDelete(selectedImages);
        toast.success(`${selectedImages.length} image(s) deleted successfully`);
        setSelectedImages([]);
        await fetchGallery(); // Refresh the list
      } catch (error) {
        console.error('Error deleting images:', error);
        toast.error('Failed to delete images');
      }
    }
  };

  const handleToggleFeatured = async (imageId: string, currentStatus: boolean) => {
    try {
      await galleryAPI.updateImage(imageId, { featured: !currentStatus });
      setImages(prev => prev.map(image => 
        image.id === imageId ? { ...image, featured: !currentStatus } : image
      ));
      toast.success(`Image ${!currentStatus ? 'featured' : 'unfeatured'} successfully`);
    } catch (error) {
      console.error('Error updating image:', error);
      toast.error('Failed to update image status');
    }
  };

  const handleUpdateCategory = async (imageId: string, newCategory: string) => {
    // TODO: Implement update category API call
    setImages(prev => prev.map(image => 
      image.id === imageId ? { ...image, category: newCategory } : image
    ));
    toast.success('Category updated successfully');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gallery</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your photography gallery
          </p>
        </div>
        <Link
          to="/admin/gallery/new"
          className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Add Image
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search images..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <FunnelIcon className="w-5 h-5 text-gray-400" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Categories</option>
                {GALLERY_CATEGORIES.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            <select
              value={filterFeatured}
              onChange={(e) => setFilterFeatured(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Images</option>
              <option value="featured">Featured</option>
              <option value="not-featured">Not Featured</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedImages.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded-lg p-4"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm text-purple-700 dark:text-purple-300">
              {selectedImages.length} image(s) selected
            </span>
            <div className="flex gap-2">
              <button
                onClick={handleBulkDelete}
                className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
              >
                Delete Selected
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Images Grid/List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        {filteredImages.length === 0 ? (
          <div className="p-8 text-center">
            <PhotoIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-gray-500 dark:text-gray-400 text-lg mb-2">No images found</h3>
            <p className="text-gray-400 dark:text-gray-500 mb-4">
              {searchTerm || filterCategory !== 'all' || filterFeatured !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Upload your first image to get started'
              }
            </p>
            {!searchTerm && filterCategory === 'all' && filterFeatured === 'all' && (
              <Link
                to="/admin/gallery/new"
                className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <PlusIcon className="w-5 h-5 mr-2" />
                Upload First Image
              </Link>
            )}
          </div>
        ) : (
          <div className="p-4">
            {/* Header with select all */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedImages.length === filteredImages.length}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Select All ({filteredImages.length})
                </span>
              </div>
              
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {filteredImages.length} of {images.length} images
              </div>
            </div>

            {/* Images Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredImages.map((image) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="group relative bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200"
                >
                  {/* Selection checkbox */}
                  <div className="absolute top-2 left-2 z-10">
                    <input
                      type="checkbox"
                      checked={selectedImages.includes(image.id)}
                      onChange={() => handleSelectImage(image.id)}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 bg-white"
                    />
                  </div>

                  {/* Featured badge */}
                  {image.featured && (
                    <div className="absolute top-2 right-2 z-10">
                      <StarIconSolid className="w-5 h-5 text-yellow-500" />
                    </div>
                  )}

                  {/* Image */}
                  <div className="aspect-square relative overflow-hidden">
                    <img
                      src={image.thumbnail_url || image.image_url}
                      alt={image.alt_text}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      onError={(e) => {
                        e.currentTarget.src = '/images/placeholder-image.jpg';
                      }}
                    />
                    
                    {/* Overlay actions */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="flex gap-2">
                        <button
                          onClick={() => window.open(image.image_url, '_blank')}
                          className="p-2 bg-white text-gray-800 rounded-lg hover:bg-gray-100 transition-colors"
                          title="View Full Size"
                        >
                          <EyeIcon className="w-4 h-4" />
                        </button>
                        <Link
                          to={`/admin/gallery/edit/${image.id}`}
                          className="p-2 bg-white text-gray-800 rounded-lg hover:bg-gray-100 transition-colors"
                          title="Edit"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Image info */}
                  <div className="p-3">
                    <h3 className="font-semibold text-sm text-gray-900 dark:text-white mb-1 line-clamp-1">
                      {image.title}
                    </h3>
                    
                    <div className="flex items-center justify-between mb-2">
                      <span className="inline-flex items-center px-2 py-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs rounded">
                        <TagIcon className="w-3 h-3 mr-1" />
                        {image.category}
                      </span>
                    </div>
                    
                    {image.caption && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-2">
                        {image.caption}
                      </p>
                    )}
                    
                    {/* Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleToggleFeatured(image.id, image.featured)}
                          className={`p-1 rounded ${
                            image.featured
                              ? 'text-yellow-500 hover:text-yellow-600'
                              : 'text-gray-400 hover:text-yellow-500'
                          } transition-colors`}
                          title={image.featured ? 'Remove from featured' : 'Add to featured'}
                        >
                          {image.featured ? (
                            <StarIconSolid className="w-4 h-4" />
                          ) : (
                            <StarIcon className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      
                      <select
                        value={image.category}
                        onChange={(e) => handleUpdateCategory(image.id, e.target.value)}
                        className="text-xs px-2 py-1 border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        {GALLERY_CATEGORIES.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminGallery;
