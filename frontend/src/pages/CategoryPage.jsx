import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import Header from '../components/layout/Header';
import Navigation from '../components/layout/Navigation';
import Footer from '../components/layout/Footer';
import ProductGrid from '../components/product/ProductGrid';
import Loader from '../components/common/Loader';
import ErrorMessage from '../components/common/ErrorMessage';
import categoriesService from '../services/categories.service';
import productsService from '../services/products.service';
import './CategoryPage.css';

const CategoryPage = () => {
  const { categorySlug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = 20;

  const [products, setProducts] = useState([]);
  const [totalSize, setTotalSize] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoryName, setCategoryName] = useState('');
  const [nextPageToken, setNextPageToken] = useState('');
  const [pageTokens, setPageTokens] = useState(['']); // Track page tokens for pagination

  // Fetch category name from slug
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
        setCategoryName(
          categorySlug
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')
        );
      }
    };

    fetchCategoryName();
  }, [categorySlug]);

  // Fetch products using List Products API
  useEffect(() => {
    if (!categoryName) return;

    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        // Build filter for category - try different filter formats
        // Try format 1: categories="Apparel" 
        const filter = `categories="${categoryName}"`;
        
        console.log('Fetching with filter:', filter);
        // Get page token for current page
        const pageToken = pageTokens[page - 1] || '';

        const data = await productsService.listProducts({
          pageSize,
          pageToken,
          filter
        });

        setProducts(data.products || []);
        setNextPageToken(data.next_page_token || '');
        
        // Store next page token if we got one
        if (data.next_page_token && !pageTokens[page]) {
          setPageTokens(prev => {
            const newTokens = [...prev];
            newTokens[page] = data.next_page_token;
            return newTokens;
          });
        }

        // Estimate total size (List API doesn't return total count)
        // We'll just show if there's a next page
        if (data.next_page_token) {
          setTotalSize(page * pageSize + 1); // At least one more page
        } else {
          setTotalSize((page - 1) * pageSize + (data.products?.length || 0));
        }

      } catch (err) {
        console.error('Failed to fetch products:', err);
        setError(err.message || 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryName, page, pageSize, pageTokens]);

  const handlePageChange = (newPage) => {
    searchParams.set('page', newPage.toString());
    setSearchParams(searchParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!categoryName) {
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
            {products.length} {products.length === 1 ? 'product' : 'products'} on this page
            {nextPageToken && ' (more available)'}
          </p>
        </div>

        {loading && <Loader message="Loading products..." />}
        
        {error && <ErrorMessage message={error} onRetry={() => window.location.reload()} />}
        
        {!loading && !error && (
          <div className="category-layout">
            <div className="products-container" style={{ gridColumn: '1 / -1' }}>
              <ProductGrid products={products} />

              {/* Simple pagination */}
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
                {page > 1 && (
                  <button 
                    onClick={() => handlePageChange(page - 1)}
                    className="pagination-button"
                    style={{ padding: '0.75rem 1.5rem', cursor: 'pointer' }}
                  >
                    Previous
                  </button>
                )}
                
                <span style={{ padding: '0.75rem 1.5rem' }}>Page {page}</span>
                
                {nextPageToken && (
                  <button 
                    onClick={() => handlePageChange(page + 1)}
                    className="pagination-button"
                    style={{ padding: '0.75rem 1.5rem', cursor: 'pointer' }}
                  >
                    Next
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default CategoryPage;
