import React from 'react';
import { FaCheckCircle, FaExclamationCircle, FaSpinner } from 'react-icons/fa';
import './LoadingSpinner.css';

export const LoadingSpinner = ({ message = 'Chargement...' }) => {
  return (
    <div className="spinner-container">
      <div className="spinner"></div>
      <p>{message}</p>
    </div>
  );
};

export const ErrorAlert = ({ message, onClose }) => {
  return (
    <div className="error-alert">
      <div className="error-content">
        <span className="error-icon">⚠️</span>
        <p>{message}</p>
        {onClose && (
          <button className="close-btn" onClick={onClose}>✕</button>
        )}
      </div>
    </div>
  );
};

export const SuccessAlert = ({ message, onClose }) => {
  return (
    <div className="success-alert">
      <div className="success-content">
        <FaCheckCircle className="success-icon" />
        <p>{message}</p>
        {onClose && (
          <button className="close-btn" onClick={onClose}>✕</button>
        )}
      </div>
    </div>
  );
};
