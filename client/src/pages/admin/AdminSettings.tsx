import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  CogIcon,
  UserIcon,
  GlobeAltIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  LinkIcon,
  PhotoIcon,
  BellIcon,
  ShieldCheckIcon,
  KeyIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';

interface SiteSettings {
  site_title: string;
  site_description: string;
  site_keywords: string;
  contact_email: string;
  contact_phone: string;
  address: string;
  social_facebook: string;
  social_instagram: string;
  social_twitter: string;
  social_youtube: string;
  logo_url: string;
  favicon_url: string;
  notifications_email: boolean;
  notifications_comments: boolean;
  analytics_id: string;
}

interface UserProfile {
  name: string;
  email: string;
  bio: string;
  avatar_url: string;
  current_password: string;
  new_password: string;
  confirm_password: string;
}

const AdminSettings: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'general' | 'profile' | 'security'>('general');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    site_title: 'Suban Wildlife Photography',
    site_description: 'Wildlife photographer and nature guide sharing the beauty of nature',
    site_keywords: 'wildlife photography, nepal, nature, conservation, birds, animals',
    contact_email: 'contact@subanchaudhary.com',
    contact_phone: '+977-9876543210',
    address: 'Kathmandu, Nepal',
    social_facebook: 'https://facebook.com/subanchaudhary',
    social_instagram: 'https://instagram.com/subanchaudhary',
    social_twitter: 'https://twitter.com/subanchaudhary',
    social_youtube: 'https://youtube.com/@subanchaudhary',
    logo_url: '/images/logo.png',
    favicon_url: '/images/favicon.ico',
    notifications_email: true,
    notifications_comments: true,
    analytics_id: ''
  });

  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'Suban Chaudhary',
    email: 'somthehit@gmail.com',
    bio: 'Wildlife photographer and conservationist based in Nepal. Passionate about capturing the beauty of nature and promoting wildlife conservation.',
    avatar_url: '/images/avatar.jpg',
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  useEffect(() => {
    if (user) {
      setUserProfile(prev => ({
        ...prev,
        name: user.name,
        email: user.email
      }));
    }
  }, [user]);

  const handleSiteSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const finalValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setSiteSettings(prev => ({ ...prev, [name]: finalValue }));
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUserProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveSiteSettings = async () => {
    setSaving(true);
    try {
      // TODO: Implement API call to save site settings
      console.log('Saving site settings:', siteSettings);
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Site settings saved successfully!');
    } catch (error) {
      toast.error('Failed to save site settings');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      // TODO: Implement API call to save profile
      console.log('Saving profile:', userProfile);
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Profile updated successfully!');
      // Clear password fields
      setUserProfile(prev => ({
        ...prev,
        current_password: '',
        new_password: '',
        confirm_password: ''
      }));
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!userProfile.current_password) {
      toast.error('Please enter your current password');
      return;
    }
    
    if (!userProfile.new_password || userProfile.new_password.length < 6) {
      toast.error('New password must be at least 6 characters long');
      return;
    }
    
    if (userProfile.new_password !== userProfile.confirm_password) {
      toast.error('New passwords do not match');
      return;
    }

    setSaving(true);
    try {
      // TODO: Implement API call to change password
      console.log('Changing password');
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Password changed successfully!');
      setUserProfile(prev => ({
        ...prev,
        current_password: '',
        new_password: '',
        confirm_password: ''
      }));
    } catch (error) {
      toast.error('Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage your site settings and profile
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('general')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'general'
                ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <GlobeAltIcon className="w-5 h-5 mr-2 inline" />
            General
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'profile'
                ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <UserIcon className="w-5 h-5 mr-2 inline" />
            Profile
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'security'
                ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <ShieldCheckIcon className="w-5 h-5 mr-2 inline" />
            Security
          </button>
        </nav>
      </div>

      {/* General Settings */}
      {activeTab === 'general' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Site Information */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <CogIcon className="w-5 h-5 mr-2" />
              Site Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Site Title
                </label>
                <input
                  type="text"
                  name="site_title"
                  value={siteSettings.site_title}
                  onChange={handleSiteSettingsChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Keywords (SEO)
                </label>
                <input
                  type="text"
                  name="site_keywords"
                  value={siteSettings.site_keywords}
                  onChange={handleSiteSettingsChange}
                  placeholder="wildlife, photography, nepal"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Site Description
                </label>
                <textarea
                  name="site_description"
                  value={siteSettings.site_description}
                  onChange={handleSiteSettingsChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <EnvelopeIcon className="w-5 h-5 mr-2" />
              Contact Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Contact Email
                </label>
                <input
                  type="email"
                  name="contact_email"
                  value={siteSettings.contact_email}
                  onChange={handleSiteSettingsChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="contact_phone"
                  value={siteSettings.contact_phone}
                  onChange={handleSiteSettingsChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={siteSettings.address}
                  onChange={handleSiteSettingsChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <LinkIcon className="w-5 h-5 mr-2" />
              Social Media Links
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Facebook
                </label>
                <input
                  type="url"
                  name="social_facebook"
                  value={siteSettings.social_facebook}
                  onChange={handleSiteSettingsChange}
                  placeholder="https://facebook.com/username"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Instagram
                </label>
                <input
                  type="url"
                  name="social_instagram"
                  value={siteSettings.social_instagram}
                  onChange={handleSiteSettingsChange}
                  placeholder="https://instagram.com/username"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Twitter
                </label>
                <input
                  type="url"
                  name="social_twitter"
                  value={siteSettings.social_twitter}
                  onChange={handleSiteSettingsChange}
                  placeholder="https://twitter.com/username"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  YouTube
                </label>
                <input
                  type="url"
                  name="social_youtube"
                  value={siteSettings.social_youtube}
                  onChange={handleSiteSettingsChange}
                  placeholder="https://youtube.com/@username"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSaveSiteSettings}
              disabled={saving}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </motion.div>
      )}

      {/* Profile Settings */}
      {activeTab === 'profile' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <UserIcon className="w-5 h-5 mr-2" />
              Profile Information
            </h3>
            
            <div className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="flex-shrink-0">
                  <img
                    src={userProfile.avatar_url}
                    alt="Profile"
                    className="w-20 h-20 rounded-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/images/default-avatar.png';
                    }}
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Avatar URL
                  </label>
                  <input
                    type="url"
                    name="avatar_url"
                    value={userProfile.avatar_url}
                    onChange={handleProfileChange}
                    placeholder="https://example.com/avatar.jpg"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={userProfile.name}
                    onChange={handleProfileChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={userProfile.email}
                    onChange={handleProfileChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={userProfile.bio}
                  onChange={handleProfileChange}
                  rows={4}
                  placeholder="Tell us about yourself..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
            
            <div className="flex justify-end mt-6">
              <button
                onClick={handleSaveProfile}
                disabled={saving}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {saving ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Security Settings */}
      {activeTab === 'security' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <KeyIcon className="w-5 h-5 mr-2" />
              Change Password
            </h3>
            
            <div className="space-y-4 max-w-md">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.current ? 'text' : 'password'}
                    name="current_password"
                    value={userProfile.current_password}
                    onChange={handleProfileChange}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('current')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showPasswords.current ? (
                      <EyeSlashIcon className="w-5 h-5" />
                    ) : (
                      <EyeIcon className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? 'text' : 'password'}
                    name="new_password"
                    value={userProfile.new_password}
                    onChange={handleProfileChange}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('new')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showPasswords.new ? (
                      <EyeSlashIcon className="w-5 h-5" />
                    ) : (
                      <EyeIcon className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? 'text' : 'password'}
                    name="confirm_password"
                    value={userProfile.confirm_password}
                    onChange={handleProfileChange}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('confirm')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showPasswords.confirm ? (
                      <EyeSlashIcon className="w-5 h-5" />
                    ) : (
                      <EyeIcon className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end mt-6">
              <button
                onClick={handleChangePassword}
                disabled={saving}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {saving ? 'Changing...' : 'Change Password'}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AdminSettings;
