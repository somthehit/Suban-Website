import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HomeIcon } from '@heroicons/react/24/outline';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center py-12">
      <div className="container-custom text-center">
        <motion.div
          className="space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="space-y-4">
            <h1 className="text-9xl font-bold text-primary-600 dark:text-primary-400">
              404
            </h1>
            <h2 className="text-3xl font-semibold">Page Not Found</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              Oops! The page you're looking for doesn't exist. It might have been moved, 
              deleted, or you entered the wrong URL.
            </p>
          </div>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link 
              to="/" 
              className="btn btn-primary inline-flex items-center space-x-2"
            >
              <HomeIcon className="h-5 w-5" />
              <span>Back to Home</span>
            </Link>
          </motion.div>

          <motion.div
            className="pt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Lost in the wilderness? Let's get you back on track!
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFoundPage;
