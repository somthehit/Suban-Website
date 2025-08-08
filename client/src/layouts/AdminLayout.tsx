import React from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import ScrollToTopButton from '../components/common/ScrollToTopButton';

const AdminLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <motion.main 
        className="p-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Admin Panel
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your wildlife photography website
            </p>
          </div>
          <Outlet />
        </div>
      </motion.main>
      
      {/* Scroll to Top Button */}
      <ScrollToTopButton />
    </div>
  );
};

export default AdminLayout;
