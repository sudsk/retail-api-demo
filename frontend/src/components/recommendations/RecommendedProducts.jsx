import React, { useEffect } from 'react';
import useRecommendations from '../../hooks/useRecommendations';
import ProductCard from '../product/ProductCard';
import Loader from '../common/Loader';
import './RecommendedProducts.css';

const RecommendedProducts = ({ model, productId = null, title }) => {
  const { recommendations, loading, getRecommendations } = useRecommendations();

  useEffect(() => {
    getRecommendations({
      model,
      productId,
      pageSize: 6
    });
  }, [model, productId, getRecommendations]);

  if (loading) {
    return <Loader message="Loading recommendations..." />;
  }

  if (!recommendations || recommendations.length === 0) {
    return null;
  }

  return (
    <div className="recommended-products">
      <h2 className="recommendations-title">{title}</h2>
      <div className="recommendations-grid">
        {recommendations.map((item, index) => (
          <ProductCard key={item.id || index} product={item} />
        ))}
      </div>
    </div>
  );
};

export default RecommendedProducts;
