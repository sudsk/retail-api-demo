import apiClient from './api.service';
import { API_ENDPOINTS } from '../config/api.config';

class SearchService {
  async search(params) {
    const {
      query = '',
      visitorId,
      pageSize = 20,
      offset = 0,
      filter = '',
      orderBy = '',
      facetSpecs = null
    } = params;

    const response = await apiClient.post(API_ENDPOINTS.search, {
      query,
      visitor_id: visitorId,
      page_size: pageSize,
      offset,
      filter,
      order_by: orderBy,
      facet_specs: facetSpecs
    });

    return response.data;
  }

  async autocomplete(query, visitorId, maxSuggestions = 5) {
    const response = await apiClient.get(API_ENDPOINTS.autocomplete, {
      params: {
        query,
        visitor_id: visitorId,
        max_suggestions: maxSuggestions
      }
    });

    return response.data;
  }
}

export default new SearchService();
