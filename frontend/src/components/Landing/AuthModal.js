import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AuthModal.css';

const AuthModal = ({ onClose }) => {
  const navigate = useNavigate();

  return (
    <div className="auth-modal">
      <div className="auth-box">
        <h2>Welcome to FAT</h2>
        <button onClick={() => { onClose(); navigate('/signup'); }}>Sign Up</button>
        <button onClick={() => { onClose(); navigate('/login'); }}>Log In</button>
        <button className="close-btn" onClick={onClose}>✖</button>
      </div>
    </div>
  );
};

export default AuthModal;
