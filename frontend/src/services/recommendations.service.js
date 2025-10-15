import apiClient from './api.service';
import { API_ENDPOINTS } from '../config/api.config';

class RecommendationsService {
  async getRecommendations(params) {
    const {
      model,
      visitorId,
      productId = null,
      pageSize = 10,
      filter = '',
      params: additionalParams = null
    } = params;

    const response = await apiClient.post(API_ENDPOINTS.recommendations, {
      model,
      visitor_id: visitorId,
      product_id: productId,
      page_size: pageSize,
      filter,
      params: additionalParams
    });

    return response.data;
  }

  async getModels() {
    const response = await apiClient.get(API_ENDPOINTS.recommendationModels);
    return response.data;
  }
}

export default new RecommendationsService();
