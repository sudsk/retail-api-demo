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
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({});
  const [searchTime, setSearchTime] = useState(0);
  
  const { results, facets, totalSize, loading, error, search } = useSearch();

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    executeSearch();
  };

  const executeSearch = () => {
    if (!query.trim()) return;
    
    const startTime = performance.now();
    setActiveQuery(query);
    
    // Build filter string from selected facets
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
    // Auto-search when filters change
    setTimeout(executeSearch, 100);
  };

  const handleClearFilters = () => {
    setSelectedFilters({});
    executeSearch();
  };

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    executeSearch();
  };

  const handleExampleQuery = (exampleQuery) => {
    setQuery(exampleQuery);
    setTimeout(() => {
      const startTime = performance.now();
      setActiveQuery(exampleQuery);
      
      search({
        query: exampleQuery,
        pageSize,
        offset: 0,
        orderBy: sortBy,
        filter: ''
      }).then(() => {
        const endTime = performance.now();
        setSearchTime(Math.round(endTime - startTime));
      });
    }, 100);
  };

  return (
    <div className="search-testing-page">
      <Header />
      
      <main className="container page-content">
        <div className="testing-header">
          <h1>🔍 Search API Testing</h1>
          <p className="subtitle">Test Vertex AI Retail Search API - powered by your catalog data</p>
        </div>

        {/* Search Controls */}
        <div className="search-controls-panel">
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-input-group">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter search query (e.g., 'drill', 'paint', 'screwdriver')"
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
              <SortDropdown value={sortBy} onChange={handleSortChange} />
            </div>

            {Object.keys(selectedFilters).some(key => selectedFilters[key]?.length > 0) && (
              <button onClick={handleClearFilters} className="clear-filters-btn">
                Clear All Filters
              </button>
            )}
          </div>
        </div>

        {/* Search Results Info */}
        {activeQuery && !loading && !error && (
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
                <div className="info-label">Showing</div>
                <div className="info-value">{results.length} of {totalSize}</div>
              </div>
            </div>
          </div>
        )}

        {loading && <Loader message="Searching..." />}
        
        {error && <ErrorMessage message={error} />}
        
        {/* Results Layout with Facets */}
        {!loading && !error && activeQuery && (
          <div className="search-results-layout">
            {facets && facets.length > 0 && (
              <aside className="filters-sidebar">
                <h3>Filters (from API)</h3>
                <p className="filters-hint">Facets returned by Search API</p>
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
            <h2>Test Retail Search API</h2>
            <p>Enter a search query to test search quality, relevance, and performance</p>
            <div className="example-queries">
              <h4>Try these example queries:</h4>
              <div className="query-chips">
                <button onClick={() => handleExampleQuery('drill')} className="query-chip">
                  drill
                </button>
                <button onClick={() => handleExampleQuery('paint')} className="query-chip">
                  paint
                </button>
                <button onClick={() => handleExampleQuery('screwdriver')} className="query-chip">
                  screwdriver
                </button>
                <button onClick={() => handleExampleQuery('hammer')} className="query-chip">
                  hammer
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
