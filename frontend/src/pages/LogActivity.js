import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faSpinner } from '@fortawesome/free-solid-svg-icons';
import '../styles/dashboard/LogActivity.css';

const LogActivity = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    activityType: '',
    duration: '',
    intensity: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <motion.div 
      className="log-activity-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="log-activity-container">
        <div className="page-header">
          <button className="back-button" onClick={() => navigate('/dashboard')}>
            <FontAwesomeIcon icon={faArrowLeft} />
            Back to Dashboard
          </button>
          <h1>Log Activity</h1>
        </div>

        <form className="activity-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="activityType">Activity Type</label>
            <select
              id="activityType"
              name="activityType"
              className="form-control"
              value={formData.activityType}
              onChange={handleChange}
              required
            >
              <option value="">Select Activity Type</option>
              <option value="running">Running</option>
              <option value="cycling">Cycling</option>
              <option value="swimming">Swimming</option>
              <option value="weightlifting">Weight Lifting</option>
              <option value="yoga">Yoga</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="duration">Duration (minutes)</label>
            <input
              type="number"
              id="duration"
              name="duration"
              className="form-control"
              value={formData.duration}
              onChange={handleChange}
              min="1"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="intensity">Intensity Level</label>
            <select
              id="intensity"
              name="intensity"
              className="form-control"
              value={formData.intensity}
              onChange={handleChange}
              required
            >
              <option value="">Select Intensity</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              name="notes"
              className="form-control"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Add any additional notes about your activity..."
            />
          </div>

          <button 
            type="submit" 
            className="submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="loading-text">
                <FontAwesomeIcon icon={faSpinner} />
                Logging Activity...
              </span>
            ) : (
              'Log Activity'
            )}
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default LogActivity; 