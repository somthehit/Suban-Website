import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeftIcon,
  PhotoIcon,
  EyeIcon,
  DocumentTextIcon,
  TagIcon,
  CalendarIcon,
  GlobeAltIcon,
  LockClosedIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import RichTextEditor from '../../components/editor/RichTextEditor';

interface BlogFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string;
  tags: string[];
  published: boolean;
  meta_title: string;
  meta_description: string;
}

const AdminBlogEditor: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [formData, setFormData] = useState<BlogFormData>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    cover_image: '',
    tags: [],
    published: false,
    meta_title: '',
    meta_description: ''
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    if (isEditing) {
      // TODO: Fetch blog post data by ID
      setLoading(true);
      // Mock data for demonstration
      setTimeout(() => {
        setFormData({
          title: 'Wildlife Photography Tips for Beginners',
          slug: 'wildlife-photography-tips-beginners',
          excerpt: 'Learn the essential techniques for capturing stunning wildlife photographs...',
          content: `# Wildlife Photography Tips for Beginners

Wildlife photography is one of the most challenging yet rewarding forms of photography. Whether you're photographing birds in your backyard or tracking big game on safari, these essential tips will help you capture stunning images.

## 1. Know Your Subject

Before heading out with your camera, spend time learning about the animals you want to photograph. Understanding their behavior, feeding patterns, and habitat preferences will significantly increase your chances of getting great shots.

## 2. Use the Right Equipment

### Camera Settings
- **Shutter Priority Mode**: Use this mode to ensure you can freeze motion
- **Fast Shutter Speed**: Generally 1/500s or faster for moving subjects
- **Continuous AF**: Keep your subject in focus as it moves

### Essential Gear
- Telephoto lens (300mm or longer)
- Tripod or monopod for stability
- Extra batteries and memory cards

## 3. Practice Patience

Wildlife photography requires incredible patience. Animals don't pose on command, and the perfect shot might take hours or even days to capture.

## 4. Respect Wildlife

Always maintain a safe distance from wild animals. Use a telephoto lens to get close-up shots without disturbing the wildlife or putting yourself in danger.

## Conclusion

With practice, patience, and the right techniques, you'll be capturing amazing wildlife photographs in no time. Remember, every expert was once a beginner!`,
          cover_image: '/images/blog/wildlife-tips.jpg',
          tags: ['photography', 'wildlife', 'tips', 'beginners'],
          published: true,
          meta_title: 'Wildlife Photography Tips for Beginners | Suban Photography',
          meta_description: 'Learn essential wildlife photography techniques with our comprehensive guide for beginners. Master camera settings, equipment, and field techniques.'
        });
        setLoading(false);
      }, 1000);
    }
  }, [id, isEditing]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Auto-generate slug from title
    if (name === 'title') {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setFormData(prev => ({ ...prev, slug }));
    }
  };

  const handleTagAdd = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const tag = tagInput.trim().toLowerCase();
      if (tag && !formData.tags.includes(tag)) {
        setFormData(prev => ({ ...prev, tags: [...prev.tags, tag] }));
      }
      setTagInput('');
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSave = async (publish: boolean = false) => {
    setSaving(true);
    
    try {
      const dataToSave = { ...formData, published: publish };
      
      // TODO: Implement API call to save/update blog post
      console.log('Saving blog post:', dataToSave);
      
      await new Promise(resolve => setTimeout(resolve, 1500)); // Mock API delay
      
      toast.success(`Blog post ${publish ? 'published' : 'saved as draft'} successfully!`);
      
      if (!isEditing) {
        navigate('/admin/blog');
      }
    } catch (error) {
      toast.error('Failed to save blog post');
    } finally {
      setSaving(false);
    }
  };

  const renderPreview = () => {
    return (
      <div className="prose prose-lg max-w-none dark:prose-invert">
        {formData.cover_image && (
          <img 
            src={formData.cover_image} 
            alt={formData.title}
            className="w-full h-64 object-cover rounded-lg mb-6"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        )}
        <h1>{formData.title || 'Untitled Post'}</h1>
        {formData.excerpt && (
          <p className="text-xl text-gray-600 dark:text-gray-300 italic border-l-4 border-gray-300 pl-4 my-6">
            {formData.excerpt}
          </p>
        )}
        <div dangerouslySetInnerHTML={{ 
          __html: formData.content || '<p>Start writing your content...</p>'
        }} />
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Medium-style Header */}
      <div className="flex items-center justify-between py-4 border-b border-gray-200 mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/blog')}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isEditing ? 'Edit Post' : 'Create New Post'}
          </h1>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              previewMode
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            <EyeIcon className="w-5 h-5 mr-2 inline" />
            {previewMode ? 'Edit' : 'Preview'}
          </button>
          
          <button
            onClick={() => handleSave(false)}
            disabled={saving}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? 'Saving...' : 'Save Draft'}
          </button>
          
          <button
            onClick={() => handleSave(true)}
            disabled={saving}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? 'Publishing...' : 'Publish'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {previewMode ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              {renderPreview()}
            </div>
          ) : (
            <>
              {/* Title and Slug */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Enter post title..."
                      className="w-full px-4 py-3 text-lg border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Slug
                    </label>
                    <input
                      type="text"
                      name="slug"
                      value={formData.slug}
                      onChange={handleInputChange}
                      placeholder="post-url-slug"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      URL: /blog/{formData.slug || 'post-slug'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Excerpt
                    </label>
                    <textarea
                      name="excerpt"
                      value={formData.excerpt}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="Brief description of the post..."
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Content *
                    </label>
                    <RichTextEditor
                      content={formData.content}
                      onChange={(content) => setFormData(prev => ({ ...prev, content }))}
                      placeholder="Start writing your story..."
                      className="min-h-[600px]"
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Publish Status */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              {formData.published ? (
                <GlobeAltIcon className="w-5 h-5 mr-2 text-green-500" />
              ) : (
                <LockClosedIcon className="w-5 h-5 mr-2 text-yellow-500" />
              )}
              Status
            </h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="draft"
                  name="published"
                  checked={!formData.published}
                  onChange={() => setFormData(prev => ({ ...prev, published: false }))}
                  className="text-purple-600 focus:ring-purple-500"
                />
                <label htmlFor="draft" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Draft
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="published"
                  name="published"
                  checked={formData.published}
                  onChange={() => setFormData(prev => ({ ...prev, published: true }))}
                  className="text-purple-600 focus:ring-purple-500"
                />
                <label htmlFor="published" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Published
                </label>
              </div>
            </div>
          </div>

          {/* Cover Image */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <PhotoIcon className="w-5 h-5 mr-2" />
              Cover Image
            </h3>
            <div className="space-y-3">
              <input
                type="url"
                name="cover_image"
                value={formData.cover_image}
                onChange={handleInputChange}
                placeholder="https://example.com/image.jpg"
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              {formData.cover_image && (
                <img
                  src={formData.cover_image}
                  alt="Cover preview"
                  className="w-full h-32 object-cover rounded-lg"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              )}
            </div>
          </div>

          {/* Tags */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <TagIcon className="w-5 h-5 mr-2" />
              Tags
            </h3>
            <div className="space-y-3">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagAdd}
                placeholder="Add tags (press Enter or comma)"
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400 text-xs rounded-full"
                  >
                    {tag}
                    <button
                      onClick={() => handleTagRemove(tag)}
                      className="ml-1 text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* SEO */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              SEO Settings
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Meta Title
                </label>
                <input
                  type="text"
                  name="meta_title"
                  value={formData.meta_title}
                  onChange={handleInputChange}
                  placeholder="SEO title (60 characters max)"
                  maxLength={60}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.meta_title.length}/60 characters
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Meta Description
                </label>
                <textarea
                  name="meta_description"
                  value={formData.meta_description}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="SEO description (160 characters max)"
                  maxLength={160}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.meta_description.length}/160 characters
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBlogEditor;
