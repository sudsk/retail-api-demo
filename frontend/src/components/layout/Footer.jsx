import React from 'react';
import useTheme from '../../config/theme.config';
import './Footer.css';

const Footer = () => {
  const branding = useTheme();

  if (!branding) return null;

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>{branding.siteName}</h3>
            <p>{branding.tagline}</p>
          </div>

          <div className="footer-section">
            <h4>Demo Information</h4>
            <p>Powered by Google Cloud Vertex AI</p>
            <p>Retail Search & Recommendations</p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} {branding.siteName}. Demo Application.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
