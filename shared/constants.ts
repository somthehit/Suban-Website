export const APP_CONFIG = {
  name: 'Suban Wildlife Photography',
  description: 'Wildlife photographer and nature guide sharing the beauty of nature & culture of Nepal',
  author: 'Suban Chaudhary',
  email: 'contact@subanchaudhary.com',
  phone: '+977-9812753938',
  website: 'https://subanchaudhary.com',
  social: {
    facebook: 'https://www.facebook.com/suman.dlc22',
    instagram: 'https://instagram.com/subanchaudhary',
    twitter: 'https://twitter.com/subanchaudhary',
    youtube: 'https://youtube.com/@subanchaudhary',
  },
} as const;

export const SUPABASE_CONFIG = {
  buckets: {
    BLOG_IMAGES: 'blog-images',
    GALLERY_IMAGES: 'gallery-images',
    SITE_ASSETS: 'site-assets',
  },
  tables: {
    USERS: 'users',
    BLOG_POSTS: 'blog_posts',
    GALLERY: 'gallery',
    HOMEPAGE_GALLERY: 'homepage_gallery',
    CONTACT_MESSAGES: 'contact_messages',
    JOIN_REQUESTS: 'join_requests',
    SITE_SETTINGS: 'site_settings',
  },
} as const;

export const ROUTES = {
  // Public routes
  HOME: '/',
  ABOUT: '/about',
  BLOG: '/blog',
  BLOG_POST: '/blog/:slug',
  GALLERY: '/gallery',
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

export const GALLERY_CATEGORIES = [
  'Wildlife',
  'Birds',
  'Landscapes',
  'Macro',
  'Nature Portraits',
  'Conservation',
  'Behind the Scenes',
  'Culture',
  'Festivals',
  'Religion',
  'History',
  'Art',
  'Crafts',
  'Food',
] as const;

export const BLOG_TAGS = [
  'wildlife',
  'photography',
  'nature',
  'nepal',
  'nepal-tour',
  'nepal-travel',
  'nepal-trip',
  'beautiful-nepal',
  'nepal-tour-guide',
  'beauti-of-nepal',
  'conservation',
  'birding',
  'landscape',
  'macro',
  'tips',
  'gear',
  'adventure',
  'nepal',
  'national-parks',
  'culture',
  'festivals',
  'religion',
  'history',
  'art',
  'crafts',
  'food',
] as const;

export const EXPERIENCE_LEVELS = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
] as const;

export const PAGINATION = {
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
  BLOG_POSTS_PER_PAGE: 6,
  GALLERY_IMAGES_PER_PAGE: 12,
  ADMIN_ITEMS_PER_PAGE: 20,
} as const;

export const FILE_UPLOAD = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.webp'],
} as const;

export const SEO = {
  DEFAULT_META: {
    title: APP_CONFIG.name,
    description: APP_CONFIG.description,
    keywords: 'wildlife photography, nature guide, nepal, conservation, birding, landscape photography',
    author: APP_CONFIG.author,
    type: 'website',
    locale: 'en_US',
  },
  BLOG_META: {
    type: 'article',
    section: 'Photography',
  },
} as const;

export const THEME_CONFIG = {
  DEFAULT_THEME: 'light' as const,
  STORAGE_KEY: 'suban-theme',
};

export const LANGUAGE_CONFIG = {
  DEFAULT_LANGUAGE: 'en' as const,
  STORAGE_KEY: 'suban-language',
  SUPPORTED_LANGUAGES: ['en', 'ne'] as const,
};

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

export const ERROR_MESSAGES = {
  GENERIC: 'Something went wrong. Please try again.',
  NETWORK: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION: 'Please check your input and try again.',
  FILE_TOO_LARGE: `File size must be less than ${FILE_UPLOAD.MAX_SIZE / 1024 / 1024}MB`,
  INVALID_FILE_TYPE: 'Invalid file type. Please upload an image file.',
} as const;

export const SUCCESS_MESSAGES = {
  GENERIC: 'Operation completed successfully.',
  CREATED: 'Created successfully.',
  UPDATED: 'Updated successfully.',
  DELETED: 'Deleted successfully.',
  UPLOADED: 'File uploaded successfully.',
  MESSAGE_SENT: 'Message sent successfully.',
  REQUEST_SUBMITTED: 'Request submitted successfully.',
} as const;
