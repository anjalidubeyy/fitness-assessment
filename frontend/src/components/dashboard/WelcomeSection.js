import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBolt } from '@fortawesome/free-solid-svg-icons';
import API from '../../api/api';
import '../../styles/dashboard/WelcomeSection.css';

const motivationalQuotes = [
  "Every rep counts. Let's get stronger!",
  "Your future self will thank you for this.",
  "Push your limits, break your boundaries.",
  "The only bad workout is the one that didn't happen.",
  "Your body can stand almost anything. It's your mind you have to convince."
];

const calculateXP = (fitnessData) => {
  if (!Array.isArray(fitnessData) || fitnessData.length === 0) {
    return 0;
  }

  return fitnessData.reduce((total, entry) => {
    let xp = 0;

    if (entry.type === 'workout') {
      // Base XP for workout
      xp += 100;
      
      // Bonus XP for duration (10 XP per minute)
      if (entry.duration) {
        xp += entry.duration * 10;
      }
      
      // Bonus XP for intensity (20 XP per intensity level)
      if (entry.intensity) {
        xp += entry.intensity * 20;
      }
    } else if (entry.type === 'sleep') {
      // Base XP for logging sleep
      xp += 50;
      
      // Bonus XP for sleep duration (5 XP per hour)
      if (entry.sleepDuration) {
        xp += Math.floor(entry.sleepDuration * 5);
      }
      
      // Bonus XP for sleep quality (10 XP per quality level)
      if (entry.sleepQuality) {
        xp += entry.sleepQuality * 10;
      }
    }
    
    // Bonus XP for completing notes
    if (entry.notes && entry.notes.length > 0) {
      xp += 25;
    }
    
    return total + xp;
  }, 0);
};

const calculateWarriorLevel = (xp) => {
  if (typeof xp !== 'number' || isNaN(xp)) {
    return 1;
  }
  // Level calculation formula: level = 1 + sqrt(xp/1000)
  return Math.max(1, Math.floor(1 + Math.sqrt(xp/1000)));
};

const getWarriorTitle = (level) => {
  if (typeof level !== 'number' || isNaN(level)) {
    return "Novice Warrior";
  }
  if (level < 3) return "Novice Warrior";
  if (level < 5) return "Apprentice Warrior";
  if (level < 8) return "Intermediate Warrior";
  if (level < 12) return "Advanced Warrior";
  if (level < 15) return "Elite Warrior";
  return "Legendary Warrior";
};

const WelcomeSection = ({ user }) => {
  const [quote, setQuote] = useState(motivationalQuotes[0]);
  const [fitnessLevel, setFitnessLevel] = useState("Novice Warrior");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuote(motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchFitnessLevel = async () => {
      try {
        const response = await API.get('/fitness');
        const fitnessData = response.data;
        
        const totalXP = calculateXP(fitnessData);
        const level = calculateWarriorLevel(totalXP);
        const title = getWarriorTitle(level);
        
        setFitnessLevel(title);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching fitness level:', err);
        setLoading(false);
      }
    };

    fetchFitnessLevel();
  }, []);

  return (
    <motion.div 
      className="welcome-section"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="welcome-content">
        <div className="avatar-container">
          <motion.img
            src={user.profile?.avatar || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Ccircle cx='12' cy='7' r='5' fill='%23718096'/%3E%3Cpath d='M2 21v-2a7 7 0 0 1 7-7h6a7 7 0 0 1 7 7v2' fill='%23718096'/%3E%3C/svg%3E"}
            alt="Profile"
            className="profile-avatar"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          />
          <div className="avatar-glow"></div>
        </div>
        
        <div className="welcome-text">
          <h1>Hi, {user.name}! <span className="wave">👋</span></h1>
          <div className="fitness-level">
            <FontAwesomeIcon icon={faBolt} className="fitness-icon" />
            <span>{loading ? "Loading..." : fitnessLevel}</span>
          </div>
          <motion.p 
            className="motivational-quote"
            key={quote}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
          >
            {quote}
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
};

export default WelcomeSection; 