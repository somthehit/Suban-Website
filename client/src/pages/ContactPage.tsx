import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { contactMessageSchema, ContactMessageInput } from '../constants';
import toast from 'react-hot-toast';
import {
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  InboxIcon,
  PaperAirplaneIcon
} from '@heroicons/react/24/outline';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState<ContactMessageInput>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      const validatedData = contactMessageSchema.parse(formData);
      console.log('Contact form data:', validatedData);
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Message sent successfully!');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error: any) {
      if (error.errors) {
        setErrors(error.errors);
      } else {
        toast.error('Failed to send message. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-green-50 dark:from-blue-900/20 dark:via-cyan-900/20 dark:to-green-900/20">
      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 right-20 w-32 h-32 bg-blue-200/30 dark:bg-blue-400/10 rounded-full blur-xl" />
        <div className="absolute bottom-20 left-20 w-40 h-40 bg-cyan-200/30 dark:bg-cyan-400/10 rounded-full blur-xl" />
        <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-green-200/30 dark:bg-green-400/10 rounded-full blur-xl" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-16 lg:py-24 relative">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <EnvelopeIcon className="w-4 h-4" />
              Get in Touch
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Contact
              <span className="bg-gradient-to-r from-blue-600 via-cyan-600 to-green-600 bg-clip-text text-transparent ml-3">
                Me
              </span>
            </h1>
            
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-green-500 mx-auto mb-8" />
            
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Have a question about wildlife photography, want to book a nature guide session, 
              or interested in purchasing prints? I'd love to hear from you! Send a message using the form 
              below or reach out directly via email or phone.
            </p>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* Contact Form */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                  />
                  {errors.subject && (
                    <p className="text-red-500 text-sm mt-1">{errors.subject}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                  />
                  {errors.message && (
                    <p className="text-red-500 text-sm mt-1">{errors.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl w-full"
                >
                  <PaperAirplaneIcon className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="space-y-8"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold mb-6 flex items-center gap-3">
                  <InboxIcon className="w-6 h-6 text-blue-500" />
                  Contact Details
                </h3>
                <div className="space-y-4 text-gray-600 dark:text-gray-300">
                  <div className="flex items-start gap-3">
                    <EnvelopeIcon className="w-5 h-5 text-blue-500 mt-1" />
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Email</h4>
                      <p>contact@subanchaudhary.com</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <PhoneIcon className="w-5 h-5 text-blue-500 mt-1" />
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Phone</h4>
                      <p>+977-9876543210</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPinIcon className="w-5 h-5 text-blue-500 mt-1" />
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Location</h4>
                      <p>Nepal</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold mb-6 flex items-center gap-3">
                  <InboxIcon className="w-6 h-6 text-green-500" />
                  Response Time
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  I typically respond to messages within 24-48 hours. For urgent inquiries,
                  please call directly.
                </p>
              </div>
            </motion.div>

          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactPage;
