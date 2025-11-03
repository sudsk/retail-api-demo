import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import VisitorIdBox from './VisitorIdBox';
import useTheme from '../../config/theme.config';
import './Header.css';

const Header = () => {
  const branding = useTheme();
  const location = useLocation();

  if (!branding) return null;

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path === '/search' && (location.pathname === '/' || location.pathname === '/search')) return true;
    return location.pathname.startsWith(path) && path !== '/';
  };

  return (
    <header className="header">
      <div className="container header-content">
        <Link to="/" className="logo">
          {branding.logo?.url ? (
            <img src={branding.logo.url} alt={branding.logo.alt} />
          ) : (
            <h1>{branding.siteName}</h1>
          )}
        </Link>

        <nav className="main-nav">
          <Link 
            to="/search" 
            className={`nav-tab ${isActive('/search') ? 'active' : ''}`}
          >
            🔍 Search Testing
          </Link>
          <Link 
            to="/recommendations" 
            className={`nav-tab ${isActive('/recommendations') ? 'active' : ''}`}
          >
            ⭐ Recommendations
          </Link>
        </nav>

        <div className="header-actions">
          <VisitorIdBox />
        </div>
      </div>
    </header>
  );
};

export default Header;
