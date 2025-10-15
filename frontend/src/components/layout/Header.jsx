import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar';
import useTheme from '../../config/theme.config';
import './Header.css';

const Header = () => {
  const branding = useTheme();
  const navigate = useNavigate();

  const handleSearch = (query) => {
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  if (!branding) return null;

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

        <div className="search-container">
          <SearchBar onSearch={handleSearch} />
        </div>

        <nav className="header-nav">
          {/* Add navigation items if needed */}
        </nav>
      </div>
    </header>
  );
};

export default Header;
