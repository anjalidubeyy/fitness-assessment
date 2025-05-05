import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaBrain } from 'react-icons/fa';
import API from '../../api/api';
import '../../styles/dashboard/SmartFitnessCoach.css';

const SmartFitnessCoach = ({ profileData }) => {
  console.log('SmartFitnessCoach rendering with profileData:', profileData);
  
  const [advice, setAdvice] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('SmartFitnessCoach mounted');
    return () => console.log('SmartFitnessCoach unmounted');
  }, []);

  // Default values if profile data is not available
  const defaultProfile = {
    age: 25,
    gender: 'unspecified',
    goal: 'general fitness'
  };

  const getAdvice = async () => {
    console.log('Getting advice with profile:', { ...defaultProfile, ...profileData });
    setLoading(true);
    setError(null);
    try {
      const response = await API.post('/ai/advice', {
        ...defaultProfile,
        ...profileData
      });
      console.log('Advice received:', response.data);
      setAdvice(response.data.advice);
    } catch (err) {
      console.error('Error fetching AI advice:', err);
      setError('Could not generate advice right now. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="smart-fitness-coach"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="coach-header">
        <FaBrain className="brain-icon" />
        <h2>Smart Fitness Coach</h2>
      </div>

      <button
        className={`get-advice-btn ${loading ? 'loading' : ''}`}
        onClick={getAdvice}
        disabled={loading}
      >
        {loading ? (
          <div className="loading-spinner" />
        ) : (
          'Get Smart Fitness Advice'
        )}
      </button>

      {error && (
        <motion.div
          className="error-message"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {error}
        </motion.div>
      )}

      {advice && !error && (
        <motion.div
          className="advice-container"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <p>{advice}</p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default SmartFitnessCoach; 