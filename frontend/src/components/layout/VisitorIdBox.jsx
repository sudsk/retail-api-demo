import React, { useState } from 'react';
import { useUser } from '../../context/UserContext';
import './VisitorIdBox.css';

const VisitorIdBox = () => {
  const { visitorId, setVisitorId } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(visitorId || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setVisitorId(inputValue.trim());
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setInputValue(visitorId);
    setIsEditing(false);
  };

  if (!visitorId) return null;

  return (
    <div className="visitor-id-box-simple">
      <label className="visitor-label">Visitor ID:</label>
      
      {!isEditing ? (
        <div className="visitor-display">
          <span className="visitor-value">{visitorId}</span>
          <button 
            onClick={() => setIsEditing(true)}
            className="edit-btn"
            title="Change Visitor ID"
          >
            ✏️
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="visitor-edit-form">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="visitor-input"
            autoFocus
            placeholder="Enter Visitor ID"
          />
          <button type="submit" className="save-btn" title="Save">
            ✓
          </button>
          <button type="button" onClick={handleCancel} className="cancel-btn" title="Cancel">
            ✕
          </button>
        </form>
      )}
    </div>
  );
};

export default VisitorIdBox;
