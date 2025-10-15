import { useState, useCallback } from 'react';
import searchService from '../services/search.service';
import { useUser } from '../context/UserContext';

export const useAutocomplete = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const { visitorId } = useUser();

  const getSuggestions = useCallback(async (query, maxSuggestions = 5) => {
    if (!query || query.length < 2) {
      setSuggestions([]);
      return;
    }

    setLoading(true);

    try {
      const data = await searchService.autocomplete(query, visitorId, maxSuggestions);
      setSuggestions(data.suggestions || []);
    } catch (err) {
      console.error('Autocomplete error:', err);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, [visitorId]);

  const clearSuggestions = useCallback(() => {
    setSuggestions([]);
  }, []);

  return {
    suggestions,
    loading,
    getSuggestions,
    clearSuggestions
  };
};

export default useAutocomplete;
