import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  DocumentTextIcon, 
  ClockIcon, 
  TagIcon,
  ArrowRightIcon,
  BookOpenIcon
} from '@heroicons/react/24/outline';
import { blogAPI } from '../../services/api';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  cover_image?: string;
  tags: string[];
  published_at: string;
  read_time?: number;
  category?: string;
}

const BlogSection: React.FC = () => {
  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedPosts = async () => {
      try {
        setLoading(true);
        const response = await blogAPI.getPosts({ 
          published: true, 
          limit: 3 
        });
        setFeaturedPosts(response.data || []);
      } catch (err) {
        console.error('Error fetching featured posts:', err);
        setError('Failed to load blog posts');
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedPosts();
  }, []);

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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Wildlife Photography':
        return 'bg-emerald-500';
      case 'Conservation':
        return 'bg-blue-500';
      case 'Photography Tips':
        return 'bg-amber-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-blue-50 via-indigo-50 to-teal-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-teal-900/20 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-10 w-32 h-32 bg-blue-200/30 dark:bg-blue-400/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 left-10 w-40 h-40 bg-indigo-200/30 dark:bg-indigo-400/10 rounded-full blur-xl"></div>
        <div className="absolute top-1/3 right-1/3 w-24 h-24 bg-teal-200/30 dark:bg-teal-400/10 rounded-full blur-xl"></div>
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
            <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <DocumentTextIcon className="w-4 h-4" />
              Wildlife Stories
            </div>
            
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Tales from the Wild
            </h2>
            
            <div className="w-20 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-teal-500 mx-auto mb-6" />
            
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Read about exciting wildlife encounters, conservation efforts, and photography 
              tips from my adventures across Nepal's incredible landscapes.
            </p>
          </motion.div>

          {/* Loading State */}
          {loading && (
            <motion.div 
              variants={itemVariants}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12"
            >
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                  <div className="h-48 bg-gray-200 dark:bg-gray-700 animate-pulse" />
                  <div className="p-6 space-y-3">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
                    <div className="h-16 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* Error State */}
          {error && (
            <motion.div variants={itemVariants} className="text-center py-12">
              <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Try again
              </button>
            </motion.div>
          )}

          {/* Featured Posts Grid */}
          {!loading && !error && (
            <motion.div 
              variants={itemVariants}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12"
            >
              {featuredPosts.length > 0 ? (
                featuredPosts.map((post, index) => (
                  <motion.article
                    key={post.id}
                    whileHover={{ y: -10 }}
                    className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300"
                  >
                    {/* Post Image */}
                    <div className="relative overflow-hidden h-48">
                      <img
                        src={post.cover_image || '/images/placeholder-blog.jpg'}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => {
                          e.currentTarget.src = '/images/placeholder-blog.jpg';
                        }}
                      />
                      
                      {/* Category Badge */}
                      {post.category && (
                        <div className="absolute top-4 left-4">
                          <span className={`${getCategoryColor(post.category)} text-white px-3 py-1 rounded-full text-xs font-medium`}>
                            {post.category}
                          </span>
                        </div>
                      )}
                      
                      {/* Read Time */}
                      {post.read_time && (
                        <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                          <ClockIcon className="w-3 h-3" />
                          {post.read_time} min read
                        </div>
                      )}
                    </div>

                    {/* Post Content */}
                    <div className="p-6">
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                        <span>{new Date(post.published_at).toLocaleDateString()}</span>
                      </div>
                      
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                        {post.title}
                      </h3>
                      
                      <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                      
                      {/* Tags */}
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.tags.slice(0, 2).map((tag) => (
                            <div key={tag} className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full text-xs text-gray-600 dark:text-gray-300">
                              <TagIcon className="w-3 h-3" />
                              {tag}
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {/* Read More Link */}
                      <Link
                        to={`/blog/${post.slug}`}
                        className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm group-hover:gap-3 transition-all duration-300"
                      >
                        Read Full Story
                        <ArrowRightIcon className="w-4 h-4" />
                      </Link>
                    </div>
                  </motion.article>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <DocumentTextIcon className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
                    No blog posts yet
                  </h3>
                  <p className="text-gray-500 dark:text-gray-500">
                    Check back soon for exciting wildlife stories and photography tips!
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {/* CTA Section */}
          <motion.div 
            variants={itemVariants}
            className="text-center"
          >
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Stay Updated with My Adventures</h3>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                Subscribe to get notified about new wildlife stories, photography tips, 
                and conservation updates from the field.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  to="/blog"
                  className="group inline-flex items-center gap-2 bg-white text-blue-600 hover:bg-gray-50 px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <BookOpenIcon className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                  Read All Stories
                </Link>
                
                <Link
                  to="/contact"
                  className="group inline-flex items-center gap-2 border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
                >
                  Subscribe to Updates
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

export default BlogSection;
