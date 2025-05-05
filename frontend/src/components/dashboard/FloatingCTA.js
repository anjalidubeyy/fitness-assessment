import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import '../../styles/dashboard/FloatingCTA.css';

const FloatingCTA = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/log-activity');
  };

  return (
    <motion.button
      className="floating-cta"
      onClick={handleClick}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <div className="cta-glow" />
      <FontAwesomeIcon icon={faPlus} className="cta-icon" />
    </motion.button>
  );
};

export default FloatingCTA; 