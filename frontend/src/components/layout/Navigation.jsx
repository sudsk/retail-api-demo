import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import categoriesService from '../../services/categories.service';
import './Navigation.css';

const Navigation = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoriesService.getCategories();
        setCategories(data || []);
      } catch (error) {
        console.error('Failed to load categories:', error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <nav className="navigation">
        <div className="container">
          <ul className="nav-list">
            <li className="nav-item">
              <span className="nav-link">Loading categories...</span>
            </li>
          </ul>
        </div>
      </nav>
    );
  }

  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <nav className="navigation">
      <div className="container">
        <ul className="nav-list">
          {categories.map((category) => (
            <li key={category.slug} className="nav-item">
              <Link to={`/category/${category.slug}`} className="nav-link">
                {category.name}
                {category.count && (
                  <span className="category-count"> ({category.count})</span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;
