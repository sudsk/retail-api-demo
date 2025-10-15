import React from 'react';
import './Loader.css';

const Loader = ({ message = 'Loading...' }) => {
  return (
    <div className="loader-container">
      <div className="loader"></div>
      <p className="loader-message">{message}</p>
    </div>
  );
};

export default Loader;
