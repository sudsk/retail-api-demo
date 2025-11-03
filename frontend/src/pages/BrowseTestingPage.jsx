import React, { useState } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import ProductGrid from '../components/product/ProductGrid';
import SearchFilters from '../components/search/SearchFilters';
import Loader from '../components/common/Loader';
import ErrorMessage from '../components/common/ErrorMessage';
import useSearch from '../hooks/useSearch';
import './BrowseTestingPage.css';

const BrowseTestingPage = () => {
  const [pageSize, setPageSize] = useState(20);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [category, setCategory] = useState('');
  
  const { results, facets, totalSize, loading, error, search } = useSearch();

  const executeBrowse = () => {
    // Build filter string from selected facets
    const filterParts = [];
    
    if (category) {
      filterParts.push(`categories: ANY("${category}")`);
    }
    
    Object.entries(selectedFilters).forEach(([key, values]) => {
      if (values && values.length > 0) {
        const filterValues = values.map(v => `"${v}"`).join(', ');
        filterParts.push(`${key}: ANY(${filterValues})`);
      }
    });
    
    const filterString = filterParts.join(' AND ');

    search({
      query: '', // Empty query for browse
      pageSize,
      offset: 0,
      filter: filterString
    });
  };

  const handleFilterChange = (facetKey, values) => {
    setSelectedFilters(prev => ({
      ...prev,
      [facetKey]: values
    }));
    setTimeout(executeBrowse, 100);
  };

  const handleCategorySelect = (cat) => {
    setCategory(cat);
    setSelectedFilters({});
    setTimeout(() => {
      search({
        query: '',
        pageSize,
        offset: 0,
        filter: `categories: ANY("${cat}")`
      });
    }, 100);
  };

  const handleClearFilters = () => {
    setSelectedFilters({});
    setCategory('');
    executeBrowse();
  };

  React.useEffect(() => {
    // Initial load - browse all products
    search({
      query: '',
      pageSize,
      offset: 0,
      filter: ''
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  return (
    <div className="browse-testing-page">
      <Header />
      
      <main className="container page-content">
        <div className="testing-header">
          <h1>📂 Browse Testing</h1>
          <p className="subtitle">Browse product catalog by category - filters powered by facets</p>
        </div>

        {/* Browse Controls */}
        <div className="browse-controls-panel">
          <div className="category-selector">
            <label>Browse by Category:</label>
            <div className="category-buttons">
              <button 
                onClick={() => handleCategorySelect('')}
                className={`category-btn ${category === '' ? 'active' : ''}`}
              >
                All Products
              </button>
              <button 
                onClick={() => handleCategorySelect('Tools & Equipment')}
                className={`category-btn ${category === 'Tools & Equipment' ? 'active' : ''}`}
              >
                Tools & Equipment
              </button>
              <button 
                onClick={() => handleCategorySelect('Building Materials')}
                className={`category-btn ${category === 'Building Materials' ? 'active' : ''}`}
              >
                Building Materials
              </button>
              <button 
                onClick={() => handleCategorySelect('Paint & Decorating')}
                className={`category-btn ${category === 'Paint & Decorating' ? 'active' : ''}`}
              >
                Paint & Decorating
              </button>
            </div>
          </div>

          <div className="browse-options">
            <div className="option-group">
              <label>Results per page:</label>
              <select 
                value={pageSize} 
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="option-select"
              >
                <option value={20}>20</option>
                <option value={40}>40</option>
                <option value={60}>60</option>
              </select>
            </div>

            {Object.keys(selectedFilters).some(key => selectedFilters[key]?.length > 0) && (
              <button onClick={handleClearFilters} className="clear-filters-btn">
                Clear All Filters
              </button>
            )}
          </div>
        </div>

        {/* Browse Results Info */}
        {!loading && !error && (
          <div className="browse-results-info">
            <div className="info-cards">
              <div className="info-card">
                <div className="info-label">Category</div>
                <div className="info-value">{category || 'All'}</div>
              </div>
              <div className="info-card">
                <div className="info-label">Total Products</div>
                <div className="info-value">{totalSize.toLocaleString()}</div>
              </div>
              <div className="info-card">
                <div className="info-label">Showing</div>
                <div className="info-value">{results.length} products</div>
              </div>
            </div>
          </div>
        )}

        {loading && <Loader message="Loading products..." />}
        
        {error && <ErrorMessage message={error} />}
        
        {/* Results Layout with Facets */}
        {!loading && !error && (
          <div className="browse-results-layout">
            {facets && facets.length > 0 && (
              <aside className="filters-sidebar">
                <h3>Filters</h3>
                <p className="filters-hint">Refine your browse results</p>
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
                  <h3>No products found</h3>
                  <p>Try selecting a different category or adjusting filters</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default BrowseTestingPage;
