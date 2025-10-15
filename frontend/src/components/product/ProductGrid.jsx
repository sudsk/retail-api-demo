import React from 'react';
import ProductCard from './ProductCard';
import './ProductGrid.css';

const ProductGrid = ({ products }) => {
  if (!products || products.length === 0) {
    return (
      <div className="no-products">
        <p>No products found</p>
      </div>
    );
  }

  return (
    <div className="product-grid">
      {products.map((product, index) => (
        <ProductCard key={product.id || index} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
