import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BLOG_TAGS } from '../constants';
import {
  BookOpenIcon,
  LightBulbIcon,
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon
} from '@heroicons/react/24/outline';

const BlogPage: React.FC = () => {
  const posts = [
    { id: 1, title: 'Conservation Photography', excerpt: 'Learn how photography plays a crucial role in conservation efforts...', tag: 'Conservation', color: 'from-green-500 to-teal-500', emoji: '🌿' },
    { id: 2, title: 'Bird Watching Guide', excerpt: 'Tips and tricks for photographing birds in the wild...', tag: 'Birding', color: 'from-blue-500 to-purple-500', emoji: '🦉' },
    { id: 3, title: 'Ethical Wildlife Photography', excerpt: 'Understand the ethics behind capturing images of wildlife...', tag: 'Ethics', color: 'from-red-500 to-pink-500', emoji: '📷' },
    { id: 4, title: 'Himalayan Treasures', excerpt: 'Explore the hidden gems of the Himalayas through photography...', tag: 'Travel', color: 'from-orange-500 to-yellow-500', emoji: '⛰️' },
    { id: 5, title: 'Eco-friendly Gear', excerpt: 'Discover sustainable gear options for wildlife photographers...', tag: 'Gear', color: 'from-teal-500 to-green-500', emoji: '🔍' },
  ];

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
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50 dark:from-yellow-900/20 dark:via-orange-900/20 dark:to-pink-900/20">
      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 right-20 w-32 h-32 bg-yellow-200/30 dark:bg-yellow-400/10 rounded-full blur-xl" />
        <div className="absolute bottom-20 left-20 w-40 h-40 bg-orange-200/30 dark:bg-orange-400/10 rounded-full blur-xl" />
        <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-pink-200/30 dark:bg-pink-400/10 rounded-full blur-xl" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-16 lg:py-24 relative">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >

          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <BookOpenIcon className="w-4 h-4" />
              Insightful Articles
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Explore the
              <span className="bg-gradient-to-r from-yellow-600 via-orange-600 to-pink-600 bg-clip-text text-transparent ml-3">
                Blog
              </span>
            </h1>
            
            <div className="w-24 h-1 bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 mx-auto mb-8" />
            
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Dive into articles filled with photography insights, tips, and stories from the wild, 
              designed to inspire and educate nature enthusiasts and photographers alike.
            </p>
          </motion.div>

          {/* Blog Cards */}
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                variants={itemVariants}
                whileHover={{ scale: 1.02, y: -5 }}
                className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700"
              >
                {/* Content */}
                <div className={`p-6 bg-gradient-to-br ${post.color}`}>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xl">{post.emoji}</span>
                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-white text-gray-900">
                      {post.tag}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-yellow-100 transition-colors duration-300">
                    {post.title}
                  </h3>
                  
                  <p className="text-white/80 text-sm mb-4">
                    {post.excerpt}
                  </p>
                  
                  <Link 
                    to={`/blog/${post.id}`}
                    className="inline-flex items-center text-white hover:text-yellow-100 font-medium text-sm transition-colors duration-300"
                  >
                    Read More
                    <PaperAirplaneIcon className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Load More Button */}
          <motion.div variants={itemVariants} className="text-center mt-12">
            <button className="group inline-flex items-center gap-2 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
              <PaperAirplaneIcon className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
              Load More Articles
            </button>
          </motion.div>

        </motion.div>
      </div>
    </div>
  );
};

export default BlogPage;
