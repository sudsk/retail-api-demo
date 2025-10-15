import React from 'react';
import './SortDropdown.css';

const SortDropdown = ({ value, onChange }) => {
  const sortOptions = [
    { value: '', label: 'Relevance' },
    { value: 'priceInfo.price asc', label: 'Price: Low to High' },
    { value: 'priceInfo.price desc', label: 'Price: High to Low' },
    { value: 'title asc', label: 'Name: A to Z' },
    { value: 'title desc', label: 'Name: Z to A' }
  ];

  return (
    <div className="sort-dropdown">
      <label htmlFor="sort-select">Sort by:</label>
      <select
        id="sort-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="sort-select"
      >
        {sortOptions.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SortDropdown;
