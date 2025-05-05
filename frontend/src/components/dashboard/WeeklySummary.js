import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faDumbbell,
  faFire,
  faBed,
  faChartLine
} from '@fortawesome/free-solid-svg-icons';
import API from '../../api/api';
import '../../styles/dashboard/WeeklySummary.css';

// Calculate calories burned based on duration and intensity
const calculateCalories = (entry) => {
  if (entry.type !== 'workout' || !entry.duration || !entry.intensity) {
    return 0;
  }
  
  // Base calories per minute for moderate intensity (level 5)
  const baseCaloriesPerMinute = 7;
  
  // Adjust calories based on intensity (1-10 scale)
  const intensityMultiplier = 0.8 + (entry.intensity * 0.04); // ranges from 0.84 to 1.2
  
  return Math.round(entry.duration * baseCaloriesPerMinute * intensityMultiplier);
};

const WeeklySummary = () => {
  const [stats, setStats] = useState({
    totalWorkouts: 0,
    caloriesBurned: 0,
    avgSleepHours: 0,
    progressScore: 0,
    warriorTitle: "Novice Warrior"
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await API.get('/fitness');
        const fitnessData = response.data;

        // Calculate statistics
        const workouts = fitnessData.filter(entry => entry.type === 'workout');
        const sleepEntries = fitnessData.filter(entry => entry.type === 'sleep');
        
        const totalWorkouts = workouts.length;
        const caloriesBurned = workouts.reduce((sum, entry) => sum + calculateCalories(entry), 0);
        
        // Calculate average sleep hours
        let avgSleepHours = 0;
        if (sleepEntries.length > 0) {
          const totalSleepHours = sleepEntries.reduce((sum, entry) => {
            const duration = parseFloat(entry.sleepDuration) || 0;
            return sum + duration;
          }, 0);
          avgSleepHours = parseFloat((totalSleepHours / sleepEntries.length).toFixed(1));
        }
        
        // Calculate progress score (0-100)
        const progressScore = Math.min(
          Math.round(
            (totalWorkouts * 10) + // Weight for number of workouts
            (caloriesBurned / 100) + // Weight for calories burned
            (avgSleepHours * 5) // Weight for sleep duration
          ),
          100
        );

        setStats({
          totalWorkouts,
          caloriesBurned,
          avgSleepHours,
          progressScore,
          warriorTitle: "Fitness Warrior"
        });
        setLoading(false);
      } catch (err) {
        console.error('Error fetching stats:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Total Workouts',
      value: stats.totalWorkouts,
      icon: faDumbbell,
      color: '#00fff2'
    },
    {
      title: 'Calories Burned',
      value: stats.caloriesBurned,
      icon: faFire,
      color: '#ff00ff'
    },
    {
      title: 'Avg Sleep Hours',
      value: stats.avgSleepHours,
      icon: faBed,
      color: '#9933ff',
      hideXP: true
    },
    {
      title: 'Progress Score',
      value: stats.progressScore,
      icon: faChartLine,
      color: '#00ff00'
    }
  ];

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

  return (
    <div className="weekly-summary">
      <div className="warrior-info">
        <h2>{stats.warriorTitle}</h2>
      </div>
      <div className="stats-grid">
        {statCards.map((card, index) => (
          <motion.div
            key={card.title}
            className="stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="stat-icon" style={{ backgroundColor: card.color }}>
              <FontAwesomeIcon icon={card.icon} />
            </div>
            <div className="stat-content">
              <h3>{card.title}</h3>
              <p className="stat-value">{card.value}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default WeeklySummary; 