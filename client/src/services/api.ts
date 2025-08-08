const API_BASE_URL = 'http://localhost:5000/api';

// Get auth token
const getAuthToken = (): string | null => {
  return localStorage.getItem('admin_token');
};

// Base fetch wrapper with error handling
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };

  // Add auth token for admin routes
  if (endpoint.includes('/admin/')) {
    const token = getAuthToken();
    if (token) {
      defaultHeaders.Authorization = `Bearer ${token}`;
    }
  }

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Blog API
export const blogAPI = {
  // Public
  getPosts: (params?: { page?: number; limit?: number; published?: boolean; tag?: string; search?: string }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.published !== undefined) queryParams.append('published', params.published.toString());
    if (params?.tag) queryParams.append('tag', params.tag);
    if (params?.search) queryParams.append('search', params.search);
    
    return apiRequest(`/blog?${queryParams.toString()}`);
  },

  getPostBySlug: (slug: string) => {
    return apiRequest(`/blog/${slug}`);
  },

  // Admin
  getPostById: (id: string) => {
    return apiRequest(`/admin/blog/${id}`);
  },

  createPost: (postData: any) => {
    return apiRequest('/admin/blog', {
      method: 'POST',
      body: JSON.stringify(postData),
    });
  },

  updatePost: (id: string, postData: any) => {
    return apiRequest(`/admin/blog/${id}`, {
      method: 'PUT',
      body: JSON.stringify(postData),
    });
  },

  deletePost: (id: string) => {
    return apiRequest(`/admin/blog/${id}`, {
      method: 'DELETE',
    });
  },
};

// Gallery API
export const galleryAPI = {
  // Public
  getImages: (params?: { category?: string; featured?: boolean; limit?: number }) => {
    const queryParams = new URLSearchParams();
    if (params?.category) queryParams.append('category', params.category);
    if (params?.featured !== undefined) queryParams.append('featured', params.featured.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    
    return apiRequest(`/gallery?${queryParams.toString()}`);
  },

  // Admin
  getAllImages: () => {
    return apiRequest('/admin/gallery');
  },

  getImageById: (id: string) => {
    return apiRequest(`/admin/gallery/${id}`);
  },

  createImage: (imageData: any) => {
    return apiRequest('/admin/gallery', {
      method: 'POST',
      body: JSON.stringify(imageData),
    });
  },

  updateImage: (id: string, imageData: any) => {
    return apiRequest(`/admin/gallery/${id}`, {
      method: 'PUT',
      body: JSON.stringify(imageData),
    });
  },

  deleteImage: (id: string) => {
    return apiRequest(`/admin/gallery/${id}`, {
      method: 'DELETE',
    });
  },

  bulkDelete: (ids: string[]) => {
    return apiRequest('/admin/gallery/bulk-delete', {
      method: 'DELETE',
      body: JSON.stringify({ ids }),
    });
  },
};

// Contact API
export const contactAPI = {
  // Public
  sendMessage: (messageData: any) => {
    return apiRequest('/contact', {
      method: 'POST',
      body: JSON.stringify(messageData),
    });
  },

  // Admin
  getMessages: (params?: { page?: number; limit?: number; search?: string; read?: boolean }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.read !== undefined) queryParams.append('read', params.read.toString());
    
    return apiRequest(`/admin/messages?${queryParams.toString()}`);
  },

  updateMessageStatus: (id: string, read: boolean) => {
    return apiRequest(`/admin/messages/${id}/read`, {
      method: 'PUT',
      body: JSON.stringify({ read }),
    });
  },

  deleteMessage: (id: string) => {
    return apiRequest(`/admin/messages/${id}`, {
      method: 'DELETE',
    });
  },

  bulkDeleteMessages: (ids: string[]) => {
    return apiRequest('/admin/messages/bulk', {
      method: 'DELETE',
      body: JSON.stringify({ ids }),
    });
  },

  getMessageStats: () => {
    return apiRequest('/admin/message-stats');
  },
};

// Join Requests API
export const joinRequestAPI = {
  // Public
  submitRequest: (requestData: any) => {
    return apiRequest('/join-requests', {
      method: 'POST',
      body: JSON.stringify(requestData),
    });
  },

  // Admin
  getRequests: (params?: { page?: number; limit?: number; search?: string; status?: string }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.status) queryParams.append('status', params.status);
    
    return apiRequest(`/admin/join-requests?${queryParams.toString()}`);
  },

  updateRequestStatus: (id: string, status: string) => {
    return apiRequest(`/admin/join-requests/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },

  deleteRequest: (id: string) => {
    return apiRequest(`/admin/join-requests/${id}`, {
      method: 'DELETE',
    });
  },

  getRequestStats: () => {
    return apiRequest('/admin/join-request-stats');
  },
};

// Donation API
export const donationAPI = {
  // Public
  createDonation: (donationData: any) => {
    return apiRequest('/donations', {
      method: 'POST',
      body: JSON.stringify(donationData),
    });
  },

  getPaymentMethods: () => {
    return apiRequest('/payment-methods'); // Public endpoint
  },

  // Admin
  getAdminPaymentMethods: () => {
    return apiRequest('/admin/payment-methods');
  },

  createPaymentMethod: (methodData: any) => {
    return apiRequest('/admin/payment-methods', {
      method: 'POST',
      body: JSON.stringify(methodData),
    });
  },

  updatePaymentMethod: (id: string, methodData: any) => {
    return apiRequest(`/admin/payment-methods/${id}`, {
      method: 'PUT',
      body: JSON.stringify(methodData),
    });
  },

  deletePaymentMethod: (id: string) => {
    return apiRequest(`/admin/payment-methods/${id}`, {
      method: 'DELETE',
    });
  },

  getDonors: () => {
    return apiRequest('/donors'); // Public endpoint
  },

  getDonorById: (id: string) => {
    return apiRequest(`/admin/donors/${id}`);
  },

  getDonations: () => {
    return apiRequest('/admin/donations');
  },

  updateDonationStatus: (id: string, status: string) => {
    return apiRequest(`/admin/donations/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },

  getDonationStats: () => {
    return apiRequest('/donation-stats'); // Public endpoint
  },
};

// Settings API
export const settingsAPI = {
  // Public
  getPublicSettings: () => {
    return apiRequest('/settings/public');
  },

  // Admin
  getSettings: () => {
    return apiRequest('/admin/settings');
  },

  updateSetting: (key: string, value: string, type?: string, description?: string) => {
    return apiRequest('/admin/settings', {
      method: 'POST',
      body: JSON.stringify({ key, value, type, description }),
    });
  },

  batchUpdateSettings: (settings: any[]) => {
    return apiRequest('/admin/settings/batch', {
      method: 'PUT',
      body: JSON.stringify({ settings }),
    });
  },

  deleteSetting: (key: string) => {
    return apiRequest(`/admin/settings/${key}`, {
      method: 'DELETE',
    });
  },
};

// Upload API
export const uploadAPI = {
  uploadImage: (file: File) => {
    console.log('Starting image upload:', file.name, file.size);
    const formData = new FormData();
    formData.append('image', file);
    
    const token = getAuthToken();
    const headers: HeadersInit = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    console.log('Upload URL:', `${API_BASE_URL}/upload`);
    console.log('Upload headers:', headers);
    
    return fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      headers,
      body: formData,
    }).then(response => {
      console.log('Upload response status:', response.status);
      if (!response.ok) {
        return response.text().then(text => {
          console.error('Upload error response:', text);
          throw new Error(`HTTP error! status: ${response.status} - ${text}`);
        });
      }
      return response.json();
    }).catch(error => {
      console.error('Upload fetch error:', error);
      throw error;
    });
  },

  uploadMultipleImages: (files: File[]) => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('images', file);
    });
    
    const token = getAuthToken();
    const headers: HeadersInit = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    return fetch(`${API_BASE_URL}/upload/multiple`, {
      method: 'POST',
      headers,
      body: formData,
    }).then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    });
  },

  deleteImage: (filename: string) => {
    return apiRequest(`/upload/${filename}`, {
      method: 'DELETE',
    });
  },
};

// Dashboard Stats API
export const dashboardAPI = {
  getStats: () => {
    return apiRequest('/admin/dashboard/stats');
  },
};

// Tourism API
export const tourismAPI = {
  // Public
  getAllTourism: (params?: { type?: string; category?: string; featured?: boolean; limit?: number }) => {
    const queryParams = new URLSearchParams();
    if (params?.type) queryParams.append('type', params.type);
    if (params?.category) queryParams.append('category', params.category);
    if (params?.featured !== undefined) queryParams.append('featured', params.featured.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    
    return apiRequest(`/tourism?${queryParams.toString()}`);
  },

  getTourismById: (id: string) => {
    return apiRequest(`/tourism/${id}`);
  },

  // Admin
  createTourism: (tourismData: any) => {
    return apiRequest('/admin/tourism', {
      method: 'POST',
      body: JSON.stringify(tourismData),
    });
  },

  updateTourism: (id: string, tourismData: any) => {
    return apiRequest(`/admin/tourism/${id}`, {
      method: 'PUT',
      body: JSON.stringify(tourismData),
    });
  },

  deleteTourism: (id: string) => {
    return apiRequest(`/admin/tourism/${id}`, {
      method: 'DELETE',
    });
  },

  getTourismStats: () => {
    return apiRequest('/admin/tourism/stats');
  },
};

// Auth API
export const authAPI = {
  login: (credentials: { email: string; password: string }) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  logout: () => {
    return apiRequest('/auth/logout', {
      method: 'POST',
    });
  },

  getCurrentUser: () => {
    return apiRequest('/auth/me');
  },

  refreshToken: () => {
    return apiRequest('/auth/refresh', {
      method: 'POST',
    });
  },
};
