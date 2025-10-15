import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [visitorId, setVisitorId] = useState(null);

  useEffect(() => {
    // Get or create visitor ID
    let id = localStorage.getItem('visitor_id');
    if (!id) {
      id = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('visitor_id', id);
    }
    setVisitorId(id);
  }, []);

  return (
    <UserContext.Provider value={{ visitorId }}>
      {children}
    </UserContext.Provider>
  );
};
