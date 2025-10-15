import React from 'react';
import RecommendedProducts from './RecommendedProducts';

const AlsoBoughtSection = ({ productId }) => {
  return (
    <RecommendedProducts
      model="frequently_bought_together"
      productId={productId}
      title="Frequently Bought Together"
    />
  );
};

export default AlsoBoughtSection;
