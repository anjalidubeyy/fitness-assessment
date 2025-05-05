import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/api';
import '../styles/ProfileSetup.css';

function ProfileSetup() {
  const [form, setForm] = useState({
    height: '',
    weight: '',
    age: '',
    gender: '',
    fitnessGoal: '',
    activityLevel: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();

  useEffect(() => {
    // Check if user is authenticated
    if (!user) {
      navigate('/login');
      return;
    }

    // If profile is already complete, redirect to dashboard
    if (user.profile?.isProfileComplete) {
      navigate('/dashboard');
      return;
    }

    // Fetch existing profile data if any
    const fetchProfile = async () => {
      try {
        const response = await API.get('/users/profile');
        if (response.data && response.data.profile) {
          setForm(prevForm => ({
            ...prevForm,
            ...response.data.profile
          }));
        }
      } catch (err) {
        if (err.response?.status === 401) {
          navigate('/login');
        }
      }
    };

    fetchProfile();
  }, [navigate, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await API.put('/users/profile', { 
        profile: {
          ...form,
          isProfileComplete: true
        }
      });
      
      // Update the user state with the new profile data
      updateUser(response.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-setup-container">
      <div className="profile-setup-box">
        <div className="profile-setup-header">
          <h2>Complete Your Profile</h2>
          <p>Let's personalize your fitness journey</p>
        </div>

        <form className="profile-setup-form" onSubmit={handleSubmit}>
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="height">Height (cm)</label>
              <input
                id="height"
                name="height"
                type="number"
                required
                placeholder="Enter your height"
                value={form.height}
                onChange={handleChange}
                min="100"
                max="250"
              />
            </div>

            <div className="form-group">
              <label htmlFor="weight">Weight (kg)</label>
              <input
                id="weight"
                name="weight"
                type="number"
                required
                placeholder="Enter your weight"
                value={form.weight}
                onChange={handleChange}
                min="30"
                max="200"
              />
            </div>

            <div className="form-group">
              <label htmlFor="age">Age</label>
              <input
                id="age"
                name="age"
                type="number"
                required
                placeholder="Enter your age"
                value={form.age}
                onChange={handleChange}
                min="13"
                max="120"
              />
            </div>

            <div className="form-group">
              <label htmlFor="gender">Gender</label>
              <select
                id="gender"
                name="gender"
                required
                value={form.gender}
                onChange={handleChange}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group full-width">
              <label htmlFor="fitnessGoal">Fitness Goal</label>
              <select
                id="fitnessGoal"
                name="fitnessGoal"
                required
                value={form.fitnessGoal}
                onChange={handleChange}
              >
                <option value="">Select Fitness Goal</option>
                <option value="weight-loss">Weight Loss</option>
                <option value="muscle-gain">Muscle Gain</option>
                <option value="maintenance">Maintenance</option>
                <option value="endurance">Endurance</option>
              </select>
            </div>

            <div className="form-group full-width">
              <label htmlFor="activityLevel">Activity Level</label>
              <select
                id="activityLevel"
                name="activityLevel"
                required
                value={form.activityLevel}
                onChange={handleChange}
              >
                <option value="">Select Activity Level</option>
                <option value="sedentary">Sedentary</option>
                <option value="light">Light Activity</option>
                <option value="moderate">Moderate Activity</option>
                <option value="very">Very Active</option>
                <option value="extra">Extra Active</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="submit-button"
          >
            {loading ? (
              <span className="loading-spinner" />
            ) : (
              'Complete Profile'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ProfileSetup;
