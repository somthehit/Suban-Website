import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeftIcon,
  PhotoIcon,
  EyeIcon,
  CloudArrowUpIcon,
  StarIcon,
  TagIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';
import { GALLERY_CATEGORIES } from '../../constants';
import { uploadAPI, galleryAPI } from '../../services/api';

interface GalleryFormData {
  title: string;
  category: string;
  image_url: string;
  thumbnail_url: string;
  caption: string;
  alt_text: string;
  featured: boolean;
  sort_order: number;
  tags: string[];
}

const AdminGalleryEditor: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [formData, setFormData] = useState<GalleryFormData>({
    title: '',
    category: 'Wildlife',
    image_url: '',
    thumbnail_url: '',
    caption: '',
    alt_text: '',
    featured: false,
    sort_order: 0,
    tags: []
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [previewMode, setPreviewMode] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    if (isEditing) {
      setLoading(true);
      // Mock data for demonstration
      setTimeout(() => {
        setFormData({
          title: 'Bengal Tiger in Chitwan',
          category: 'Wildlife',
          image_url: '/images/gallery/tiger-chitwan.jpg',
          thumbnail_url: '/images/gallery/thumbs/tiger-chitwan.jpg',
          caption: 'A majestic Bengal tiger spotted during early morning safari in Chitwan National Park.',
          alt_text: 'Bengal tiger walking through tall grass in Chitwan National Park',
          featured: true,
          sort_order: 1,
          tags: ['tiger', 'chitwan', 'nepal', 'safari']
        });
        setLoading(false);
      }, 1000);
    }
  }, [id, isEditing]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const finalValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: finalValue }));
  };

  const handleTagAdd = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const tag = tagInput.trim().toLowerCase();
      if (tag && !formData.tags.includes(tag)) {
        setFormData(prev => ({ ...prev, tags: [...prev.tags, tag] }));
      }
      setTagInput('');
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      handleFileUpload(file);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    try {
      toast.loading('Uploading image...');
      const response = await uploadAPI.uploadImage(file);
      
      if (response.success) {
        setFormData(prev => ({
          ...prev,
          image_url: response.data.imageUrl,
          thumbnail_url: response.data.thumbnailUrl,
          alt_text: prev.alt_text || file.name.replace(/\.[^/.]+$/, '')
        }));
        toast.dismiss();
        toast.success('Image uploaded successfully!');
      } else {
        toast.dismiss();
        toast.error('Failed to upload image');
      }
    } catch (error) {
      toast.dismiss();
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
    }
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      toast.error('Please enter a title for the image');
      return;
    }
    
    if (!formData.image_url.trim()) {
      toast.error('Please upload an image');
      return;
    }

    setSaving(true);
    
    try {
      if (isEditing) {
        await galleryAPI.updateImage(id!, formData);
      } else {
        await galleryAPI.createImage(formData);
      }
      
      toast.success(`Image ${isEditing ? 'updated' : 'added'} successfully!`);
      navigate('/admin/gallery');
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save image');
    } finally {
      setSaving(false);
    }
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/gallery')}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isEditing ? 'Edit Image' : 'Add New Image'}
          </h1>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              previewMode
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            <EyeIcon className="w-5 h-5 mr-2 inline" />
            {previewMode ? 'Edit' : 'Preview'}
          </button>
          
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? 'Saving...' : 'Save Image'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {previewMode ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="max-w-2xl mx-auto">
                {formData.image_url && (
                  <div className="relative mb-6">
                    <img
                      src={formData.image_url}
                      alt={formData.alt_text}
                      className="w-full rounded-lg shadow-md"
                    />
                    {formData.featured && (
                      <div className="absolute top-4 right-4">
                        <StarIconSolid className="w-6 h-6 text-yellow-500" />
                      </div>
                    )}
                  </div>
                )}
                
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400 text-sm rounded-full">
                      <TagIcon className="w-4 h-4 mr-1" />
                      {formData.category}
                    </span>
                    {formData.featured && (
                      <span className="inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400 text-sm rounded-full">
                        <StarIcon className="w-4 h-4 mr-1" />
                        Featured
                      </span>
                    )}
                  </div>
                  
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formData.title || 'Untitled Image'}
                  </h2>
                  
                  {formData.caption && (
                    <p className="text-gray-600 dark:text-gray-400 text-lg">
                      {formData.caption}
                    </p>
                  )}
                  
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-sm rounded"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Image Upload */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Image Upload
                </h3>
                
                {formData.image_url ? (
                  <div className="space-y-4">
                    <div className="relative">
                      <img
                        src={formData.image_url}
                        alt="Preview"
                        className="w-full h-64 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => setFormData(prev => ({ ...prev, image_url: '', thumbnail_url: '' }))}
                        className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                      >
                        ×
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Image URL
                        </label>
                        <input
                          type="url"
                          name="image_url"
                          value={formData.image_url}
                          onChange={handleInputChange}
                          placeholder="https://example.com/image.jpg"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Thumbnail URL (optional)
                        </label>
                        <input
                          type="url"
                          name="thumbnail_url"
                          value={formData.thumbnail_url}
                          onChange={handleInputChange}
                          placeholder="https://example.com/thumb.jpg"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                      dragActive
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <CloudArrowUpIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      Upload Image
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Drag and drop an image here, or click to select
                    </p>
                    
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 cursor-pointer transition-colors"
                    >
                      <PhotoIcon className="w-5 h-5 mr-2" />
                      Choose File
                    </label>
                    
                    <p className="text-xs text-gray-500 mt-2">
                      Or enter image URL below
                    </p>
                    
                    <input
                      type="url"
                      name="image_url"
                      value={formData.image_url}
                      onChange={handleInputChange}
                      placeholder="https://example.com/image.jpg"
                      className="mt-3 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                )}
              </div>

              {/* Image Details */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Image Details
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Enter image title..."
                      className="w-full px-4 py-3 text-lg border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Caption
                    </label>
                    <textarea
                      name="caption"
                      value={formData.caption}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="Brief description of the image..."
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Alt Text *
                    </label>
                    <input
                      type="text"
                      name="alt_text"
                      value={formData.alt_text}
                      onChange={handleInputChange}
                      placeholder="Describe the image for accessibility..."
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Used for screen readers and when images fail to load
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Settings
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {GALLERY_CATEGORIES.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Sort Order
                </label>
                <input
                  type="number"
                  name="sort_order"
                  value={formData.sort_order}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Lower numbers appear first
                </p>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="featured"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <label htmlFor="featured" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Featured Image
                </label>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <TagIcon className="w-5 h-5 mr-2" />
              Tags
            </h3>
            
            <div className="space-y-3">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagAdd}
                placeholder="Add tags (press Enter or comma)"
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400 text-xs rounded-full"
                  >
                    {tag}
                    <button
                      onClick={() => handleTagRemove(tag)}
                      className="ml-1 text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminGalleryEditor;
