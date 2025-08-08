export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin';
  avatar_url?: string;
  created_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  cover_image: string;
  tags: string[];
  published: boolean;
  author_id: string;
  created_at: string;
  updated_at: string;
  published_at?: string;
  meta_title?: string;
  meta_description?: string;
  read_time?: number;
}

export interface GalleryImage {
  id: string;
  title: string;
  category: string;
  image_url: string;
  thumbnail_url?: string;
  caption?: string;
  alt_text: string;
  tags: string[];
  featured: boolean;
  sort_order: number;
  location?: string;
  created_at: string;
  updated_at: string;
}


export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  read: boolean;
  created_at: string;
}

export interface JoinRequest {
  id: string;
  name: string;
  email: string;
  phone?: string;
  reason: string;
  experience_level: 'beginner' | 'intermediate' | 'advanced';
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export interface SiteSetting {
  id: string;
  key: string;
  value: string;
  type: 'text' | 'textarea' | 'boolean' | 'json';
  description?: string;
  updated_at: string;
}

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

export type Theme = 'light' | 'dark';
export type Language = 'en' | 'ne';

export interface AppState {
  theme: Theme;
  language: Language;
  user: User | null;
  isLoading: boolean;
}
