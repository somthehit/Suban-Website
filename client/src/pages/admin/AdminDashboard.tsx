import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ChartBarIcon, 
  UserGroupIcon, 
  PhotoIcon, 
  DocumentTextIcon,
  CogIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { APP_CONFIG } from '../../constants';
import toast from 'react-hot-toast';
import AdminHeader from '../../components/admin/AdminHeader';
import { dashboardAPI, settingsAPI } from '../../services/api';

interface DashboardSettings {
  welcomeMessage: string;
  mainTitle: string;
  subtitle: string;
  quickStatsEnabled: boolean;
  recentActivityEnabled: boolean;
  customSections: {
    id: string;
    title: string;
    content: string;
    enabled: boolean;
    order: number;
  }[];
}

interface Stats {
  gallery: {
    total: number;
    featured: number;
  };
  blog: {
    total: number;
    published: number;
  };
  messages: {
    total: number;
    unread: number;
  };
  joinRequests: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
}

const defaultSettings: DashboardSettings = {
  welcomeMessage: `Welcome to ${APP_CONFIG.name} Admin Dashboard`,
  mainTitle: 'Wildlife Photography Admin',
  subtitle: 'Manage your content, gallery, and site settings',
  quickStatsEnabled: true,
  recentActivityEnabled: true,
  customSections: [
    {
      id: '1',
      title: 'Quick Actions',
      content: 'Access frequently used admin functions',
      enabled: true,
      order: 1
    },
    {
      id: '2',
      title: 'Content Overview',
      content: 'Monitor your site content at a glance',
      enabled: true,
      order: 2
    }
  ]
};

const AdminDashboard: React.FC = () => {
  const [settings, setSettings] = useState<DashboardSettings>(defaultSettings);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingSection, setEditingSection] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Try to fetch custom settings from database first
      await fetchCustomSettings();
      await fetchStats();
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Fallback to default settings
      setSettings(defaultSettings);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomSettings = async () => {
    try {
      const response = await settingsAPI.getSettings();
      const dashboardSettingsItem = response.data?.find((setting: any) => setting.key === 'dashboard_settings');
      
      if (dashboardSettingsItem?.value) {
        const customSettings = JSON.parse(dashboardSettingsItem.value);
        setSettings({ ...defaultSettings, ...customSettings });
      } else {
        setSettings(defaultSettings);
      }
    } catch (error) {
      console.error('Error fetching custom settings:', error);
      setSettings(defaultSettings);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await dashboardAPI.getStats();
      if (response.success) {
        setStats(response.data);
      } else {
        throw new Error('Failed to fetch stats');
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      setStats({
        gallery: { total: 0, featured: 0 },
        blog: { total: 0, published: 0 },
        messages: { total: 0, unread: 0 },
        joinRequests: { total: 0, pending: 0, approved: 0, rejected: 0 }
      });
    }
  };

  const saveSettings = async () => {
    try {
      await settingsAPI.updateSetting(
        'dashboard_settings',
        JSON.stringify(settings),
        'json',
        'Admin dashboard customization settings'
      );
      
      toast.success('Dashboard settings saved!');
      setIsEditing(false);
      setEditingSection(null);
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    }
  };

  const addCustomSection = () => {
    const newSection = {
      id: Date.now().toString(),
      title: 'New Section',
      content: 'Enter your content here',
      enabled: true,
      order: settings.customSections.length + 1
    };

    setSettings(prev => ({
      ...prev,
      customSections: [...prev.customSections, newSection]
    }));
    setEditingSection(newSection.id);
  };

  const updateSection = (sectionId: string, updates: Partial<typeof settings.customSections[0]>) => {
    setSettings(prev => ({
      ...prev,
      customSections: prev.customSections.map(section =>
        section.id === sectionId ? { ...section, ...updates } : section
      )
    }));
  };

  const deleteSection = (sectionId: string) => {
    setSettings(prev => ({
      ...prev,
      customSections: prev.customSections.filter(section => section.id !== sectionId)
    }));
  };

  const quickActions = [
    { icon: PhotoIcon, label: 'Add Image', href: '/admin/gallery/new', color: 'bg-blue-500' },
    { icon: PlusIcon, label: 'Manage Tourism', href: '/admin/tourism', color: 'bg-yellow-500' },
    { icon: DocumentTextIcon, label: 'New Post', href: '/admin/blog/new', color: 'bg-green-500' },
    { icon: CogIcon, label: 'Settings', href: '/admin/settings', color: 'bg-purple-500' },
    { icon: EyeIcon, label: 'View Site', href: '/', color: 'bg-orange-500' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminHeader />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-between items-start">
            <div>
              {isEditing ? (
                <input
                  type="text"
                  value={settings.mainTitle}
                  onChange={(e) => setSettings(prev => ({ ...prev, mainTitle: e.target.value }))}
                  className="text-3xl font-bold text-gray-900 dark:text-white bg-transparent border-b-2 border-purple-500 focus:outline-none"
                />
              ) : (
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {settings.mainTitle}
                </h1>
              )}
              
              {isEditing ? (
                <input
                  type="text"
                  value={settings.subtitle}
                  onChange={(e) => setSettings(prev => ({ ...prev, subtitle: e.target.value }))}
                  className="text-gray-600 dark:text-gray-400 bg-transparent border-b border-gray-300 focus:outline-none mt-2"
                />
              ) : (
                <p className="text-gray-600 dark:text-gray-400 mt-2">{settings.subtitle}</p>
              )}
            </div>
            
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <button
                    onClick={saveSettings}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditingSection(null);
                      fetchCustomSettings(); // Reset to saved settings
                    }}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <PencilIcon className="w-4 h-4 inline mr-2" />
                  Customize Dashboard
                </button>
              )}
            </div>
            
          </div>
        </motion.div>

        {/* Welcome Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 text-white mb-8"
        >
          {isEditing ? (
            <textarea
              value={settings.welcomeMessage}
              onChange={(e) => setSettings(prev => ({ ...prev, welcomeMessage: e.target.value }))}
              className="w-full text-lg bg-transparent border border-white/30 rounded-lg p-3 text-white placeholder-white/70 resize-none"
              rows={2}
            />
          ) : (
            <h2 className="text-xl font-semibold">{settings.welcomeMessage}</h2>
          )}
        </motion.div>

        {/* Quick Stats */}
        {settings.quickStatsEnabled && stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <PhotoIcon className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Gallery Images</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {stats.gallery.total}
                  </p>
                  <p className="text-xs text-gray-500">{stats.gallery.featured} featured</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <DocumentTextIcon className="h-8 w-8 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Blog Posts</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {stats.blog.total}
                  </p>
                  <p className="text-xs text-gray-500">{stats.blog.published} published</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <UserGroupIcon className="h-8 w-8 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Messages</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {stats.messages.total}
                  </p>
                  <p className="text-xs text-gray-500">{stats.messages.unread} unread</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ChartBarIcon className="h-8 w-8 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Activity</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">Live</p>
                  <p className="text-xs text-gray-500">
                    <ClockIcon className="w-3 h-3 inline mr-1" />
                    Updated now
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm mb-8"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <motion.a
                key={action.label}
                href={action.href}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex flex-col items-center p-4 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 transition-colors"
              >
                <div className={`${action.color} p-3 rounded-full text-white mb-2`}>
                  <action.icon className="w-6 h-6" />
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {action.label}
                </span>
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Custom Sections */}
        <div className="space-y-6">
          {settings.customSections
            .sort((a, b) => a.order - b.order)
            .filter(section => section.enabled || isEditing)
            .map((section, index) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className={`bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm ${!section.enabled && isEditing ? 'opacity-50' : ''}`}
            >
              <div className="flex justify-between items-start mb-4">
                {editingSection === section.id ? (
                  <input
                    type="text"
                    value={section.title}
                    onChange={(e) => updateSection(section.id, { title: e.target.value })}
                    className="text-lg font-semibold bg-transparent border-b-2 border-purple-500 focus:outline-none flex-1 mr-4"
                  />
                ) : (
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {section.title}
                  </h3>
                )}
                
                {isEditing && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateSection(section.id, { enabled: !section.enabled })}
                      className={`p-2 rounded-lg ${section.enabled ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}
                    >
                      {section.enabled ? <CheckCircleIcon className="w-4 h-4" /> : <XCircleIcon className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => setEditingSection(editingSection === section.id ? null : section.id)}
                      className="p-2 bg-purple-100 text-purple-600 rounded-lg"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteSection(section.id)}
                      className="p-2 bg-red-100 text-red-600 rounded-lg"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
              
              {editingSection === section.id ? (
                <textarea
                  value={section.content}
                  onChange={(e) => updateSection(section.id, { content: e.target.value })}
                  className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-3 text-gray-900 dark:text-white resize-none"
                  rows={3}
                />
              ) : (
                <p className="text-gray-600 dark:text-gray-400">{section.content}</p>
              )}
            </motion.div>
          ))}

          {/* Add Section Button */}
          {isEditing && (
            <motion.button
              onClick={addCustomSection}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-gray-600 dark:text-gray-400 hover:border-purple-400 hover:text-purple-600 transition-colors"
            >
              <PlusIcon className="w-8 h-8 mx-auto mb-2" />
              <p className="font-medium">Add Custom Section</p>
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
