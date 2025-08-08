// Temporary constants file to avoid shared module import issues
// This mirrors the constants from @suban/shared until the import issue is resolved

export const APP_CONFIG = {
  name: 'Suban Wildlife Photography',
  description: 'Wildlife photographer and nature guide sharing the beauty of nature',
  author: 'Suban Chaudhary',
  email: 'contact@subanchaudhary.com',
  phone: '+977-9812753938',
  website: 'https://subanchaudhary.com',
  social: {
    facebook: 'https://www.facebook.com/suman.dlc22',
    instagram: 'https://www.instagram.com/subanchaudhary',
    twitter: 'https://twitter.com/subanchaudhary',
    youtube: 'https://www.youtube.com/@subanchaudhary',
  },
} as const;

export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  BLOG: '/blog',
  BLOG_POST: '/blog/:slug',
  GALLERY: '/gallery',
  TOURISM: '/tourism',
  CONTACT: '/contact',
  JOIN_US: '/join-us',
  DONATE: '/donate',
  // Admin routes
  ADMIN: '/admin',
  ADMIN_LOGIN: '/admin/login',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_BLOG: '/admin/blog',
  ADMIN_BLOG_NEW: '/admin/blog/new',
  ADMIN_BLOG_EDIT: '/admin/blog/edit/:id',
  ADMIN_GALLERY: '/admin/gallery',
  ADMIN_GALLERY_NEW: '/admin/gallery/new',
  ADMIN_GALLERY_EDIT: '/admin/gallery/edit/:id',
  ADMIN_MESSAGES: '/admin/messages',
  ADMIN_JOIN_REQUESTS: '/admin/join-requests',
  ADMIN_SETTINGS: '/admin/settings',
} as const;

export const THEME_CONFIG = {
  DEFAULT_THEME: 'light' as const,
  STORAGE_KEY: 'suban-theme',
};

export const GALLERY_CATEGORIES = [
  'Wildlife',
  'Birds',
  'Landscapes',
  'Macro',
  'Nature Portraits',
  'Conservation',
  'Behind the Scenes',
] as const;

export const BLOG_TAGS = [
  'wildlife',
  'photography',
  'nature',
  'conservation',
  'birding',
  'landscape',
  'macro',
  'tips',
  'gear',
  'adventure',
  'nepal',
  'national-parks',
] as const;

export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/api/auth/login',
  LOGOUT: '/api/auth/logout',
  PROFILE: '/api/auth/profile',
  
  // Blog
  BLOG_POSTS: '/api/blog',
  BLOG_POST: '/api/blog/:id',
  BLOG_SEARCH: '/api/blog/search',
  
  // Gallery
  GALLERY: '/api/gallery',
  GALLERY_FEATURED: '/api/gallery/featured',
  GALLERY_IMAGE: '/api/gallery/:id',
  GALLERY_CATEGORIES: '/api/gallery/categories',
  
  // Contact
  CONTACT: '/api/contact',
  CONTACT_MESSAGES: '/api/contact/messages',
  
  // Join Requests
  JOIN_REQUESTS: '/api/join-requests',
  
  // Site Settings
  SITE_SETTINGS: '/api/settings',
  
  // File Upload
  UPLOAD: '/api/upload',
} as const;

// Types
export type Theme = 'light' | 'dark';
export type Language = 'en' | 'ne';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Contact form validation (for now we'll use a simple validation approach)
// Note: In production, you might want to add proper zod validation
export interface ContactMessageInput {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

// Simple contact message validation function
export const contactMessageSchema = {
  parse: (data: any): ContactMessageInput => {
    const errors: Record<string, string> = {};
    
    if (!data.name || data.name.trim().length === 0) {
      errors.name = 'Name is required';
    } else if (data.name.length > 100) {
      errors.name = 'Name too long';
    }
    
    if (!data.email || data.email.trim().length === 0) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.email = 'Invalid email address';
    }
    
    if (data.subject && data.subject.length > 200) {
      errors.subject = 'Subject too long';
    }
    
    if (!data.message || data.message.trim().length === 0) {
      errors.message = 'Message is required';
    } else if (data.message.length > 2000) {
      errors.message = 'Message too long';
    }
    
    if (Object.keys(errors).length > 0) {
      throw { errors };
    }
    
    return {
      name: data.name.trim(),
      email: data.email.trim(),
      subject: data.subject?.trim(),
      message: data.message.trim()
    };
  }
};
