import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../components/layout/Header';
import Navigation from '../components/layout/Navigation';
import Footer from '../components/layout/Footer';
import SearchFilters from '../components/search/SearchFilters';
import SearchResults from '../components/search/SearchResults';
import SortDropdown from '../components/search/SortDropdown';
import Pagination from '../components/search/Pagination';
import Loader from '../components/common/Loader';
import ErrorMessage from '../components/common/ErrorMessage';
import useSearch from '../hooks/useSearch';
import './SearchResultsPage.css';

const SearchResultsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = 20;

  const [sortBy, setSortBy] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({});
  
  const { results, facets, totalSize, loading, error, search } = useSearch();

  useEffect(() => {
    const offset = (page - 1) * pageSize;
    
    // Build filter string from selected filters
    const filterParts = [];
    Object.entries(selectedFilters).forEach(([key, values]) => {
      if (values && values.length > 0) {
        const filterValues = values.map(v => `"${v}"`).join(' OR ');
        filterParts.push(`${key}: ${filterValues}`);
      }
    });
    const filterString = filterParts.join(' AND ');

    search({
      query,
      pageSize,
      offset,
      orderBy: sortBy,
      filter: filterString
    });
  }, [query, page, sortBy, selectedFilters, search, pageSize]);

  const handlePageChange = (newPage) => {
    searchParams.set('page', newPage.toString());
    setSearchParams(searchParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    searchParams.set('page', '1');
    setSearchParams(searchParams);
  };

  const handleFilterChange = (facetKey, values) => {
    setSelectedFilters(prev => ({
      ...prev,
      [facetKey]: values
    }));
    searchParams.set('page', '1');
    setSearchParams(searchParams);
  };

  return (
    <div className="search-results-page">
      <Header />
      <Navigation />
      
      <main className="container page-content">
        {loading && <Loader message="Searching..." />}
        
        {error && <ErrorMessage message={error} onRetry={() => window.location.reload()} />}
        
        {!loading && !error && (
          <div className="search-layout">
            <aside className="filters-sidebar">
              <SearchFilters
                facets={facets}
                selectedFilters={selectedFilters}
                onFilterChange={handleFilterChange}
              />
            </aside>

            <div className="results-container">
              <div className="results-controls">
                <SortDropdown value={sortBy} onChange={handleSortChange} />
              </div>

              <SearchResults
                results={results}
                totalSize={totalSize}
                query={query}
              />

              <Pagination
                currentPage={page}
                totalSize={totalSize}
                pageSize={pageSize}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default SearchResultsPage;
