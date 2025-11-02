import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import Header from '../components/layout/Header';
import Navigation from '../components/layout/Navigation';
import Footer from '../components/layout/Footer';
import SearchFilters from '../components/search/SearchFilters';
import ProductGrid from '../components/product/ProductGrid';
import SortDropdown from '../components/search/SortDropdown';
import Pagination from '../components/search/Pagination';
import Loader from '../components/common/Loader';
import ErrorMessage from '../components/common/ErrorMessage';
import useSearch from '../hooks/useSearch';
import categoriesService from '../services/categories.service';
import './CategoryPage.css';

const CategoryPage = () => {
  const { categorySlug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = 10;

  const [sortBy, setSortBy] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({});
  const [categoryName, setCategoryName] = useState('');
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);
  
  const { results, facets, totalSize, loading, error, search } = useSearch();

  // Fetch categories to get the actual category name from slug
  useEffect(() => {
    const fetchCategoryName = async () => {
      try {
        const categories = await categoriesService.getCategories();
        const category = categories.find(cat => cat.slug === categorySlug);
        
        if (category) {
          setCategoryName(category.name);
        } else {
          // Fallback: convert slug to title case
          setCategoryName(
            categorySlug
              .split('-')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ')
          );
        }
      } catch (err) {
        console.error('Failed to fetch categories:', err);
        // Fallback
        setCategoryName(
          categorySlug
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')
        );
      } finally {
        setCategoriesLoaded(true);
      }
    };

    fetchCategoryName();
  }, [categorySlug]);

  useEffect(() => {
    // Don't search until we have the category name
    if (!categoriesLoaded || !categoryName) return;

    const offset = (page - 1) * pageSize;
    
    // Build filter string with category
    const filterParts = [`categories: ANY("${categoryName}")`];
    
    Object.entries(selectedFilters).forEach(([key, values]) => {
      if (values && values.length > 0) {
        const filterValues = values.map(v => `"${v}"`).join(', ');
        filterParts.push(`${key}: ANY(${filterValues})`);
      }
    });
    
    const filterString = filterParts.join(' AND ');

    search({
      query: '',
      pageSize,
      offset,
      orderBy: sortBy,
      filter: filterString
    });
  }, [categoryName, categoriesLoaded, page, sortBy, selectedFilters, search, pageSize]);

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

  if (!categoriesLoaded) {
    return (
      <div className="category-page">
        <Header />
        <Navigation />
        <main className="container page-content">
          <Loader message="Loading category..." />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="category-page">
      <Header />
      <Navigation />
      
      <main className="container page-content">
        <div className="category-header">
          <h1>{categoryName}</h1>
          <p className="category-count">
            {totalSize} {totalSize === 1 ? 'product' : 'products'}
          </p>
        </div>

        {loading && <Loader message="Loading products..." />}
        
        {error && <ErrorMessage message={error} onRetry={() => window.location.reload()} />}
        
        {!loading && !error && (
          <div className="category-layout">
            <aside className="filters-sidebar">
              <SearchFilters
                facets={facets}
                selectedFilters={selectedFilters}
                onFilterChange={handleFilterChange}
              />
            </aside>

            <div className="products-container">
              <div className="products-controls">
                <SortDropdown value={sortBy} onChange={handleSortChange} />
              </div>

              <ProductGrid products={results} />

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

export default CategoryPage;
