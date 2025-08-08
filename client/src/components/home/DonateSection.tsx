import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  HeartIcon, 
  CameraIcon, 
  GlobeAltIcon,
  AcademicCapIcon,
  ArrowRightIcon,
  SparklesIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';

const DonateSection: React.FC = () => {
  const donationImpacts = [
    {
      icon: CameraIcon,
      title: 'Professional Equipment',
      description: 'Fund high-quality camera gear for documenting endangered species',
      impact: '$50 = New telephoto lens for wildlife photography',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20'
    },
    {
      icon: GlobeAltIcon,
      title: 'Conservation Projects',
      description: 'Support local wildlife habitat protection and restoration efforts',
      impact: '$100 = Protect 1 hectare of critical wildlife habitat',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      icon: AcademicCapIcon,
      title: 'Education Programs',
      description: 'Fund wildlife awareness workshops for local communities',
      impact: '$25 = Educate 10 children about wildlife conservation',
      color: 'from-purple-500 to-indigo-500',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20'
    }
  ];

  const quickDonations = [
    { amount: '$25', description: 'Support local education' },
    { amount: '$50', description: 'Fund equipment needs' },
    { amount: '$100', description: 'Protect habitats' },
    { amount: 'Custom', description: 'Your choice amount' }
  ];

  const achievements = [
    {
      icon: '🐅',
      number: '50+',
      label: 'Tigers Documented',
      description: 'Helping track and protect Nepal\'s tiger population'
    },
    {
      icon: '🌳',
      number: '500',
      label: 'Hectares Protected',
      description: 'Wildlife habitats preserved through our initiatives'
    },
    {
      icon: '👥',
      number: '1000+',
      label: 'People Educated',
      description: 'Local community members reached through workshops'
    },
    {
      icon: '📸',
      number: '10K+',
      label: 'Photos Captured',
      description: 'Wildlife moments documented for conservation'
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
    <section className="py-16 lg:py-24 bg-gradient-to-br from-rose-50 via-pink-50 to-violet-50 dark:from-rose-900/20 dark:via-pink-900/20 dark:to-violet-900/20 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-rose-200/30 dark:bg-rose-400/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-pink-200/30 dark:bg-pink-400/10 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-violet-200/30 dark:bg-violet-400/10 rounded-full blur-xl"></div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {/* Section Header */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <HeartIcon className="w-4 h-4" />
              Support Conservation
            </div>
            
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Help Protect Nepal's Wildlife
            </h2>
            
            <div className="w-20 h-1 bg-gradient-to-r from-rose-500 via-pink-500 to-violet-500 mx-auto mb-6" />
            
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Your generous donation directly supports wildlife conservation efforts, 
              photography equipment, and educational programs that preserve Nepal's incredible biodiversity.
            </p>
          </motion.div>

          {/* Donation Impact Cards */}
          <motion.div 
            variants={itemVariants}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16"
          >
            {donationImpacts.map((impact, index) => (
              <motion.div
                key={impact.title}
                whileHover={{ scale: 1.02, y: -5 }}
                className={`${impact.bgColor} rounded-2xl p-8 group hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700`}
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${impact.color} text-white rounded-full mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <impact.icon className="w-8 h-8" />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {impact.title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {impact.description}
                </p>
                
                <div className={`bg-gradient-to-r ${impact.color} bg-clip-text text-transparent font-semibold text-sm`}>
                  💡 {impact.impact}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Quick Donation Options */}
          <motion.div variants={itemVariants} className="mb-16">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">
                Make a Donation Today
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {quickDonations.map((donation, index) => (
                  <motion.button
                    key={donation.amount}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white rounded-xl p-6 text-center transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    <div className="text-2xl font-bold mb-2">{donation.amount}</div>
                    <div className="text-sm opacity-90">{donation.description}</div>
                  </motion.button>
                ))}
              </div>
              
              <div className="text-center">
                <Link
                  to="/donate"
                  className="group inline-flex items-center gap-2 bg-gradient-to-r from-rose-600 to-violet-600 hover:from-rose-700 hover:to-violet-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <CurrencyDollarIcon className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                  Donate Now
                  <ArrowRightIcon className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Achievements Grid */}
          <motion.div variants={itemVariants} className="mb-16">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-12">
              Our Conservation Impact
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.label}
                  whileHover={{ y: -5 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700"
                >
                  <div className="text-4xl mb-4">{achievement.icon}</div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {achievement.number}
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {achievement.label}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {achievement.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Payment Methods */}
          <motion.div variants={itemVariants} className="mb-16">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-6">
                Multiple Payment Options Available
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="text-center">
                  <div className="bg-green-500 text-white rounded-lg p-4 mb-4 inline-block">
                    <span className="font-bold text-lg">eSewa</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">
                    Quick and secure payments via eSewa mobile wallet
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="bg-blue-500 text-white rounded-lg p-4 mb-4 inline-block">
                    <span className="font-bold text-lg">Bank Transfer</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">
                    Direct bank transfers to support conservation efforts
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div 
            variants={itemVariants}
            className="text-center"
          >
            <div className="bg-gradient-to-r from-rose-600 to-violet-600 dark:from-rose-700 dark:to-violet-700 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Every Donation Makes a Difference</h3>
              <p className="text-rose-100 mb-6 max-w-2xl mx-auto">
                Join our mission to protect Nepal's incredible wildlife for future generations. 
                Your support helps fund conservation projects, education programs, and wildlife documentation.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  to="/donate"
                  className="group inline-flex items-center gap-2 bg-white text-rose-600 hover:bg-gray-50 px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <SparklesIcon className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                  Start Donating
                </Link>
                
                <Link
                  to="/contact"
                  className="group inline-flex items-center gap-2 border-2 border-white text-white hover:bg-white hover:text-rose-600 px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
                >
                  Learn More
                  <ArrowRightIcon className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </div>
              
              <div className="mt-6 text-rose-200 text-sm">
                🌟 Tax-deductible donations available for registered organizations
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default DonateSection;
