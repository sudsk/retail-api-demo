import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import SearchTestingPage from './pages/SearchTestingPage';
import RecommendationsTestingPage from './pages/RecommendationsTestingPage';
import './App.css';

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<SearchTestingPage />} />
          <Route path="/search" element={<SearchTestingPage />} />
          <Route path="/recommendations" element={<RecommendationsTestingPage />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
