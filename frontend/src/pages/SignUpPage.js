import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/api';
import '../styles/SignUpPage.css';

function SignUpPage() {
  const [form, setForm] = useState({ 
    name: '', 
    email: '', 
    password: '',
    confirmPassword: '' 
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate passwords match
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate password length
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      // Remove confirmPassword before sending to API
      const { confirmPassword, ...registrationData } = form;
      
      // Register the new user
      const response = await API.post('/auth/register', registrationData);
      
      if (response.data.token && response.data.user) {
        // Log the user in automatically after successful registration
        const success = await login(response.data);
        
        if (success) {
          // For new users, redirect to profile setup
          navigate('/profile-setup');
        } else {
          setError('Registration successful but login failed. Please try logging in.');
        }
      } else {
        setError('Invalid response from server');
      }
    } catch (err) {
      console.error('Registration error:', err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.status === 400) {
        setError('Invalid registration data. Please check your inputs.');
      } else if (err.request) {
        setError('No response from server. Please check your connection and try again.');
      } else {
        setError('Error during registration. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <div className="signup-header">
          <h2>Create Account</h2>
          <p>Join the fitness revolution</p>
        </div>

        <form className="signup-form" onSubmit={handleSubmit}>
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="form-group">
            <input
              name="name"
              type="text"
              required
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <input
              name="email"
              type="email"
              required
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <input
              name="password"
              type="password"
              required
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <input
              name="confirmPassword"
              type="password"
              required
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="submit-button"
          >
            {loading ? (
              <span className="loading-spinner" />
            ) : (
              'Create Account'
            )}
          </button>

          <div className="login-link">
            <p>
              Already have an account?{' '}
              <Link to="/login">Sign In</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignUpPage;
