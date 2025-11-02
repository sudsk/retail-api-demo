import React, { useState, useRef, useEffect } from 'react';
import { useUser, DEMO_USERS } from '../../context/UserContext';
import './VisitorIdBox.css';

const VisitorIdBox = () => {
  const { visitorId, setVisitorId, generateNewVisitorId } = useUser();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [customId, setCustomId] = useState('');
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getCurrentUserName = () => {
    const demoUser = DEMO_USERS.find(user => user.id === visitorId);
    return demoUser ? demoUser.name : 'Current User';
  };

  const getCurrentUserIcon = () => {
    const demoUser = DEMO_USERS.find(user => user.id === visitorId);
    return demoUser ? demoUser.icon : '👤';
  };

  const handleSelectUser = (userId) => {
    setVisitorId(userId);
    setShowDropdown(false);
  };

  const handleCustomIdSubmit = (e) => {
    e.preventDefault();
    if (customId.trim()) {
      setVisitorId(customId.trim());
      setShowEditModal(false);
      setCustomId('');
    }
  };

  if (!visitorId) return null;

  return (
    <div className="visitor-id-box" ref={dropdownRef}>
      <button 
        className="visitor-id-button"
        onClick={() => setShowDropdown(!showDropdown)}
        title="Change visitor for demo"
      >
        <span className="visitor-icon">{getCurrentUserIcon()}</span>
        <span className="visitor-name">{getCurrentUserName()}</span>
        <span className="dropdown-arrow">▼</span>
      </button>

      {showDropdown && (
        <div className="visitor-dropdown">
          <div className="dropdown-header">
            <strong>Demo Users</strong>
            <span className="dropdown-subtitle">Switch to see different recommendations</span>
          </div>
          
          {DEMO_USERS.map(user => (
            <button
              key={user.id}
              className={`dropdown-item ${user.id === visitorId ? 'active' : ''}`}
              onClick={() => handleSelectUser(user.id)}
            >
              <span className="item-icon">{user.icon}</span>
              <span className="item-name">{user.name}</span>
              {user.id === visitorId && <span className="check-mark">✓</span>}
            </button>
          ))}

          <div className="dropdown-divider"></div>

          <button
            className="dropdown-item action-item"
            onClick={() => {
              generateNewVisitorId();
              setShowDropdown(false);
            }}
          >
            <span className="item-icon">🔄</span>
            <span className="item-name">Generate Random ID</span>
          </button>

          <button
            className="dropdown-item action-item"
            onClick={() => {
              setShowEditModal(true);
              setShowDropdown(false);
            }}
          >
            <span className="item-icon">✏️</span>
            <span className="item-name">Enter Custom ID</span>
          </button>

          <div className="dropdown-footer">
            <small>Current ID: {visitorId}</small>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Enter Custom Visitor ID</h3>
            <form onSubmit={handleCustomIdSubmit}>
              <input
                type="text"
                value={customId}
                onChange={(e) => setCustomId(e.target.value)}
                placeholder="visitor_custom_123"
                className="custom-id-input"
                autoFocus
              />
              <div className="modal-actions">
                <button type="submit" className="btn-primary">
                  Apply
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowEditModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
            <p className="modal-hint">
              Enter a visitor ID from your uploaded user events data
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default VisitorIdBox;
