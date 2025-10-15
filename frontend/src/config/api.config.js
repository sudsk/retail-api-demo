const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

export const API_ENDPOINTS = {
  // Search
  search: `${API_BASE_URL}/api/search`,
  autocomplete: `${API_BASE_URL}/api/search/autocomplete`,
  
  // Products
  products: `${API_BASE_URL}/api/products`,
  product: (productId) => `${API_BASE_URL}/api/products/${productId}`,
  
  // Recommendations
  recommendations: `${API_BASE_URL}/api/recommendations`,
  recommendationModels: `${API_BASE_URL}/api/recommendations/models`,
};

export default API_BASE_URL;
