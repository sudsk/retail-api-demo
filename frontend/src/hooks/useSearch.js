import { useState, useCallback } from 'react';
import searchService from '../services/search.service';
import { useUser } from '../context/UserContext';

export const useSearch = () => {
  const [results, setResults] = useState([]);
  const [facets, setFacets] = useState([]);
  const [totalSize, setTotalSize] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { visitorId } = useUser();

  const search = useCallback(async (params) => {
    setLoading(true);
    setError(null);

    try {
      const data = await searchService.search({
        ...params,
        visitorId
      });

      setResults(data.results || []);
      setFacets(data.facets || []);
      setTotalSize(data.total_size || 0);

      return data;
    } catch (err) {
      setError(err.message);
      console.error('Search error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [visitorId]);

  return {
    results,
    facets,
    totalSize,
    loading,
    error,
    search
  };
};

export default useSearch;
