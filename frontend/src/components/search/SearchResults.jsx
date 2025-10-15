import React from 'react';
import ProductGrid from '../product/ProductGrid';
import './SearchResults.css';

const SearchResults = ({ results, totalSize, query }) => {
  return (
    <div className="search-results">
      <div className="results-header">
        <h2>
          {query ? (
            <>Search results for "<span className="query-text">{query}</span>"</>
          ) : (
            'All Products'
          )}
        </h2>
        <p className="results-count">
          {totalSize} {totalSize === 1 ? 'result' : 'results'} found
        </p>
      </div>
      
      <ProductGrid products={results} />
    </div>
  );
};

export default SearchResults;
