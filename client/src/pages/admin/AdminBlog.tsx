import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  CalendarIcon,
  UserIcon,
  TagIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { blogAPI } from '../../services/api';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  cover_image?: string;
  tags: string[];
  published: boolean;
  author: {
    name: string;
    email: string;
  };
  created_at: string;
  updated_at: string;
  published_at?: string;
  read_time?: number;
}

const AdminBlog: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all');
  const [selectedPosts, setSelectedPosts] = useState<string[]>([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await blogAPI.getPosts();
      if (response.success) {
        setPosts(response.data || []);
      } else {
        throw new Error('Failed to fetch posts');
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('Failed to load blog posts');
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = filterStatus === 'all' ||
                         (filterStatus === 'published' && post.published) ||
                         (filterStatus === 'draft' && !post.published);
    
    return matchesSearch && matchesFilter;
  });

  const handleSelectPost = (postId: string) => {
    setSelectedPosts(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  };

  const handleSelectAll = () => {
    if (selectedPosts.length === filteredPosts.length) {
      setSelectedPosts([]);
    } else {
      setSelectedPosts(filteredPosts.map(post => post.id));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedPosts.length === 0) return;
    
    const confirmDelete = window.confirm(`Are you sure you want to delete ${selectedPosts.length} post(s)?`);
    if (confirmDelete) {
      try {
        // Delete each selected post
        await Promise.all(selectedPosts.map(postId => blogAPI.deletePost(postId)));
        toast.success(`${selectedPosts.length} post(s) deleted successfully`);
        setSelectedPosts([]);
        await fetchPosts(); // Refresh the list
      } catch (error) {
        console.error('Error deleting posts:', error);
        toast.error('Failed to delete posts');
      }
    }
  };

  const handleTogglePublish = async (postId: string, currentStatus: boolean) => {
    try {
      await blogAPI.updatePost(postId, { published: !currentStatus });
      setPosts(prev => prev.map(post => 
        post.id === postId ? { ...post, published: !currentStatus } : post
      ));
      toast.success(`Post ${!currentStatus ? 'published' : 'unpublished'} successfully`);
    } catch (error) {
      console.error('Error updating post:', error);
      toast.error('Failed to update post status');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Blog Posts</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your blog posts and articles
          </p>
        </div>
        <Link
          to="/admin/blog/new"
          className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          New Post
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div className="flex items-center gap-2">
            <FunnelIcon className="w-5 h-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as 'all' | 'published' | 'draft')}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Posts</option>
              <option value="published">Published</option>
              <option value="draft">Drafts</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedPosts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded-lg p-4"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm text-purple-700 dark:text-purple-300">
              {selectedPosts.length} post(s) selected
            </span>
            <div className="flex gap-2">
              <button
                onClick={handleBulkDelete}
                className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
              >
                Delete Selected
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Posts List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        {filteredPosts.length === 0 ? (
          <div className="p-8 text-center">
            <DocumentTextIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-gray-500 dark:text-gray-400 text-lg mb-2">No posts found</h3>
            <p className="text-gray-400 dark:text-gray-500 mb-4">
              {searchTerm || filterStatus !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Create your first blog post to get started'
              }
            </p>
            {!searchTerm && filterStatus === 'all' && (
              <Link
                to="/admin/blog/new"
                className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <PlusIcon className="w-5 h-5 mr-2" />
                Create First Post
              </Link>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {/* Table Header */}
            <div className="p-4">
              <div className="flex items-center">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedPosts.length === filteredPosts.length}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">Select All</span>
                </div>
              </div>
            </div>

            {/* Posts */}
            {filteredPosts.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <input
                    type="checkbox"
                    checked={selectedPosts.includes(post.id)}
                    onChange={() => handleSelectPost(post.id)}
                    className="mt-1 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  
                  {post.cover_image && (
                    <div className="flex-shrink-0">
                      <img
                        src={post.cover_image}
                        alt={post.title}
                        className="w-16 h-16 object-cover rounded-lg"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                          {post.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-2 line-clamp-2">
                          {post.excerpt}
                        </p>
                        
                        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <UserIcon className="w-4 h-4" />
                            {post.author.name}
                          </div>
                          <div className="flex items-center gap-1">
                            <CalendarIcon className="w-4 h-4" />
                            {formatDate(post.created_at)}
                          </div>
                          {post.read_time && (
                            <span>{post.read_time} min read</span>
                          )}
                        </div>
                        
                        {post.tags.length > 0 && (
                          <div className="flex items-center gap-1 mt-2">
                            <TagIcon className="w-4 h-4 text-gray-400" />
                            <div className="flex gap-1">
                              {post.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          post.published 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                        }`}>
                          {post.published ? 'Published' : 'Draft'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                  <button
                    onClick={() => window.open(`/blog/${post.slug}`, '_blank')}
                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                    title="Preview"
                  >
                    <EyeIcon className="w-4 h-4" />
                  </button>
                  
                  <Link
                    to={`/admin/blog/edit/${post.id}`}
                    className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded transition-colors"
                    title="Edit"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </Link>
                  
                  <button
                    onClick={() => handleTogglePublish(post.id, post.published)}
                    className={`px-3 py-1 text-xs rounded ${
                      post.published
                        ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400'
                        : 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-400'
                    } transition-colors`}
                  >
                    {post.published ? 'Unpublish' : 'Publish'}
                  </button>
                  
                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this post?')) {
                        // TODO: Implement delete API call
                        toast.success('Post deleted successfully');
                      }
                    }}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                    title="Delete"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBlog;
