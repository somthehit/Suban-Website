import React from 'react';
import { motion } from 'framer-motion';
import {
  SparklesIcon,
  HeartIcon,
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
  StarIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';

const JoinUsPage: React.FC = () => {
  const benefits = [
    {
      icon: SparklesIcon,
      title: 'Exclusive Content',
      description: 'Access to premium wildlife photography tutorials and behind-the-scenes content.',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: HeartIcon,
      title: 'Community Connection',
      description: 'Connect with fellow photography enthusiasts and nature lovers from around the world.',
      color: 'from-red-500 to-pink-500'
    },
    {
      icon: ChatBubbleLeftRightIcon,
      title: 'Expert Guidance',
      description: 'Get direct feedback on your photography and participate in live Q&A sessions.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: GlobeAltIcon,
      title: 'Conservation Impact',
      description: 'Be part of wildlife conservation efforts and make a real difference.',
      color: 'from-green-500 to-emerald-500'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-red-50 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-red-900/20">
      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 right-20 w-32 h-32 bg-purple-200/30 dark:bg-purple-400/10 rounded-full blur-xl" />
        <div className="absolute bottom-20 left-20 w-40 h-40 bg-pink-200/30 dark:bg-pink-400/10 rounded-full blur-xl" />
        <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-red-200/30 dark:bg-red-400/10 rounded-full blur-xl" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-16 lg:py-24 relative">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <UserGroupIcon className="w-4 h-4" />
              Join Our Community
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Join
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent ml-3">
                Our Journey
              </span>
            </h1>
            
            <div className="w-24 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 mx-auto mb-8" />
            
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Become part of a passionate community dedicated to wildlife photography, conservation, 
              and the preservation of Nepal's natural heritage. Join fellow enthusiasts in documenting 
              and protecting our planet's incredible biodiversity.
            </p>
          </motion.div>

          {/* Benefits Grid */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                whileHover={{ scale: 1.02, y: -5 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-start gap-4">
                  <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r ${benefit.color} text-white rounded-full flex-shrink-0`}>
                    <benefit.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Call to Action */}
          <motion.div 
            variants={itemVariants} 
            className="text-center bg-white dark:bg-gray-800 rounded-2xl p-12 shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <StarIcon className="w-16 h-16 text-yellow-500 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Join our community today and gain access to exclusive content, expert guidance, 
              and the opportunity to contribute to wildlife conservation efforts.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 hover:from-purple-700 hover:via-pink-700 hover:to-red-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform shadow-lg hover:shadow-xl"
            >
              <UserGroupIcon className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
              Join Our Community
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default JoinUsPage;

