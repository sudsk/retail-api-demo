import React from 'react';
import { Link } from 'react-router-dom';
import useTheme from '../../config/theme.config';
import './Navigation.css';

const Navigation = () => {
  const branding = useTheme();

  if (!branding?.categories) return null;

  return (
    <nav className="navigation">
      <div className="container">
        <ul className="nav-list">
          {branding.categories.map((category) => (
            <li key={category.slug} className="nav-item">
              <Link to={`/category/${category.slug}`} className="nav-link">
                {category.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;
