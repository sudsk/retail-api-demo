import { useState, useCallback } from 'react';
import recommendationsService from '../services/recommendations.service';
import { useUser } from '../context/UserContext';

export const useRecommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { visitorId } = useUser();

  const getRecommendations = useCallback(async (params) => {
    setLoading(true);
    setError(null);

    try {
      const data = await recommendationsService.getRecommendations({
        ...params,
        visitorId
      });

      setRecommendations(data.results || []);
      return data;
    } catch (err) {
      setError(err.message);
      console.error('Recommendations error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [visitorId]);

  return {
    recommendations,
    loading,
    error,
    getRecommendations
  };
};

export default useRecommendations;
