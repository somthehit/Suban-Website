import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeftOnRectangleIcon, 
  EyeIcon, 
  BellIcon,
  UserCircleIcon 
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const AdminHeader: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/admin/login');
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Left side - Logo and Navigation */}
          <div className="flex items-center space-x-8">
            <Link 
              to="/admin/dashboard" 
              className="text-xl font-bold text-gray-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            >
              Admin Panel
            </Link>
            
            <nav className="hidden md:flex space-x-6">
              <Link 
                to="/admin/dashboard" 
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Dashboard
              </Link>
              <Link 
                to="/admin/gallery" 
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Gallery
              </Link>
              <Link 
                to="/admin/blog" 
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Blog
              </Link>
              <Link 
                to="/admin/messages" 
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Messages
              </Link>
              <Link 
                to="/admin/settings" 
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Settings
              </Link>
              <Link 
                to="/admin/donate" 
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Donate
              </Link>
              <Link 
                to="/admin/tourism" 
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Tourism
              </Link>
            </nav>
          </div>

          {/* Right side - Actions and User */}
          <div className="flex items-center space-x-4">
            
            {/* View Site */}
            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="View Site"
            >
              <EyeIcon className="w-5 h-5" />
            </Link>

            {/* Notifications */}
            <button className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors relative">
              <BellIcon className="w-5 h-5" />
              {/* Notification badge */}
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>

            {/* User Menu */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <UserCircleIcon className="w-8 h-8 text-gray-600 dark:text-gray-300" />
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {user?.name || 'Admin'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {user?.email}
                  </p>
                </div>
              </div>

              {/* Logout Button */}
              <motion.button
                onClick={handleLogout}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                title="Logout"
              >
                <ArrowLeftOnRectangleIcon className="w-5 h-5" />
                <span className="hidden md:inline text-sm font-medium">Logout</span>
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default AdminHeader;
