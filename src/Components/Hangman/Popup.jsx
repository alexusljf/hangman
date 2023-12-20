import React from 'react';
import './Popup.css';

const Popup = ({ message }) => {
    return (
      <div className="popup">
        <p>{message}</p>
      </div>
    );
  };
export default Popup;
  