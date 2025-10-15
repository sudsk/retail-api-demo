import React, { useState, useRef, useEffect } from 'react';
import useAutocomplete from '../../hooks/useAutocomplete';
import useDebounce from '../../hooks/useDebounce';
import './SearchBar.css';

const SearchBar = ({ onSearch, initialQuery = '' }) => {
  const [query, setQuery] = useState(initialQuery);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { suggestions, getSuggestions, clearSuggestions } = useAutocomplete();
  const debouncedQuery = useDebounce(query, 300);
  const searchRef = useRef(null);

  useEffect(() => {
    if (debouncedQuery && debouncedQuery.length >= 2) {
      getSuggestions(debouncedQuery);
      setShowSuggestions(true);
    } else {
      clearSuggestions();
      setShowSuggestions(false);
    }
  }, [debouncedQuery, getSuggestions, clearSuggestions]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion.suggestion);
    onSearch(suggestion.suggestion);
    setShowSuggestions(false);
  };

  return (
    <div className="search-bar" ref={searchRef}>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          placeholder="Search for products..."
          className="search-input"
        />
        <button type="submit" className="search-button">
          Search
        </button>
      </form>

      {showSuggestions && suggestions.length > 0 && (
        <div className="autocomplete-dropdown">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="autocomplete-item"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion.suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
