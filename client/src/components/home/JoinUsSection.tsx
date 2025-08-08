import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  UserGroupIcon, 
  CalendarIcon, 
  StarIcon,
  MapIcon,
  ArrowRightIcon,
  BriefcaseIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';

const JoinUsSection: React.FC = () => {
  const expeditionTypes = [
    {
      icon: '🐅',
      title: 'Tiger Tracking',
      location: 'Chitwan National Park',
      duration: '3-5 days',
      difficulty: 'Moderate',
      description: 'Join us in Nepal\'s first national park to photograph majestic Bengal tigers',
      price: 'From $299',
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20'
    },
    {
      icon: '🏔️',
      title: 'Himalayan Wildlife',
      location: 'Everest Region',
      duration: '7-10 days',
      difficulty: 'Challenging',
      description: 'Capture snow leopards and Himalayan wildlife in their pristine habitat',
      price: 'From $699',
      color: 'from-blue-500 to-indigo-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      icon: '🦅',
      title: 'Bird Watching',
      location: 'Various Locations',
      duration: '2-3 days',
      difficulty: 'Easy',
      description: 'Photograph Nepal\'s incredible bird diversity with expert guidance',
      price: 'From $199',
      color: 'from-green-500 to-teal-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20'
    }
  ];

  const benefits = [
    {
      icon: AcademicCapIcon,
      title: 'Expert Guidance',
      description: 'Learn from 8+ years of wildlife photography experience'
    },
    {
      icon: UserGroupIcon,
      title: 'Small Groups',
      description: 'Maximum 6 participants for personalized attention'
    },
    {
      icon: BriefcaseIcon,
      title: 'All Equipment',
      description: 'Professional gear and equipment provided if needed'
    },
    {
      icon: StarIcon,
      title: 'Unique Access',
      description: 'Exclusive locations and wildlife encounters'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      location: 'Wildlife Photographer, USA',
      text: 'Suban\'s expertise and knowledge of Nepal\'s wildlife made this an unforgettable experience!',
      rating: 5
    },
    {
      name: 'David Chen',
      location: 'Nature Enthusiast, Singapore',
      text: 'The best photography workshop I\'ve ever attended. Incredible wildlife encounters!',
      rating: 5
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

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <StarIcon
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-amber-900/20 dark:via-orange-900/20 dark:to-red-900/20 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-20 w-32 h-32 bg-amber-200/30 dark:bg-amber-400/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 left-20 w-40 h-40 bg-orange-200/30 dark:bg-orange-400/10 rounded-full blur-xl"></div>
        <div className="absolute top-2/3 right-1/3 w-24 h-24 bg-red-200/30 dark:bg-red-400/10 rounded-full blur-xl"></div>
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
            <div className="inline-flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <UserGroupIcon className="w-4 h-4" />
              Wildlife Adventures
            </div>
            
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Join Our Wildlife Expeditions
            </h2>
            
            <div className="w-20 h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 mx-auto mb-6" />
            
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Embark on unforgettable wildlife photography adventures across Nepal's 
              diverse ecosystems with expert guidance and unique access to pristine locations.
            </p>
          </motion.div>

          {/* Expedition Types */}
          <motion.div 
            variants={itemVariants}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16"
          >
            {expeditionTypes.map((expedition, index) => (
              <motion.div
                key={expedition.title}
                whileHover={{ scale: 1.02, y: -5 }}
                className={`${expedition.bgColor} rounded-2xl p-8 group hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700`}
              >
                <div className="text-center mb-6">
                  <div className="text-6xl mb-4">{expedition.icon}</div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {expedition.title}
                  </h3>
                  <div className={`inline-flex items-center gap-2 bg-gradient-to-r ${expedition.color} text-white px-4 py-2 rounded-full text-sm font-medium`}>
                    <MapIcon className="w-4 h-4" />
                    {expedition.location}
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300 font-medium">Duration:</span>
                    <span className="text-gray-900 dark:text-white font-semibold">{expedition.duration}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300 font-medium">Difficulty:</span>
                    <span className="text-gray-900 dark:text-white font-semibold">{expedition.difficulty}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300 font-medium">Price:</span>
                    <span className={`bg-gradient-to-r ${expedition.color} bg-clip-text text-transparent font-bold text-lg`}>
                      {expedition.price}
                    </span>
                  </div>
                </div>

                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {expedition.description}
                </p>

                <Link
                  to="/join-us"
                  className={`w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r ${expedition.color} text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 group-hover:scale-105`}
                >
                  Book Now
                  <ArrowRightIcon className="w-4 h-4" />
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* Benefits Grid */}
          <motion.div variants={itemVariants} className="mb-16">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-12">
              Why Choose Our Expeditions?
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  whileHover={{ y: -5 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full mb-4">
                    <benefit.icon className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {benefit.title}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {benefit.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Testimonials */}
          <motion.div variants={itemVariants} className="mb-16">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-12">
              What Adventurers Say
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.name}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-center mb-4">
                    {renderStars(testimonial.rating)}
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 italic">
                    "{testimonial.text}"
                  </p>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {testimonial.location}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div 
            variants={itemVariants}
            className="text-center"
          >
            <div className="bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-700 dark:to-orange-700 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Ready for Your Wildlife Adventure?</h3>
              <p className="text-amber-100 mb-6 max-w-2xl mx-auto">
                Limited spots available for each expedition. Book now to secure your place 
                in Nepal's most incredible wildlife photography adventures!
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  to="/join-us"
                  className="group inline-flex items-center gap-2 bg-white text-amber-600 hover:bg-gray-50 px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <CalendarIcon className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                  Book Your Spot
                </Link>
                
                <Link
                  to="/contact"
                  className="group inline-flex items-center gap-2 border-2 border-white text-white hover:bg-white hover:text-amber-600 px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
                >
                  Ask Questions
                  <ArrowRightIcon className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default JoinUsSection;
