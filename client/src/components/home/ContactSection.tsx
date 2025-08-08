import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon,
  ChatBubbleLeftRightIcon,
  ArrowRightIcon,
  PaperAirplaneIcon
} from '@heroicons/react/24/outline';
import { APP_CONFIG } from '../../constants';

const ContactSection: React.FC = () => {
  const contactMethods = [
    {
      icon: EnvelopeIcon,
      title: 'Email Me',
      description: 'Drop me a line for inquiries, bookings, or just to say hello',
      value: APP_CONFIG.email,
      href: `mailto:${APP_CONFIG.email}`,
      color: 'from-red-500 to-pink-500',
      bgColor: 'bg-red-50 dark:bg-red-900/20'
    },
    {
      icon: PhoneIcon,
      title: 'Call Me',
      description: 'Ready to book a wildlife photography session?',
      value: APP_CONFIG.phone,
      href: `tel:${APP_CONFIG.phone}`,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20'
    },
    {
      icon: MapPinIcon,
      title: 'Visit Nepal',
      description: 'Join me for an unforgettable wildlife adventure',
      value: 'Nepal, Himalayas',
      href: '/join-us',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20'
    }
  ];

  const reasons = [
    {
      icon: '📷',
      title: 'Photography Sessions',
      description: 'Book personalized wildlife photography workshops and guided tours'
    },
    {
      icon: '🎓',
      title: 'Learn & Explore',
      description: 'Get expert tips on wildlife photography and conservation efforts'
    },
    {
      icon: '🌍',
      title: 'Conservation Support',
      description: 'Collaborate on wildlife conservation projects and awareness campaigns'
    },
    {
      icon: '🖼️',
      title: 'Print Purchases',
      description: 'Order high-quality prints of my wildlife photography collection'
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
    <section className="py-16 lg:py-24 bg-gradient-to-br from-cyan-50 via-sky-50 to-blue-50 dark:from-cyan-900/20 dark:via-sky-900/20 dark:to-blue-900/20 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 bg-cyan-200/30 dark:bg-cyan-400/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-sky-200/30 dark:bg-sky-400/10 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-blue-200/30 dark:bg-blue-400/10 rounded-full blur-xl"></div>
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
            <div className="inline-flex items-center gap-2 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <ChatBubbleLeftRightIcon className="w-4 h-4" />
              Get in Touch
            </div>
            
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Let's Connect & Create
            </h2>
            
            <div className="w-20 h-1 bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-500 mx-auto mb-6" />
            
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Ready to embark on a wildlife adventure? Have questions about photography? 
              Want to support conservation efforts? I'd love to hear from you!
            </p>
          </motion.div>

          {/* Contact Methods Grid */}
          <motion.div 
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
          >
            {contactMethods.map((method, index) => (
              <motion.div
                key={method.title}
                whileHover={{ scale: 1.05, y: -5 }}
                className={`${method.bgColor} rounded-2xl p-8 text-center group hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700`}
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${method.color} text-white rounded-full mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <method.icon className="w-8 h-8" />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {method.title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {method.description}
                </p>
                
                <Link
                  to={method.href}
                  className={`inline-flex items-center gap-2 bg-gradient-to-r ${method.color} text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 group-hover:scale-105`}
                >
                  {method.value}
                  <ArrowRightIcon className="w-4 h-4" />
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* Why Contact Me Section */}
          <motion.div variants={itemVariants} className="mb-16">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-12">
              Why Get in Touch?
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {reasons.map((reason, index) => (
                <motion.div
                  key={reason.title}
                  whileHover={{ y: -5 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700"
                >
                  <div className="text-4xl mb-4">{reason.icon}</div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {reason.title}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {reason.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div 
            variants={itemVariants}
            className="text-center"
          >
            <div className="bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-700 dark:to-blue-700 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Ready to Start Your Adventure?</h3>
              <p className="text-cyan-100 mb-6 max-w-2xl mx-auto">
                Whether you're planning a photography expedition, looking for prints, 
                or just want to chat about wildlife conservation, I'm here to help!
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  to="/contact"
                  className="group inline-flex items-center gap-2 bg-white text-cyan-600 hover:bg-gray-50 px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <PaperAirplaneIcon className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                  Send Message
                </Link>
                
                <Link
                  to="/join-us"
                  className="group inline-flex items-center gap-2 border-2 border-white text-white hover:bg-white hover:text-cyan-600 px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
                >
                  Join Adventure
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

export default ContactSection;
