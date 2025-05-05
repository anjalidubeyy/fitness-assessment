import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from '../../api/api';

const AddWorkoutButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activityType, setActivityType] = useState('workout');
  const [formData, setFormData] = useState({
    type: 'workout',
    workoutType: '',
    duration: '',
    intensity: '5',
    sleepDuration: '',
    sleepQuality: '3',
    notes: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'activityType') {
      setActivityType(value);
      setFormData(prev => ({
        ...prev,
        type: value,
        workoutType: value === 'workout' ? prev.workoutType : '',
        duration: value === 'workout' ? prev.duration : '',
        intensity: value === 'workout' ? '5' : '',
        sleepDuration: value === 'sleep' ? prev.sleepDuration : '',
        sleepQuality: value === 'sleep' ? '3' : '',
        notes: prev.notes
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const validateForm = () => {
    if (activityType === 'workout') {
      if (!formData.workoutType) {
        toast.error('Please select a workout type');
        return false;
      }
      if (!formData.duration || formData.duration <= 0) {
        toast.error('Please enter a valid duration');
        return false;
      }
    } else if (activityType === 'sleep') {
      if (!formData.sleepDuration || formData.sleepDuration <= 0) {
        toast.error('Please enter a valid sleep duration');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    // Create the request data based on activity type
    const requestData = {
      type: activityType,
      ...(activityType === 'workout' && {
        workoutType: formData.workoutType,
        duration: Number(formData.duration),
        intensity: Number(formData.intensity)
      }),
      ...(activityType === 'sleep' && {
        sleepDuration: Number(formData.sleepDuration),
        sleepQuality: Number(formData.sleepQuality)
      }),
      notes: formData.notes
    };

    console.log('Sending data:', requestData);

    try {
      const response = await api.post('/fitness', requestData);
      console.log('Server response:', response.data);
      
      toast.success(activityType === 'workout' ? 'Workout logged successfully!' : 'Sleep logged successfully!');
      setIsModalOpen(false);
      setFormData({
        type: activityType,
        workoutType: '',
        duration: '',
        intensity: '5',
        sleepDuration: '',
        sleepQuality: '3',
        notes: ''
      });

      // Trigger a refresh of the dashboard data
      window.dispatchEvent(new Event('fitnessDataUpdated'));
    } catch (err) {
      console.error('Error details:', err);
      const errorMessage = err.response?.data?.error || err.response?.data?.message || `Failed to log ${activityType}`;
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        className="add-workout-button"
        onClick={() => setIsModalOpen(true)}
        aria-label="Add Activity"
      >
        <FaPlus /> Add Activity
      </button>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              className="modal-content"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <h2>Log New Activity</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="activityType">Activity Type</label>
                  <select
                    id="activityType"
                    name="activityType"
                    value={activityType}
                    onChange={handleChange}
                    required
                  >
                    <option value="workout">Workout</option>
                    <option value="sleep">Sleep</option>
                  </select>
                </div>

                {activityType === 'workout' ? (
                  <>
                    <div className="form-group">
                      <label htmlFor="workoutType">Workout Type</label>
                      <select
                        id="workoutType"
                        name="workoutType"
                        value={formData.workoutType}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select type</option>
                        <option value="cardio">Cardio</option>
                        <option value="strength">Strength Training</option>
                        <option value="yoga">Yoga</option>
                        <option value="hiit">HIIT</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="duration">Duration (minutes)</label>
                      <input
                        type="number"
                        id="duration"
                        name="duration"
                        value={formData.duration}
                        onChange={handleChange}
                        min="1"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="intensity">
                        Intensity Level: {formData.intensity}
                      </label>
                      <input
                        type="range"
                        id="intensity"
                        name="intensity"
                        value={formData.intensity}
                        onChange={handleChange}
                        min="1"
                        max="10"
                        className="intensity-slider"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="form-group">
                      <label htmlFor="sleepDuration">Sleep Duration (hours)</label>
                      <input
                        type="number"
                        id="sleepDuration"
                        name="sleepDuration"
                        value={formData.sleepDuration}
                        onChange={handleChange}
                        min="0"
                        max="24"
                        step="0.5"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="sleepQuality">
                        Sleep Quality: {formData.sleepQuality}
                      </label>
                      <input
                        type="range"
                        id="sleepQuality"
                        name="sleepQuality"
                        value={formData.sleepQuality}
                        onChange={handleChange}
                        min="1"
                        max="5"
                        className="intensity-slider"
                      />
                    </div>
                  </>
                )}

                <div className="form-group">
                  <label htmlFor="notes">Notes (optional)</label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows="3"
                  />
                </div>

                {error && <div className="error-message">{error}</div>}

                <div className="modal-actions">
                  <button
                    type="button"
                    className="cancel-button"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="submit-button"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Logging...' : `Log ${activityType === 'workout' ? 'Workout' : 'Sleep'}`}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AddWorkoutButton; 