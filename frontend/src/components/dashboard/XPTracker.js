import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrophy } from '@fortawesome/free-solid-svg-icons';
import API from '../../api/api';
import '../../styles/dashboard/XPTracker.css';

const calculateXP = (fitnessData) => {
  if (!Array.isArray(fitnessData) || fitnessData.length === 0) {
    return 0;
  }

  const totalXP = fitnessData.reduce((total, entry) => {
    let xp = 0;

    if (entry.type === 'workout') {
      // Base XP for workout
      xp += 100;
      
      // Bonus XP for duration (10 XP per minute)
      const duration = Math.max(0, Math.floor(parseFloat(entry.duration) || 0));
      xp += duration * 10;
      
      // Bonus XP for intensity (20 XP per intensity level)
      const intensity = Math.max(0, Math.floor(parseFloat(entry.intensity) || 0));
      xp += intensity * 20;
    } else if (entry.type === 'sleep') {
      // Base XP for logging sleep
      xp += 50;
      
      // Bonus XP for sleep duration (5 XP per hour)
      const sleepDuration = Math.max(0, Math.floor(parseFloat(entry.sleepDuration) || 0));
      xp += sleepDuration * 5;
      
      // Bonus XP for sleep quality (10 XP per quality level)
      const sleepQuality = Math.max(0, Math.floor(parseFloat(entry.sleepQuality) || 0));
      xp += sleepQuality * 10;
    }
    
    // Bonus XP for completing notes
    if (entry.notes && entry.notes.length > 0) {
      xp += 25;
    }
    
    return total + xp;
  }, 0);

  return Math.max(0, totalXP);
};

const calculateWarriorLevel = (xp) => {
  // Ensure xp is a valid number and non-negative
  const numXP = Math.max(0, Math.floor(parseFloat(xp) || 0));
  
  // Level calculation formula: level = 1 + sqrt(xp/1000)
  return Math.max(1, Math.floor(1 + Math.sqrt(numXP/1000)));
};

const getWarriorTitle = (level) => {
  // Ensure level is a valid number and at least 1
  const numLevel = Math.max(1, Math.floor(parseFloat(level) || 1));
  
  if (numLevel < 3) return "Novice Warrior";
  if (numLevel < 5) return "Apprentice Warrior";
  if (numLevel < 8) return "Intermediate Warrior";
  if (numLevel < 12) return "Advanced Warrior";
  if (numLevel < 15) return "Elite Warrior";
  return "Legendary Warrior";
};

const XPTracker = () => {
  const [stats, setStats] = useState({
    currentLevel: 1,
    currentXP: 0,
    xpToNextLevel: 1000,
    currentLevelXP: 0,
    levelTitle: "Novice Warrior"
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await API.get('/fitness');
        const fitnessData = response.data;

        // Calculate XP and level
        const totalXP = calculateXP(fitnessData);
        console.log('Total XP:', totalXP);
        
        const level = calculateWarriorLevel(totalXP);
        console.log('Calculated Level:', level);
        
        const title = getWarriorTitle(level);
        console.log('Warrior Title:', title);
        
        // Calculate XP needed for next level
        const currentLevelXP = Math.pow(Math.max(1, level - 1), 2) * 1000;
        const nextLevelXP = Math.pow(level, 2) * 1000;
        
        console.log('Current Level XP:', currentLevelXP);
        console.log('Next Level XP:', nextLevelXP);
        
        setStats({
          currentLevel: level,
          currentXP: totalXP,
          xpToNextLevel: nextLevelXP,
          currentLevelXP: currentLevelXP,
          levelTitle: title
        });
        setLoading(false);
      } catch (err) {
        console.error('Error fetching fitness data:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  // Calculate progress percentage for current level
  const levelProgress = Math.min(100, Math.max(0, 
    ((stats.currentXP - stats.currentLevelXP) / 
    (stats.xpToNextLevel - stats.currentLevelXP)) * 100
  ));

  return (
    <motion.div
      className="xp-tracker"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="xp-header">
        <FontAwesomeIcon icon={faTrophy} className="trophy-icon" />
        <h3>Level {Math.max(1, stats.currentLevel)} - {stats.levelTitle}</h3>
      </div>

      <div className="xp-progress">
        <div className="xp-bar-container">
          <motion.div
            className="xp-bar-fill"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, Math.max(0, levelProgress))}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
          <div className="xp-text">
            {Math.floor(stats.currentXP).toLocaleString()} / {Math.floor(stats.xpToNextLevel).toLocaleString()} XP
          </div>
        </div>
      </div>

      <motion.button
        className="milestones-button"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        View Milestones
      </motion.button>
    </motion.div>
  );
};

export default XPTracker; 