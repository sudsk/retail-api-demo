import apiClient from './api.service';
import { API_ENDPOINTS } from '../config/api.config';

class CategoriesService {
  async getCategories() {
    const response = await apiClient.get(API_ENDPOINTS.categories);
    return response.data;
  }
}

export default new CategoriesService();
