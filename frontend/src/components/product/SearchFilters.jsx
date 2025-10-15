import React from 'react';
import './SearchFilters.css';

const SearchFilters = ({ facets, selectedFilters, onFilterChange }) => {
  if (!facets || facets.length === 0) {
    return null;
  }

  const handleFilterToggle = (facetKey, value) => {
    const currentFilters = selectedFilters[facetKey] || [];
    const newFilters = currentFilters.includes(value)
      ? currentFilters.filter(v => v !== value)
      : [...currentFilters, value];
    
    onFilterChange(facetKey, newFilters);
  };

  return (
    <div className="search-filters">
      <h3 className="filters-title">Filters</h3>
      
      {facets.map((facet) => (
        <div key={facet.key} className="filter-group">
          <h4 className="filter-group-title">{facet.key}</h4>
          
          <div className="filter-options">
            {facet.values && facet.values.slice(0, 10).map((option) => (
              <label key={option.value} className="filter-option">
                <input
                  type="checkbox"
                  checked={(selectedFilters[facet.key] || []).includes(option.value)}
                  onChange={() => handleFilterToggle(facet.key, option.value)}
                />
                <span className="filter-label">
                  {option.value} ({option.count})
                </span>
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SearchFilters;
