import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HeartIcon,
  ChatBubbleLeftEllipsisIcon,
  UserCircleIcon,
  CalendarIcon,
  ClockIcon,
  ShareIcon,
  BookmarkIcon
} from '@heroicons/react/24/outline';
import {
  HeartIcon as HeartIconSolid,
  BookmarkIcon as BookmarkIconSolid
} from '@heroicons/react/24/solid';

const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  
  // Mock user authentication state
  const [user, setUser] = useState<{ name: string; avatar: string } | null>(null);
  const [likes, setLikes] = useState(156);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [comments, setComments] = useState([
    {
      id: 1,
      author: 'Rajesh Thapa',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80',
      comment: 'Amazing photos! The way you captured the tiger in its natural habitat is breathtaking.',
      timestamp: '2 hours ago',
      likes: 12
    },
    {
      id: 2,
      author: 'Sita Maharjan',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b784?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80',
      comment: 'This is exactly why conservation efforts are so important. Thank you for sharing this story.',
      timestamp: '5 hours ago',
      likes: 8
    }
  ]);
  const [newComment, setNewComment] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleLike = () => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
  };

  const handleBookmark = () => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    setIsBookmarked(!isBookmarked);
  };

  const handleComment = () => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    if (newComment.trim()) {
      const comment = {
        id: comments.length + 1,
        author: user.name,
        avatar: user.avatar,
        comment: newComment,
        timestamp: 'Just now',
        likes: 0
      };
      setComments([comment, ...comments]);
      setNewComment('');
    }
  };

  const handleLogin = () => {
    // Mock login - in real app, this would integrate with your auth system
    setUser({
      name: 'John Doe',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80'
    });
    setShowLoginModal(false);
  };

  const blogPost = {
    title: "Conservation Photography: Capturing Nepal's Endangered Tiger",
    content: `
      <p>Deep in the heart of Chitwan National Park, I embarked on a journey that would forever change my perspective on wildlife conservation. The morning mist hung low over the grasslands as our silent footsteps carried us deeper into tiger territory.</p>
      
      <p>After three days of patient waiting, we finally encountered a magnificent Bengal tiger. The moment was both thrilling and humbling - this apex predator, moving with such grace and power, represents hope for Nepal's conservation efforts.</p>
      
      <blockquote>
        "In every walk with nature, one receives far more than they seek. But in photographing wildlife, we become storytellers for those who cannot speak for themselves."
      </blockquote>
      
      <p>This particular tiger, known locally as "Bagh Raja" (Tiger King), has become a symbol of successful conservation in the region. Through community-based conservation programs, local villagers have transformed from potential threats to the tiger's greatest protectors.</p>
      
      <p>The photograph you see was taken during the golden hour, when the light filtered through the sal forest canopy, creating natural spotlights that illuminated the tiger's magnificent stripes. Using a 600mm lens from a respectful distance, I was able to capture this intimate moment without disturbing the animal's natural behavior.</p>
      
      <p>What strikes me most about this encounter is not just the beauty of the moment, but what it represents - a success story in conservation. Nepal's tiger population has doubled in the last decade, a testament to the power of dedicated conservation efforts and community involvement.</p>
    `,
    author: 'Suban Chaudhary',
    publishDate: 'December 15, 2024',
    readTime: '8 min read',
    category: 'Conservation',
    tags: ['Photography', 'Tigers', 'Nepal', 'Conservation', 'Wildlife'],
    featuredImage: 'https://images.unsplash.com/photo-1549366021-9f761d040a94?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80'
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Image */}
      <div className="relative h-96 lg:h-[500px] overflow-hidden">
        <img
          src={blogPost.featuredImage}
          alt={blogPost.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute bottom-8 left-8 right-8 text-white">
          <div className="max-w-4xl mx-auto">
            <span className="inline-block px-3 py-1 bg-emerald-600 rounded-full text-sm font-medium mb-4">
              {blogPost.category}
            </span>
            <h1 className="text-3xl lg:text-5xl font-bold mb-4">{blogPost.title}</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-8 lg:py-12">
        <div className="max-w-4xl mx-auto">
          {/* Article Meta */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap items-center gap-6 mb-8 text-gray-600 dark:text-gray-400"
          >
            <div className="flex items-center gap-2">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80"
                alt={blogPost.author}
                className="w-10 h-10 rounded-full object-cover"
              />
              <span className="font-medium">{blogPost.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5" />
              <span>{blogPost.publishDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <ClockIcon className="w-5 h-5" />
              <span>{blogPost.readTime}</span>
            </div>
          </motion.div>

          {/* Article Content */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="prose prose-lg dark:prose-invert max-w-none mb-12"
            dangerouslySetInnerHTML={{ __html: blogPost.content }}
          />

          {/* Tags */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-2 mb-8"
          >
            {blogPost.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
              >
                #{tag}
              </span>
            ))}
          </motion.div>

          {/* Interaction Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-between border-t border-b border-gray-200 dark:border-gray-700 py-6 mb-8"
          >
            <div className="flex items-center gap-6">
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 transition-colors ${
                  isLiked
                    ? 'text-red-500'
                    : 'text-gray-600 dark:text-gray-400 hover:text-red-500'
                }`}
              >
                {isLiked ? (
                  <HeartIconSolid className="w-6 h-6" />
                ) : (
                  <HeartIcon className="w-6 h-6" />
                )}
                <span className="font-medium">{likes}</span>
              </button>

              <button
                onClick={() => !user && setShowLoginModal(true)}
                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors"
              >
                <ChatBubbleLeftEllipsisIcon className="w-6 h-6" />
                <span className="font-medium">{comments.length}</span>
              </button>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={handleBookmark}
                className={`transition-colors ${
                  isBookmarked
                    ? 'text-emerald-500'
                    : 'text-gray-600 dark:text-gray-400 hover:text-emerald-500'
                }`}
              >
                {isBookmarked ? (
                  <BookmarkIconSolid className="w-6 h-6" />
                ) : (
                  <BookmarkIcon className="w-6 h-6" />
                )}
              </button>
              <button className="text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors">
                <ShareIcon className="w-6 h-6" />
              </button>
            </div>
          </motion.div>

          {/* Comments Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-8"
          >
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              Comments ({comments.length})
            </h3>

            {/* Comment Form */}
            {user ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex gap-4">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="flex-1">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Share your thoughts..."
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      rows={3}
                    />
                    <div className="flex justify-end mt-3">
                      <button
                        onClick={handleComment}
                        disabled={!newComment.trim()}
                        className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Post Comment
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 text-center border border-gray-200 dark:border-gray-700">
                <UserCircleIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Join the conversation
                </h4>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Sign in to share your thoughts and connect with other wildlife enthusiasts
                </p>
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Sign In to Comment
                </button>
              </div>
            )}

            {/* Comments List */}
            <div className="space-y-6">
              {comments.map((comment) => (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex gap-4">
                    <img
                      src={comment.avatar}
                      alt={comment.author}
                      className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {comment.author}
                        </span>
                        <span className="text-gray-500 dark:text-gray-400 text-sm">
                          {comment.timestamp}
                        </span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 mb-3">
                        {comment.comment}
                      </p>
                      <div className="flex items-center gap-4">
                        <button className="flex items-center gap-1 text-gray-500 hover:text-red-500 transition-colors">
                          <HeartIcon className="w-4 h-4" />
                          <span className="text-sm">{comment.likes}</span>
                        </button>
                        <button className="text-gray-500 hover:text-blue-500 transition-colors text-sm">
                          Reply
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-md w-full"
          >
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Sign In Required
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              You need to be signed in to like posts and leave comments. Join our community of wildlife enthusiasts!
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleLogin}
                className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => setShowLoginModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default BlogPostPage;
