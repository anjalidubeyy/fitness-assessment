import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import WelcomeSection from '../components/dashboard/WelcomeSection';
import WeeklySummary from '../components/dashboard/WeeklySummary';
import ProgressCharts from '../components/dashboard/ProgressCharts';
import XPTracker from '../components/dashboard/XPTracker';
import FloatingCTA from '../components/dashboard/FloatingCTA';
import AddWorkoutButton from '../components/dashboard/AddWorkoutButton';
import SmartFitnessCoach from '../components/dashboard/SmartFitnessCoach';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/dashboard/Dashboard.css';
import '../styles/dashboard/AddWorkoutButton.css';

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    // Listen for fitness data updates
    const handleDataUpdate = () => {
      setRefreshKey(prev => prev + 1);
    };

    window.addEventListener('fitnessDataUpdated', handleDataUpdate);

    return () => {
      window.removeEventListener('fitnessDataUpdated', handleDataUpdate);
    };
  }, []);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="dashboard">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      
      <div className="dashboard-content">
        <div className="dashboard-main">
          <WelcomeSection user={user} key={`welcome-${refreshKey}`} />
          <div className="dashboard-actions">
            <AddWorkoutButton />
          </div>
          <WeeklySummary key={`summary-${refreshKey}`} />
          <ProgressCharts key={`charts-${refreshKey}`} />
        </div>
        
        <div className="dashboard-sidebar">
          <XPTracker key={`xp-${refreshKey}`} />
          <SmartFitnessCoach 
            profileData={{
              age: user?.age || 25,
              gender: user?.gender || 'unspecified',
              goal: user?.fitnessGoal || 'general fitness'
            }}
          />
        </div>
      </div>

      <FloatingCTA />
    </div>
  );
};

export default Dashboard; 