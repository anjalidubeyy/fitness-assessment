import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/api';
import '../styles/global.css';
import './styles/LoginPage.css';

function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await API.post('/auth/login', form);
      
      if (response.data.token && response.data.user) {
        const success = await login(response.data);
        
        if (success) {
          navigate('/dashboard');
        } else {
          setError('Login failed. Please try again.');
        }
      } else {
        setError('Invalid response from server');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <div className="login-header">
          <h1 className="neon-text-pink">Welcome Back</h1>
          <p className="neon-text-cyan">Enter your credentials to access your dashboard</p>
        </div>

        <form className="login-form neon-card" onSubmit={handleSubmit}>
          {error && (
            <div className="error-message">
              <span className="neon-text-pink">{error}</span>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email" className="neon-text-purple">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="neon-input"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="neon-text-purple">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="neon-input"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="neon-button"
          >
            {loading ? (
              <span className="neon-spinner" />
            ) : (
              'Login'
            )}
          </button>

          <div className="form-footer">
            <p className="neon-text-cyan">
              Don't have an account?{' '}
              <Link to="/sign-up" className="neon-link">
                Sign Up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
