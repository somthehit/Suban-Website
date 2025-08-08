import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  UserIcon, 
  CameraIcon, 
  MapPinIcon, 
  CalendarIcon,
  StarIcon,
  DocumentArrowDownIcon,
  UserGroupIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

interface AboutSectionProps {
  className?: string;
}

const AboutSection: React.FC<AboutSectionProps> = ({ className = '' }) => {
  const stats = [
    {
      icon: CalendarIcon,
      value: '8+',
      label: 'Years Experience',
      color: 'text-emerald-500'
    },
    {
      icon: MapPinIcon,
      value: '15+',
      label: 'National Parks Explored',
      color: 'text-orange-500'
    },
    {
      icon: CameraIcon,
      value: '500+',
      label: 'Wildlife Captures',
      color: 'text-purple-500'
    },
    {
      icon: StarIcon,
      value: '100+',
      label: 'Stories Shared',
      color: 'text-blue-500'
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
    <section 
      id="main-content"
      className={`relative py-16 lg:py-24 bg-gradient-to-br from-emerald-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden ${className}`}
    >
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Jungle leaves pattern */}
        <div className="absolute top-20 left-10 w-32 h-32 opacity-10">
          <svg viewBox="0 0 100 100" className="w-full h-full text-emerald-600 dark:text-emerald-400">
            <path
              d="M20 50 Q30 20, 50 30 Q70 20, 80 50 Q70 80, 50 70 Q30 80, 20 50 Z"
              fill="currentColor"
            />
          </svg>
        </div>
        <div className="absolute bottom-20 right-10 w-24 h-24 opacity-5">
          <svg viewBox="0 0 100 100" className="w-full h-full text-orange-600 dark:text-orange-400">
            <circle cx="50" cy="50" r="40" fill="currentColor" />
          </svg>
        </div>
        
        {/* Animal silhouettes */}
        <div className="absolute top-40 right-20 w-16 h-16 opacity-5">
          <svg viewBox="0 0 100 100" className="w-full h-full text-gray-600">
            <path
              d="M10 80 Q20 60, 40 70 Q60 60, 90 80 Q80 90, 50 85 Q20 90, 10 80 Z"
              fill="currentColor"
            />
          </svg>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16"
        >
          {/* Left Side - Image */}
          <motion.div 
            variants={itemVariants}
            className="lg:w-1/2 flex justify-center"
          >
            <div className="relative">
              {/* Portrait Image */}
              <div className="relative w-80 h-80 lg:w-96 lg:h-96">
                <img
                  src="https://scontent.fdhi1-1.fna.fbcdn.net/v/t39.30808-6/448305682_3681958892056745_7776095021062696434_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeGqW2v74mN8knp2Pke0HLNxCAyQFLw9gVoIDJAUvD2BWpzj50qUQL4b8tZlwSdCJ-YJR7IPBX0Dw0R3EGaNBTxJ&_nc_ohc=Sc-vI_fSmWYQ7kNvwGFhbHL&_nc_oc=AdkTawtLrjc9LfD_ajMM-CPg8PAgJMCGayNWQ53nK0psK9Vn_P192-uJWNQIdFdDlxE&_nc_zt=23&_nc_ht=scontent.fdhi1-1.fna&_nc_gid=Piwy6aankDgrhI7iB4LryQ&oh=00_AfVbz4jNcc2Y0wMP88WPN85sl7tBfbgCK9NSxEUFFyQoeg&oe=68965C48"
                  alt="Suban Chaudhary - Wildlife Photographer"
                  className="w-full h-full object-cover rounded-full shadow-2xl border-4 border-white dark:border-gray-700"
                />
                
                {/* Floating Badge */}
                <motion.div
                  initial={{ scale: 0, rotate: -10 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                  className="absolute -bottom-4 -right-4 bg-emerald-600 text-white rounded-full p-4 shadow-xl border-4 border-white dark:border-gray-800"
                >
                  <CameraIcon className="w-8 h-8" />
                </motion.div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-orange-200 dark:bg-orange-900/30 rounded-full blur-xl"></div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-emerald-200 dark:bg-emerald-900/30 rounded-full blur-xl"></div>
            </div>
          </motion.div>

          {/* Right Side - Content */}
          <motion.div 
            variants={itemVariants}
            className="lg:w-1/2 text-center lg:text-left"
          >
            {/* Section Header */}
            <div className="mb-8">
              <motion.div
                variants={itemVariants}
                className="inline-flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-medium mb-4"
              >
                <UserIcon className="w-4 h-4" />
                About Me
              </motion.div>
              
              <motion.h2 
                variants={itemVariants}
                className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4"
              >
                Meet Suban Chaudhary
              </motion.h2>
              
              <motion.div 
                variants={itemVariants}
                className="w-20 h-1 bg-gradient-to-r from-emerald-500 to-orange-500 mx-auto lg:mx-0 mb-6"
              />
            </div>

            {/* Description */}
            <motion.div variants={itemVariants} className="mb-8">
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Suban is a passionate wildlife photographer and nature guide from Nepal, 
                dedicated to capturing the raw beauty and untold stories of Nepal's diverse ecosystems.
              </p>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                With over 8 years of experience exploring the pristine jungles of Chitwan, 
                the rugged landscapes of Bardiya, and the majestic Himalayas, Suban brings 
                a unique perspective to wildlife conservation through his lens.
              </p>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                His work not only showcases the magnificence of Nepal's wildlife but also 
                raises awareness about conservation efforts and the importance of preserving 
                these natural habitats for future generations.
              </p>
            </motion.div>

            {/* Stats Grid */}
            <motion.div 
              variants={itemVariants}
              className="grid grid-cols-2 gap-4 mb-8"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-100 dark:border-gray-700 text-center"
                >
                  <stat.icon className={`w-8 h-8 ${stat.color} mx-auto mb-2`} />
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>

            {/* Action Buttons */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Link
                to="/about"
                className="group inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <DocumentArrowDownIcon className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                Full Biography
              </Link>
              
              <Link
                to="/join-us"
                className="group inline-flex items-center justify-center gap-2 border-2 border-emerald-600 text-emerald-600 dark:text-emerald-400 dark:border-emerald-400 hover:bg-emerald-600 hover:text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
              >
                <UserGroupIcon className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                Join Expedition
                <ArrowRightIcon className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
