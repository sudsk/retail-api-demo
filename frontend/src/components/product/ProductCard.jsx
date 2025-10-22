import React from 'react';
import { Link } from 'react-router-dom';
import ProductImage from './ProductImage';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const productData = product.product || product;
  
  const formatPrice = (priceInfo) => {
    if (!priceInfo) return 'Price not available';
    const { currency_code, price, original_price } = priceInfo;
    const symbol = currency_code === 'USD' ? '$' : currency_code;
    
    return (
      <div className="price-container">
        <span className="price">{symbol}{price?.toFixed(2)}</span>
        {original_price && original_price > price && (
          <span className="original-price">{symbol}{original_price.toFixed(2)}</span>
        )}
      </div>
    );
  };

  return (
    <Link to={`/product/${productData.id}`} className="product-card">
      <ProductImage 
        images={productData.images} 
        alt={productData.title}
        className="product-card-image"
      />
      
      <div className="product-card-content">
        <h3 className="product-title">{productData.title}</h3>
        
        {productData.brands && productData.brands.length > 0 && (
          <p className="product-brand">{productData.brands[0]}</p>
        )}
        
        {formatPrice(productData.price_info)}
        
        {productData.availability && (
          <span className={`availability ${productData.availability.toLowerCase()}`}>
            {productData.availability.replace('_', ' ')}
          </span>
        )}
      </div>
    </Link>
  );
};

export default ProductCard;
