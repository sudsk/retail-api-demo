import React, { useState } from 'react';
import './ProductImage.css';

const ProductImage = ({ images, alt, className = '' }) => {
  const [imageError, setImageError] = useState(false);
  
  const imageUrl = images && images.length > 0 ? images[0].uri : null;
  
  const handleImageError = () => {
    setImageError(true);
  };

  if (!imageUrl || imageError) {
    return (
      <div className={`product-image-placeholder ${className}`}>
        <span>No Image</span>
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={alt}
      className={`product-image ${className}`}
      onError={handleImageError}
      loading="lazy"
    />
  );
};

export default ProductImage;
