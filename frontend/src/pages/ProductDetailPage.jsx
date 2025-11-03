import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import ProductImage from '../components/product/ProductImage';
import Loader from '../components/common/Loader';
import ErrorMessage from '../components/common/ErrorMessage';
import useProduct from '../hooks/useProduct';
import './ProductDetailPage.css';

const ProductDetailPage = () => {
  const { productId } = useParams();
  const { product, loading, error } = useProduct(productId);

  const formatPrice = (priceInfo) => {
    if (!priceInfo) return 'Price not available';
    const { currency_code, price, original_price } = priceInfo;
    const symbol = currency_code === 'USD' ? '
 : currency_code;
    
    return (
      <div className="product-price">
        <span className="current-price">{symbol}{price?.toFixed(2)}</span>
        {original_price && original_price > price && (
          <>
            <span className="original-price">{symbol}{original_price.toFixed(2)}</span>
            <span className="discount">
              Save {symbol}{(original_price - price).toFixed(2)}
            </span>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="product-detail-page">
      <Header />
      
      <main className="container page-content">
        <div className="breadcrumb">
          <Link to="/">← Back to Search</Link>
        </div>

        {loading && <Loader message="Loading product..." />}
        
        {error && <ErrorMessage message={error} />}
        
        {product && !loading && !error && (
          <div className="product-detail">
            <div className="product-images">
              <ProductImage 
                images={product.images} 
                alt={product.title}
                className="main-product-image"
              />
            </div>

            <div className="product-info">
              <h1 className="product-name">{product.title}</h1>
              
              {product.brands && product.brands.length > 0 && (
                <p className="product-brand">Brand: {product.brands[0]}</p>
              )}

              {formatPrice(product.price_info)}

              {product.availability && (
                <div className={`product-availability ${String(product.availability).toLowerCase()}`}>
                  <span className="availability-label">Availability:</span>
                  <span className="availability-status">
                    {String(product.availability).replace(/_/g, ' ')}
                  </span>
                </div>
              )}

              {product.description && (
                <div className="product-description">
                  <h2>Description</h2>
                  <p>{product.description}</p>
                </div>
              )}

              {product.categories && product.categories.length > 0 && (
                <div className="product-categories">
                  <h3>Categories:</h3>
                  <div className="category-tags">
                    {product.categories.map((category, index) => (
                      <span key={index} className="category-tag">{category}</span>
                    ))}
                  </div>
                </div>
              )}

              {product.attributes && Object.keys(product.attributes).length > 0 && (
                <div className="product-attributes">
                  <h3>Specifications</h3>
                  <table className="attributes-table">
                    <tbody>
                      {Object.entries(product.attributes).map(([key, values]) => (
                        <tr key={key}>
                          <td className="attribute-name">{key}</td>
                          <td className="attribute-value">
                            {Array.isArray(values) ? values.join(', ') : values}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="product-actions">
                <Link to="/recommendations" className="test-recommendations-btn">
                  ⭐ Test this product in Recommendations
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetailPage;
