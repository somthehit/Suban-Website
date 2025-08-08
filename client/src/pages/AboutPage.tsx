import React from 'react';
import { motion } from 'framer-motion';
import {
  CameraIcon,
  MapIcon,
  AcademicCapIcon,
  HeartIcon,
  StarIcon,
  UserIcon,
  CalendarIcon,
  TrophyIcon
} from '@heroicons/react/24/outline';

const AboutPage: React.FC = () => {
  const stats = [
    { icon: CameraIcon, label: 'Years Experience', value: '8+', color: 'from-blue-500 to-cyan-500' },
    { icon: MapIcon, label: 'Locations Explored', value: '50+', color: 'from-green-500 to-emerald-500' },
    { icon: HeartIcon, label: 'Wildlife Species', value: '200+', color: 'from-red-500 to-pink-500' },
    { icon: TrophyIcon, label: 'Awards Won', value: '12', color: 'from-amber-500 to-orange-500' }
  ];

  const skills = [
    { icon: CameraIcon, title: 'Wildlife Photography', description: 'Specializing in capturing Nepal\'s diverse wildlife in their natural habitat' },
    { icon: AcademicCapIcon, title: 'Nature Guiding', description: 'Expert knowledge of local ecosystems and wildlife behavior patterns' },
    { icon: MapIcon, title: 'Expedition Planning', description: 'Creating safe and memorable wildlife photography adventures' },
    { icon: HeartIcon, title: 'Conservation Advocacy', description: 'Promoting wildlife conservation through visual storytelling' }
  ];

  const journey = [
    {
      year: '2016',
      title: 'Photography Journey Begins',
      description: 'Started wildlife photography in Chitwan National Park',
      icon: '🌱'
    },
    {
      year: '2018',
      title: 'First Exhibition',
      description: 'Showcased wildlife photography at local art gallery',
      icon: '🎨'
    },
    {
      year: '2020',
      title: 'Conservation Focus',
      description: 'Shifted focus to conservation photography and education',
      icon: '🌿'
    },
    {
      year: '2022',
      title: 'International Recognition',
      description: 'Featured in wildlife photography magazines worldwide',
      icon: '🏆'
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-green-900/20 dark:via-blue-900/20 dark:to-purple-900/20">
      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 right-20 w-32 h-32 bg-green-200/30 dark:bg-green-400/10 rounded-full blur-xl" />
        <div className="absolute bottom-20 left-20 w-40 h-40 bg-blue-200/30 dark:bg-blue-400/10 rounded-full blur-xl" />
        <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-purple-200/30 dark:bg-purple-400/10 rounded-full blur-xl" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-16 lg:py-24 relative">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Hero Section */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <UserIcon className="w-4 h-4" />
              Wildlife Photographer & Guide
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              About
              <span className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent ml-3">
                Suban Chaudhary
              </span>
            </h1>
            
            <div className="w-24 h-1 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 mx-auto mb-8" />
            
            {/* Profile Photo Section */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="relative w-48 h-48 lg:w-64 lg:h-64 mx-auto"
                >
                  {/* Photo Container */}
                  <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl">
                    <img
                      src="https://scontent.fdhi1-1.fna.fbcdn.net/v/t39.30808-6/448305682_3681958892056745_7776095021062696434_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeGqW2v74mN8knp2Pke0HLNxCAyQFLw9gVoIDJAUvD2BWpzj50qUQL4b8tZlwSdCJ-YJR7IPBX0Dw0R3EGaNBTxJ&_nc_ohc=Sc-vI_fSmWYQ7kNvwGFhbHL&_nc_oc=AdkTawtLrjc9LfD_ajMM-CPg8PAgJMCGayNWQ53nK0psK9Vn_P192-uJWNQIdFdDlxE&_nc_zt=23&_nc_ht=scontent.fdhi1-1.fna&_nc_gid=Piwy6aankDgrhI7iB4LryQ&oh=00_AfVbz4jNcc2Y0wMP88WPN85sl7tBfbgCK9NSxEUFFyQoeg&oe=68965C48"
                      alt="Suban Chaudhary - Wildlife Photographer"
                      className="w-full h-full object-cover"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                  </div>
                  
                  {/* Decorative border with gradient */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 rounded-2xl opacity-75 blur-sm -z-10" />
                  
                  {/* Floating elements */}
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                    className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg"
                  >
                    <CameraIcon className="w-4 h-4 text-white" />
                  </motion.div>
                  
                  <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 1 }}
                    className="absolute -bottom-4 -left-4 w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg"
                  >
                    <HeartIcon className="w-4 h-4 text-white" />
                  </motion.div>
                </motion.div>
                
                {/* Caption */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className="text-center mt-4"
                >
                  <p className="text-gray-600 dark:text-gray-300 italic text-sm">
                    "Capturing the soul of Nepal's wilderness"
                  </p>
                </motion.div>
              </div>
            </div>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              A passionate wildlife photographer and nature guide based in the scenic landscapes of Nepal, 
              dedicated to capturing the essence of wild beauty and promoting conservation through visual storytelling.
            </p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700"
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r ${stat.color} text-white rounded-full mb-4`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}>
                  {stat.value}
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Story */}
            <motion.div variants={itemVariants} className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                  <HeartIcon className="w-7 h-7 text-red-500" />
                  My Story
                </h2>
                <div className="space-y-4 text-gray-600 dark:text-gray-300 leading-relaxed">
                  <p>
                    My journey into wildlife photography began in the heart of Nepal's wilderness, 
                    where I discovered my deep connection with nature and its incredible inhabitants. 
                    With over 8 years of experience, I have dedicated my life to documenting the 
                    rich biodiversity of Nepal's national parks and conservation areas.
                  </p>
                  <p>
                    Through my lens, I aim to bridge the gap between wildlife and people, 
                    showcasing the beauty and importance of conservation. Each photograph tells 
                    a story of survival, beauty, and the urgent need to protect our natural heritage.
                  </p>
                  <p>
                    When I'm not behind the camera, I guide fellow nature enthusiasts through 
                    Nepal's diverse ecosystems, sharing knowledge about wildlife behavior, 
                    conservation efforts, and the intricate balance of our natural world.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Skills */}
            <motion.div variants={itemVariants} className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                <StarIcon className="w-7 h-7 text-yellow-500" />
                Expertise & Skills
              </h2>
              {skills.map((skill, index) => (
                <motion.div
                  key={skill.title}
                  whileHover={{ x: 5 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-start gap-4">
                    <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-full flex-shrink-0">
                      <skill.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {skill.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        {skill.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Journey Timeline */}
          <motion.div variants={itemVariants}>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12 flex items-center justify-center gap-3">
              <CalendarIcon className="w-8 h-8 text-blue-500" />
              My Photography Journey
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {journey.map((milestone, index) => (
                <motion.div
                  key={milestone.year}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 text-center"
                >
                  <div className="text-4xl mb-4">{milestone.icon}</div>
                  <div className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
                    {milestone.year}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    {milestone.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {milestone.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutPage;
