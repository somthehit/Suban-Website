import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  EnvelopeIcon,
  EnvelopeOpenIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  TrashIcon,
  EyeIcon,
  UserIcon,
  CalendarIcon,
  ClockIcon,
  CheckIcon,
  ArchiveBoxIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { contactAPI } from '../../services/api';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  read: boolean;
  created_at: string;
  replied: boolean;
  priority: 'low' | 'medium' | 'high';
}

const AdminMessages: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'unread' | 'read'>('all');
  const [selectedMessages, setSelectedMessages] = useState<string[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [showMessageModal, setShowMessageModal] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const response = await contactAPI.getMessages();
      if (response.success) {
        setMessages(response.data || []);
      } else {
        throw new Error('Failed to fetch messages');
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages');
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (message.subject && message.subject.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = filterStatus === 'all' ||
                         (filterStatus === 'read' && message.read) ||
                         (filterStatus === 'unread' && !message.read);
    
    return matchesSearch && matchesStatus;
  });

  const unreadCount = messages.filter(m => !m.read).length;

  const handleSelectMessage = (messageId: string) => {
    setSelectedMessages(prev => 
      prev.includes(messageId) 
        ? prev.filter(id => id !== messageId)
        : [...prev, messageId]
    );
  };

  const handleSelectAll = () => {
    if (selectedMessages.length === filteredMessages.length) {
      setSelectedMessages([]);
    } else {
      setSelectedMessages(filteredMessages.map(message => message.id));
    }
  };

  const handleMarkAsRead = async (messageId: string) => {
    try {
      await contactAPI.updateMessageStatus(messageId, true);
      setMessages(prev => prev.map(message => 
        message.id === messageId ? { ...message, read: true } : message
      ));
      toast.success('Message marked as read');
    } catch (error) {
      console.error('Error marking message as read:', error);
      toast.error('Failed to mark message as read');
    }
  };

  const handleMarkAsUnread = async (messageId: string) => {
    try {
      await contactAPI.updateMessageStatus(messageId, false);
      setMessages(prev => prev.map(message => 
        message.id === messageId ? { ...message, read: false } : message
      ));
      toast.success('Message marked as unread');
    } catch (error) {
      console.error('Error marking message as unread:', error);
      toast.error('Failed to mark message as unread');
    }
  };

  const handleBulkMarkAsRead = async () => {
    if (selectedMessages.length === 0) return;
    
    setMessages(prev => prev.map(message => 
      selectedMessages.includes(message.id) ? { ...message, read: true } : message
    ));
    toast.success(`${selectedMessages.length} message(s) marked as read`);
    setSelectedMessages([]);
  };

  const handleBulkDelete = async () => {
    if (selectedMessages.length === 0) return;
    
    const confirmDelete = window.confirm(`Are you sure you want to delete ${selectedMessages.length} message(s)?`);
    if (confirmDelete) {
      setMessages(prev => prev.filter(message => !selectedMessages.includes(message.id)));
      toast.success(`${selectedMessages.length} message(s) deleted successfully`);
      setSelectedMessages([]);
    }
  };

  const handleViewMessage = (message: ContactMessage) => {
    setSelectedMessage(message);
    setShowMessageModal(true);
    if (!message.read) {
      handleMarkAsRead(message.id);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400';
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'low': return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-400';
    }
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Messages</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage contact messages and inquiries
            {unreadCount > 0 && (
              <span className="ml-2 inline-flex items-center px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 text-xs rounded-full">
                {unreadCount} unread
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div className="flex items-center gap-2">
            <FunnelIcon className="w-5 h-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as 'all' | 'unread' | 'read')}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Messages</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedMessages.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded-lg p-4"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm text-purple-700 dark:text-purple-300">
              {selectedMessages.length} message(s) selected
            </span>
            <div className="flex gap-2">
              <button
                onClick={handleBulkMarkAsRead}
                className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
              >
                Mark as Read
              </button>
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

      {/* Messages List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        {filteredMessages.length === 0 ? (
          <div className="p-8 text-center">
            <EnvelopeIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-gray-500 dark:text-gray-400 text-lg mb-2">No messages found</h3>
            <p className="text-gray-400 dark:text-gray-500">
              {searchTerm || filterStatus !== 'all'
                ? 'Try adjusting your search or filters'
                : 'No contact messages yet'
              }
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {/* Table Header */}
            <div className="p-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedMessages.length === filteredMessages.length}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Select All ({filteredMessages.length})
                </span>
              </div>
            </div>

            {/* Messages */}
            {filteredMessages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <input
                    type="checkbox"
                    checked={selectedMessages.includes(message.id)}
                    onChange={() => handleSelectMessage(message.id)}
                    className="mt-1 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {message.read ? (
                            <EnvelopeOpenIcon className="w-4 h-4 text-gray-400" />
                          ) : (
                            <EnvelopeIcon className="w-4 h-4 text-blue-500" />
                          )}
                          <h3 className={`text-sm font-semibold ${
                            message.read 
                              ? 'text-gray-900 dark:text-white' 
                              : 'text-blue-600 dark:text-blue-400'
                          }`}>
                            {message.name}
                          </h3>
                          <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(message.priority)}`}>
                            {message.priority}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-2">
                          <div className="flex items-center gap-1">
                            <UserIcon className="w-3 h-3" />
                            {message.email}
                          </div>
                          <div className="flex items-center gap-1">
                            <CalendarIcon className="w-3 h-3" />
                            {formatDate(message.created_at)}
                          </div>
                          {message.replied && (
                            <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 rounded-full">
                              <CheckIcon className="w-3 h-3 mr-1" />
                              Replied
                            </span>
                          )}
                        </div>
                        
                        {message.subject && (
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                            {message.subject}
                          </h4>
                        )}
                        
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                          {message.message}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-end gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                  <button
                    onClick={() => handleViewMessage(message)}
                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                    title="View Message"
                  >
                    <EyeIcon className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={() => message.read ? handleMarkAsUnread(message.id) : handleMarkAsRead(message.id)}
                    className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded transition-colors"
                    title={message.read ? 'Mark as Unread' : 'Mark as Read'}
                  >
                    {message.read ? (
                      <EnvelopeIcon className="w-4 h-4" />
                    ) : (
                      <EnvelopeOpenIcon className="w-4 h-4" />
                    )}
                  </button>
                  
                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this message?')) {
                        setMessages(prev => prev.filter(m => m.id !== message.id));
                        toast.success('Message deleted successfully');
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

      {/* Message Modal */}
      {showMessageModal && selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {selectedMessage.subject || 'Message'}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mt-1">
                    <span>From: {selectedMessage.name} ({selectedMessage.email})</span>
                    <span>{formatDate(selectedMessage.created_at)}</span>
                  </div>
                </div>
                <button
                  onClick={() => setShowMessageModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  ×
                </button>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
                <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
                  {selectedMessage.message}
                </p>
              </div>
              
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    // TODO: Implement reply functionality
                    toast.success('Reply feature coming soon!');
                  }}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Reply
                </button>
                <button
                  onClick={() => setShowMessageModal(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminMessages;

