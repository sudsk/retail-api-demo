import { useState, useEffect } from 'react';
import productsService from '../services/products.service';

export const useProduct = (productId) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!productId) return;

    const fetchProduct = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await productsService.getProduct(productId);
        setProduct(data);
      } catch (err) {
        setError(err.message);
        console.error('Product fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  return { product, loading, error };
};

export default useProduct;
