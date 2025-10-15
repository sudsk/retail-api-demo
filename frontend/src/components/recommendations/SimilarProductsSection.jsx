import React from 'react';
import RecommendedProducts from './RecommendedProducts';

const SimilarProductsSection = ({ productId }) => {
  return (
    <RecommendedProducts
      model="similar_items"
      productId={productId}
      title="Similar Products"
    />
  );
};

export default SimilarProductsSection;
