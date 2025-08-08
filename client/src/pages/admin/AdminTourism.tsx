import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrashIcon,
  PencilIcon,
  PlusIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  MapPinIcon,
  ClockIcon,
  StarIcon,
  EyeIcon,
  CurrencyDollarIcon,
  TagIcon,
  CalendarIcon,
  FlagIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { tourismAPI } from '../../services/api';
import toast from 'react-hot-toast';
import AdminHeader from '../../components/admin/AdminHeader';

interface TourismFormData {
  type: string;
  title: string;
  description: string;
  shortDescription: string;
  location: string;
  duration: string;
  price: number;
  currency: string;
  category: string;
  difficulty: string;
  rating: number;
  reviewCount: number;
  images: { url: string; alt: string }[];
  availability: any;
  featured: boolean;
}

const AdminTourism: React.FC = () => {
  const [tourismData, setTourismData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [formData, setFormData] = useState<TourismFormData>({
    type: '',
    title: '',
    description: '',
    shortDescription: '',
    location: '',
    duration: '',
    price: 0,
    currency: 'USD',
    category: '',
    difficulty: 'easy',
    rating: 0,
    reviewCount: 0,
    images: [],
    availability: {},
    featured: false
  });

  useEffect(() => {
    fetchTourismData();
  }, []);

  // Filter data based on search and filters
  useEffect(() => {
    let filtered = tourismData;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Type filter
    if (selectedType !== 'all') {
      filtered = filtered.filter(item => item.type === selectedType);
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    setFilteredData(filtered);
  }, [tourismData, searchTerm, selectedType, selectedCategory]);

  const fetchTourismData = async () => {
    setLoading(true);
    try {
      const response = await tourismAPI.getAllTourism();
      if (response.success) {
        setTourismData(response.data);
      } else {
        console.error('Failed to fetch tourism data');
        toast.error('Failed to fetch tourism data');
      }
    } catch (error) {
      console.error('Error fetching tourism data:', error);
      toast.error('Error fetching tourism data');
    } finally {
      setLoading(false);
    }
  };

  const deleteTourismItem = async (id: string) => {
    try {
      if (window.confirm('Are you sure you want to delete this item?')) {
        const response = await tourismAPI.deleteTourism(id);
        if (response.success) {
          setTourismData(tourismData.filter(item => item.id !== id));
          toast.success('Tourism item deleted successfully');
        }
      }
    } catch (error) {
      console.error('Error deleting tourism item:', error);
      toast.error('Failed to delete tourism item');
    }
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setFormData({
      type: item.type || '',
      title: item.title || '',
      description: item.description || '',
      shortDescription: item.shortdescription || '',
      location: item.location || '',
      duration: item.duration || '',
      price: item.price || 0,
      currency: item.currency || 'USD',
      category: item.category || '',
      difficulty: item.difficulty || 'easy',
      rating: item.rating || 0,
      reviewCount: item.reviewcount || 0,
      images: item.images || [],
      availability: item.availability || {},
      featured: item.featured || false
    });
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({
      type: '',
      title: '',
      description: '',
      shortDescription: '',
      location: '',
      duration: '',
      price: 0,
      currency: 'USD',
      category: '',
      difficulty: 'easy',
      rating: 0,
      reviewCount: 0,
      images: [],
      availability: {},
      featured: false
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        const response = await tourismAPI.updateTourism(editingItem.id, formData);
        if (response.success) {
          toast.success('Tourism item updated successfully');
          fetchTourismData();
          setShowForm(false);
        }
      } else {
        const response = await tourismAPI.createTourism(formData);
        if (response.success) {
          toast.success('Tourism item created successfully');
          fetchTourismData();
          setShowForm(false);
        }
      }
    } catch (error) {
      console.error('Error saving tourism item:', error);
      toast.error('Failed to save tourism item');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setFormData(prev => ({
      ...prev,
      images: url ? [{ url, alt: formData.title || 'Tourism image' }] : []
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminHeader />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Manage Tourism</h1>
          <button 
            onClick={handleAdd}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            <PlusIcon className="w-5 h-5 inline mr-2" /> Add New
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div className="flex items-center gap-2">
            <FunnelIcon className="w-5 h-5 text-gray-400" />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Types</option>
              <option value="tour">Tours</option>
              <option value="homestay">Homestays</option>
              <option value="event">Events</option>
              <option value="activity">Activities</option>
            </select>
          </div>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          viewMode === 'table' ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Title
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Location
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Image
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200">
                {filteredData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{item.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {item.category || 'Other'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {item.location || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.images[0]?.url ? (
                        <img
                          src={item.images[0].url}
                          alt={item.title}
                          className="h-10 w-10 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 bg-gray-300 dark:bg-gray-600 rounded-lg flex items-center justify-center text-xs text-gray-500 dark:text-gray-400">
                          No Image
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteTourismItem(item.id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredData.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
                >
                  <div className="relative">
                    <img
                      src={item.images[0]?.url || '/images/placeholder.jpg'}
                      alt={item.title || 'Tourism item'}
                      className="w-full h-48 object-cover"
                    />
                    {item.featured && (
                      <div className="absolute top-2 left-2 bg-yellow-400 text-white text-xs px-2 py-1 rounded-full">
                        Featured
                      </div>
                    )}
                    <div className="absolute top-2 right-2 bg-white dark:bg-gray-800 rounded-full px-2 py-1">
                      <div className="flex items-center text-sm">
                        <StarIconSolid className="w-4 h-4 text-yellow-400 mr-1" />
                        {item.rating || 'N/A'}
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2">
                        {item.title}
                      </h3>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <MapPinIcon className="w-4 h-4 mr-1" />
                        {item.location || 'N/A'}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                      {item.shortDescription || 'No description available.'}
                    </p>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-3">
                      <ClockIcon className="w-4 h-4 mr-1" />
                      Duration: {item.duration || 'N/A'}
                    </div>
                    <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400 mb-4">
                      <div className="flex items-center">
                        <CurrencyDollarIcon className="w-4 h-4 mr-1" />
                        {item.price} {item.currency}
                      </div>
                      <TagIcon className="w-4 h-4 mr-1" />
                      {item.category || 'Other'}
                    </div>
                    <button
                      onClick={() => handleEdit(item)}
                      className="mt-2 w-full px-4 py-2 text-sm font-medium text-center text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none"
                    >
                      Edit
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )
        )}

        {showForm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Short Description
                  </label>
                  <textarea
                    name="shortDescription"
                    value={formData.shortDescription}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Price
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.images[0]?.url || ''}
                    onChange={handleImageUrlChange}
                    placeholder="https://example.com/image.jpg"
                    className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                
                <div className="flex justify-end space-x-2 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    {editingItem ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTourism;

