import React, { useState } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import SearchFilters from '../components/search/SearchFilters';
import ProductGrid from '../components/product/ProductGrid';
import SortDropdown from '../components/search/SortDropdown';
import Loader from '../components/common/Loader';
import ErrorMessage from '../components/common/ErrorMessage';
import useSearch from '../hooks/useSearch';
import './SearchTestingPage.css';

const SearchTestingPage = () => {
  const [query, setQuery] = useState('');
  const [activeQuery, setActiveQuery] = useState('');
  const [pageSize, setPageSize] = useState(20);
  const [sortBy, setSortBy] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({});
  const [searchTime, setSearchTime] = useState(0);
  
  const { results, facets, totalSize, loading, error, search } = useSearch();

  const handleSearch = (e) => {
    e.preventDefault();
    executeSearch();
  };

  const executeSearch = () => {
    const startTime = performance.now();
    setActiveQuery(query);
    
    // Build filter string
    const filterParts = [];
    Object.entries(selectedFilters).forEach(([key, values]) => {
      if (values && values.length > 0) {
        const filterValues = values.map(v => `"${v}"`).join(', ');
        filterParts.push(`${key}: ANY(${filterValues})`);
      }
    });
    const filterString = filterParts.join(' AND ');

    search({
      query,
      pageSize,
      offset: 0,
      orderBy: sortBy,
      filter: filterString
    }).then(() => {
      const endTime = performance.now();
      setSearchTime(Math.round(endTime - startTime));
    });
  };

  const handleFilterChange = (facetKey, values) => {
    setSelectedFilters(prev => ({
      ...prev,
      [facetKey]: values
    }));
  };

  const handleClearFilters = () => {
    setSelectedFilters({});
    if (activeQuery) {
      executeSearch();
    }
  };

  return (
    <div className="search-testing-page">
      <Header />
      
      <main className="container page-content">
        <div className="testing-header">
          <h1>🔍 Search API Testing</h1>
          <p className="subtitle">Test Vertex AI Retail Search API capabilities</p>
        </div>

        {/* Search Controls */}
        <div className="search-controls-panel">
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-input-group">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter search query (e.g., 'drill', 'red hoodie', 'wireless mouse')"
                className="search-test-input"
              />
              <button type="submit" className="search-test-button">
                Search
              </button>
            </div>
          </form>

          <div className="search-options">
            <div className="option-group">
              <label>Results per page:</label>
              <select 
                value={pageSize} 
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="option-select"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>

            <div className="option-group">
              <label>Sort by:</label>
              <SortDropdown value={sortBy} onChange={setSortBy} />
            </div>

            {Object.keys(selectedFilters).length > 0 && (
              <button onClick={handleClearFilters} className="clear-filters-btn">
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Search Results Info */}
        {activeQuery && !loading && (
          <div className="search-results-info">
            <div className="info-cards">
              <div className="info-card">
                <div className="info-label">Query</div>
                <div className="info-value">"{activeQuery}"</div>
              </div>
              <div className="info-card">
                <div className="info-label">Total Results</div>
                <div className="info-value">{totalSize.toLocaleString()}</div>
              </div>
              <div className="info-card">
                <div className="info-label">Response Time</div>
                <div className="info-value">{searchTime}ms</div>
              </div>
              <div className="info-card">
                <div className="info-label">Results Shown</div>
                <div className="info-value">{results.length}</div>
              </div>
            </div>
          </div>
        )}

        {loading && <Loader message="Searching..." />}
        
        {error && <ErrorMessage message={error} />}
        
        {/* Results */}
        {!loading && !error && activeQuery && (
          <div className="search-results-layout">
            {facets && facets.length > 0 && (
              <aside className="filters-sidebar">
                <h3>Available Filters (from API)</h3>
                <SearchFilters
                  facets={facets}
                  selectedFilters={selectedFilters}
                  onFilterChange={handleFilterChange}
                />
              </aside>
            )}

            <div className="results-container">
              {results.length > 0 ? (
                <ProductGrid products={results} />
              ) : (
                <div className="no-results">
                  <h3>No results found</h3>
                  <p>Try a different search query or adjust filters</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Initial State */}
        {!activeQuery && !loading && (
          <div className="initial-state">
            <div className="initial-icon">🔍</div>
            <h2>Start Testing Search API</h2>
            <p>Enter a search query above to test the Retail Search API</p>
            <div className="example-queries">
              <h4>Try these example queries:</h4>
              <div className="query-chips">
                <button onClick={() => { setQuery('hoodie'); executeSearch(); }} className="query-chip">
                  hoodie
                </button>
                <button onClick={() => { setQuery('red shirt'); executeSearch(); }} className="query-chip">
                  red shirt
                </button>
                <button onClick={() => { setQuery('wireless'); executeSearch(); }} className="query-chip">
                  wireless
                </button>
                <button onClick={() => { setQuery('notebook'); executeSearch(); }} className="query-chip">
                  notebook
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default SearchTestingPage;
