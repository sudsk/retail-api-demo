import apiClient from './api.service';
import { API_ENDPOINTS } from '../config/api.config';

class ProductsService {
  async getProduct(productId) {
    const response = await apiClient.get(API_ENDPOINTS.product(productId));
    return response.data;
  }

  async listProducts(params = {}) {
    const {
      pageSize = 20,
      pageToken = '',
      filter = ''
    } = params;

    const response = await apiClient.get(API_ENDPOINTS.products, {
      params: {
        page_size: pageSize,
        page_token: pageToken,
        filter
      }
    });

    return response.data;
  }
}

export default new ProductsService();
