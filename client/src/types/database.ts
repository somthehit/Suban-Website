// Copy from server/src/types/database.ts
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          role: 'admin';
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name: string;
          role?: 'admin';
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          role?: 'admin';
          avatar_url?: string | null;
          updated_at?: string;
        };
      };
      blog_posts: {
        Row: {
          id: string;
          title: string;
          slug: string;
          content: string;
          excerpt: string | null;
          cover_image: string | null;
          tags: string[];
          published: boolean;
          author_id: string;
          created_at: string;
          updated_at: string;
          published_at: string | null;
          meta_title: string | null;
          meta_description: string | null;
          read_time: number | null;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          content: string;
          excerpt?: string | null;
          cover_image?: string | null;
          tags?: string[];
          published?: boolean;
          author_id: string;
          created_at?: string;
          updated_at?: string;
          published_at?: string | null;
          meta_title?: string | null;
          meta_description?: string | null;
          read_time?: number | null;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          content?: string;
          excerpt?: string | null;
          cover_image?: string | null;
          tags?: string[];
          published?: boolean;
          author_id?: string;
          updated_at?: string;
          published_at?: string | null;
          meta_title?: string | null;
          meta_description?: string | null;
          read_time?: number | null;
        };
      };
      gallery: {
        Row: {
          id: string;
          title: string;
          category: string;
          image_url: string;
          thumbnail_url: string | null;
          caption: string | null;
          alt_text: string;
          tags: string[];
          featured: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          category: string;
          image_url: string;
          thumbnail_url?: string | null;
          caption?: string | null;
          alt_text: string;
          tags?: string[];
          featured?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          category?: string;
          image_url?: string;
          thumbnail_url?: string | null;
          caption?: string | null;
          alt_text?: string;
          tags?: string[];
          featured?: boolean;
          sort_order?: number;
          updated_at?: string;
        };
      };
      contact_messages: {
        Row: {
          id: string;
          name: string;
          email: string;
          subject: string | null;
          message: string;
          read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          subject?: string | null;
          message: string;
          read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          subject?: string | null;
          message?: string;
          read?: boolean;
        };
      };
      join_requests: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string | null;
          reason: string;
          experience_level: 'beginner' | 'intermediate' | 'advanced';
          status: 'pending' | 'approved' | 'rejected';
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          phone?: string | null;
          reason: string;
          experience_level: 'beginner' | 'intermediate' | 'advanced';
          status?: 'pending' | 'approved' | 'rejected';
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          phone?: string | null;
          reason?: string;
          experience_level?: 'beginner' | 'intermediate' | 'advanced';
          status?: 'pending' | 'approved' | 'rejected';
        };
      };
      site_settings: {
        Row: {
          id: string;
          key: string;
          value: string;
          type: 'text' | 'textarea' | 'boolean' | 'json';
          description: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          key: string;
          value: string;
          type?: 'text' | 'textarea' | 'boolean' | 'json';
          description?: string | null;
          updated_at?: string;
        };
        Update: {
          id?: string;
          key?: string;
          value?: string;
          type?: 'text' | 'textarea' | 'boolean' | 'json';
          description?: string | null;
          updated_at?: string;
        };
      };
      homepage_gallery: {
        Row: {
          id: string;
          gallery_image_id: string;
          position: number;
          size: 'small' | 'medium' | 'large';
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          gallery_image_id: string;
          position?: number;
          size?: 'small' | 'medium' | 'large';
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          gallery_image_id?: string;
          position?: number;
          size?: 'small' | 'medium' | 'large';
          is_active?: boolean;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
