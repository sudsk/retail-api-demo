import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
};

// Predefined demo users with visitor IDs
export const DEMO_USERS = [
  { id: 'visitor_demo_alice', name: 'Alice (Fashion Shopper)', icon: '👗' },
  { id: 'visitor_demo_bob', name: 'Bob (Tech Enthusiast)', icon: '💻' },
  { id: 'visitor_demo_charlie', name: 'Charlie (Home Improvement)', icon: '🔨' },
  { id: 'visitor_demo_diana', name: 'Diana (Sports & Outdoors)', icon: '⚽' },
  { id: 'visitor_new', name: 'New Visitor', icon: '🆕' }
];

export const UserProvider = ({ children }) => {
  const [visitorId, setVisitorIdState] = useState(null);

  useEffect(() => {
    // Get or create visitor ID
    let id = localStorage.getItem('visitor_id');
    if (!id) {
      id = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('visitor_id', id);
    }
    setVisitorIdState(id);
  }, []);

  const setVisitorId = (newId) => {
    localStorage.setItem('visitor_id', newId);
    setVisitorIdState(newId);
    // Reload page to refresh recommendations
    window.location.reload();
  };

  const generateNewVisitorId = () => {
    const newId = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setVisitorId(newId);
  };

  return (
    <UserContext.Provider value={{ visitorId, setVisitorId, generateNewVisitorId }}>
      {children}
    </UserContext.Provider>
  );
};
