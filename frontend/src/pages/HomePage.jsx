import React from 'react';
import Header from '../components/layout/Header';
import Navigation from '../components/layout/Navigation';
import Footer from '../components/layout/Footer';
import RecommendedProducts from '../components/recommendations/RecommendedProducts';
import RecentlyViewedSection from '../components/recommendations/RecentlyViewedSection';
import useTheme from '../config/theme.config';
import './HomePage.css';

const HomePage = () => {
  const branding = useTheme();

  return (
    <div className="home-page">
      <Header />
      <Navigation />
      
      <main className="container page-content">
        {branding && (
          <section className="hero-section">
            <h1>{branding.siteName}</h1>
            <p className="tagline">{branding.tagline}</p>
          </section>
        )}

        <section className="featured-section">
          <RecommendedProducts
            model="recommended_for_you"
            title="Recommended For You"
          />
        </section>

        <section className="recently-viewed-section">
          <RecentlyViewedSection />
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
