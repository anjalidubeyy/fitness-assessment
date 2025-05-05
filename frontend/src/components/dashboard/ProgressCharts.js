import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import API from '../../api/api';
import '../../styles/dashboard/ProgressCharts.css';

const COLORS = ['#00fff2', '#ff00ff', '#9933ff'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="label">{`${label}`}</p>
        <p className="value">{`${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

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

const ProgressCharts = () => {
  const [workoutData, setWorkoutData] = useState([]);
  const [caloriesData, setCaloriesData] = useState([]);
  const [sleepData, setSleepData] = useState([]);
  const [xpData, setXpData] = useState([]);
  const [warriorLevel, setWarriorLevel] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await API.get('/fitness');
        const fitnessData = response.data;

        // Process workout data
        const workoutStats = processWorkoutData(fitnessData);
        setWorkoutData(workoutStats);

        // Process calories data
        const caloriesStats = processCaloriesData(fitnessData);
        setCaloriesData(caloriesStats);

        // Process sleep data
        const sleepStats = processSleepData(fitnessData);
        setSleepData(sleepStats);

        // Calculate XP and warrior level
        const totalXP = calculateXP(fitnessData);
        console.log('Progress Charts - Total XP:', totalXP);
        
        const level = calculateWarriorLevel(totalXP);
        console.log('Progress Charts - Warrior Level:', level);
        
        setWarriorLevel(level);

        // Process XP data
        const xpStats = processXPData(fitnessData);
        setXpData(xpStats);

        setLoading(false);
      } catch (err) {
        console.error('Error in ProgressCharts:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const processWorkoutData = (data) => {
    // Filter only workout entries
    const workouts = data.filter(entry => entry.type === 'workout');
    
    // Group workouts by day of week
    const workoutsByDay = workouts.reduce((acc, entry) => {
      const day = new Date(entry.date).toLocaleDateString('en-US', { weekday: 'short' });
      acc[day] = (acc[day] || 0) + 1;
      return acc;
    }, {});

    // Convert to array format for chart
    return Object.entries(workoutsByDay).map(([day, count]) => ({
      day,
      workouts: count
    }));
  };

  const processCaloriesData = (data) => {
    // Filter only workout entries
    const workouts = data.filter(entry => entry.type === 'workout');
    
    // Calculate calories burned based on duration and intensity
    return workouts.map(entry => {
      const duration = Math.max(0, Math.floor(parseFloat(entry.duration) || 0));
      const intensity = Math.max(0, Math.floor(parseFloat(entry.intensity) || 0));
      const calories = Math.round((duration * 7) * (0.8 + (intensity * 0.04)));
      
      return {
        day: new Date(entry.date).toLocaleDateString('en-US', { weekday: 'short' }),
        calories: calories
      };
    });
  };

  const processSleepData = (data) => {
    // Filter only sleep entries
    const sleepEntries = data.filter(entry => entry.type === 'sleep');
    
    // Calculate sleep quality distribution
    const sleepQuality = {
      Good: 0,
      Average: 0,
      Poor: 0
    };

    sleepEntries.forEach(entry => {
      const quality = Math.max(0, Math.floor(parseFloat(entry.sleepQuality) || 0));
      if (quality >= 4) sleepQuality.Good++;
      else if (quality >= 2) sleepQuality.Average++;
      else sleepQuality.Poor++;
    });

    const total = Math.max(1, Object.values(sleepQuality).reduce((a, b) => a + b, 0));
    
    return Object.entries(sleepQuality).map(([name, value]) => ({
      name,
      value: Math.round((value / total) * 100)
    }));
  };

  const processXPData = (data) => {
    if (!Array.isArray(data) || data.length === 0) {
      return [];
    }

    // Sort data by date
    const sortedData = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Calculate cumulative XP over time
    let cumulativeXP = 0;
    return sortedData.map(entry => {
      const xp = calculateXP([entry]);
      cumulativeXP += xp;
      return {
        date: new Date(entry.date).toLocaleDateString('en-US', { weekday: 'short' }),
        xp: Math.max(0, cumulativeXP)
      };
    });
  };

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
    <div className="progress-charts">
      <div className="warrior-level-badge">
        <h2>Warrior Level {warriorLevel}</h2>
        <div className="level-progress">
          <div 
            className="progress-bar"
            style={{ 
              width: `${(xpData[xpData.length - 1]?.xp % 1000) / 10}%`,
              backgroundColor: '#00fff2'
            }}
          />
        </div>
      </div>
      <div className="charts-grid">
        <motion.div
          className="chart-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h3>XP Progress</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={xpData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="date" stroke="#fff" />
              <YAxis stroke="#fff" />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="xp"
                stroke="#00fff2"
                strokeWidth={2}
                dot={{ fill: '#00fff2', strokeWidth: 2 }}
                activeDot={{ r: 8, fill: '#00fff2' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          className="chart-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h3>Workouts Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={workoutData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="day" stroke="#fff" />
              <YAxis stroke="#fff" />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="workouts"
                stroke="#ff00ff"
                strokeWidth={2}
                dot={{ fill: '#ff00ff', strokeWidth: 2 }}
                activeDot={{ r: 8, fill: '#ff00ff' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          className="chart-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h3>Sleep Quality</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={sleepData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
              >
                {sleepData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="sleep-legend">
            {sleepData.map((entry, index) => (
              <div key={entry.name} className="legend-item">
                <div className="legend-color" style={{ backgroundColor: COLORS[index] }} />
                <span>{entry.name}: {entry.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProgressCharts; 