// API Helper with Authentication Support
const API_BASE = '/api';

// Token management
export const getToken = () => localStorage.getItem('adminToken');
export const setToken = (token) => localStorage.setItem('adminToken', token);
export const removeToken = () => localStorage.removeItem('adminToken');

// Generic fetch wrapper with error handling
async function fetchAPI(endpoint, options = {}, requireAuth = false) {
  const url = `${API_BASE}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (requireAuth) {
    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const config = { ...options, headers };
  
  // Don't set Content-Type for FormData
  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      if (response.status === 401) {
        removeToken();
      }
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }
    
    return data;
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
}

// ========================
// Auth API
// ========================
export const login = async (username, password) => {
  const data = await fetchAPI('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
  if (data.token) {
    setToken(data.token);
  }
  return data;
};

export const logout = () => {
  removeToken();
};

export const verifyToken = () => fetchAPI('/auth/verify', {}, true);

export const changePassword = (currentPassword, newPassword) => 
  fetchAPI('/auth/change-password', {
    method: 'POST',
    body: JSON.stringify({ currentPassword, newPassword }),
  }, true);

export const isAuthenticated = () => !!getToken();

// ========================
// Image Upload API
// ========================
export const uploadImage = async (file, category) => {
  const formData = new FormData();
  formData.append('image', file);
  
  const token = getToken();
  const response = await fetch(`${API_BASE}/upload/${category}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });
  
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Upload failed');
  }
  return data;
};

export const deleteImage = (imageUrl) => 
  fetchAPI('/upload', {
    method: 'DELETE',
    body: JSON.stringify({ imageUrl }),
  }, true);

// ========================
// Item Images API (Multi-image support)
// ========================
export const getItemImages = (itemType, itemId) => 
  fetchAPI(`/item-images/${itemType}/${itemId}`);

export const addItemImage = (itemType, itemId, imageUrl, altText = '') =>
  fetchAPI('/item-images', {
    method: 'POST',
    body: JSON.stringify({ item_type: itemType, item_id: itemId, image_url: imageUrl, alt_text: altText }),
  }, true);

export const updateItemImage = (id, altText) =>
  fetchAPI(`/item-images/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ alt_text: altText }),
  }, true);

export const deleteItemImage = (id) =>
  fetchAPI(`/item-images/${id}`, {
    method: 'DELETE',
  }, true);

export const reorderItemImages = (itemType, itemId, imageIds) =>
  fetchAPI(`/item-images/reorder/${itemType}/${itemId}`, {
    method: 'PUT',
    body: JSON.stringify({ imageIds }),
  }, true);

// ========================
// Health Check
// ========================
export const checkHealth = () => fetchAPI('/health');

// ========================
// Products API
// ========================
export const getProducts = () => fetchAPI('/products');
export const getProduct = (id) => fetchAPI(`/products/${id}`);
export const createProduct = (product) => fetchAPI('/products', {
  method: 'POST',
  body: JSON.stringify(product),
}, true);
export const updateProduct = (id, product) => fetchAPI(`/products/${id}`, {
  method: 'PUT',
  body: JSON.stringify(product),
}, true);
export const deleteProduct = (id) => fetchAPI(`/products/${id}`, {
  method: 'DELETE',
}, true);

// ========================
// Services API
// ========================
export const getServices = () => fetchAPI('/services');
export const getService = (id) => fetchAPI(`/services/${id}`);
export const createService = (service) => fetchAPI('/services', {
  method: 'POST',
  body: JSON.stringify(service),
}, true);
export const updateService = (id, service) => fetchAPI(`/services/${id}`, {
  method: 'PUT',
  body: JSON.stringify(service),
}, true);
export const deleteService = (id) => fetchAPI(`/services/${id}`, {
  method: 'DELETE',
}, true);

// ========================
// Workshops API
// ========================
export const getWorkshops = () => fetchAPI('/workshops');
export const getWorkshop = (id) => fetchAPI(`/workshops/${id}`);
export const createWorkshop = (workshop) => fetchAPI('/workshops', {
  method: 'POST',
  body: JSON.stringify(workshop),
}, true);
export const updateWorkshop = (id, workshop) => fetchAPI(`/workshops/${id}`, {
  method: 'PUT',
  body: JSON.stringify(workshop),
}, true);
export const deleteWorkshop = (id) => fetchAPI(`/workshops/${id}`, {
  method: 'DELETE',
}, true);

// ========================
// Projects API
// ========================
export const getProjects = () => fetchAPI('/projects');
export const getProject = (id) => fetchAPI(`/projects/${id}`);
export const createProject = (project) => fetchAPI('/projects', {
  method: 'POST',
  body: JSON.stringify(project),
}, true);
export const updateProject = (id, project) => fetchAPI(`/projects/${id}`, {
  method: 'PUT',
  body: JSON.stringify(project),
}, true);
export const deleteProject = (id) => fetchAPI(`/projects/${id}`, {
  method: 'DELETE',
}, true);

// ========================
// Messages API
// ========================
export const getMessages = () => fetchAPI('/messages', {}, true);
export const sendMessage = (message) => fetchAPI('/messages', {
  method: 'POST',
  body: JSON.stringify(message),
});
export const deleteMessage = (id) => fetchAPI(`/messages/${id}`, {
  method: 'DELETE',
}, true);

// ========================
// Testimonials API
// ========================
export const getTestimonials = (featured = false) => 
  fetchAPI(`/testimonials${featured ? '?featured=true' : ''}`);
export const getTestimonial = (id) => fetchAPI(`/testimonials/${id}`);
export const createTestimonial = (testimonial) => fetchAPI('/testimonials', {
  method: 'POST',
  body: JSON.stringify(testimonial),
}, true);
export const updateTestimonial = (id, testimonial) => fetchAPI(`/testimonials/${id}`, {
  method: 'PUT',
  body: JSON.stringify(testimonial),
}, true);
export const deleteTestimonial = (id) => fetchAPI(`/testimonials/${id}`, {
  method: 'DELETE',
}, true);

// ========================
// Search API
// ========================
export const search = (query, type = 'all') => 
  fetchAPI(`/search?q=${encodeURIComponent(query)}&type=${type}`);
