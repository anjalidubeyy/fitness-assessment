const mongoose = require('mongoose');

const fitnessSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  type: {
    type: String,
    required: true,
    enum: ['workout', 'sleep', 'measurement']
  },
  // Workout specific fields
  workoutType: {
    type: String,
    enum: ['cardio', 'strength', 'yoga', 'hiit', 'other'],
    required: function() { return this.type === 'workout'; }
  },
  duration: {
    type: Number,
    required: function() { return this.type === 'workout'; }
  },
  intensity: {
    type: Number,
    min: 1,
    max: 10,
    required: function() { return this.type === 'workout'; }
  },
  // Sleep specific fields
  sleepDuration: {
    type: Number,
    required: function() { return this.type === 'sleep'; }
  },
  sleepQuality: {
    type: Number,
    min: 1,
    max: 5,
    required: function() { return this.type === 'sleep'; }
  },
  // Measurement specific fields
  weight: {
    type: Number,
    required: function() { return this.type === 'measurement'; }
  },
  height: {
    type: Number,
    required: function() { return this.type === 'measurement'; }
  },
  bodyFat: {
    type: Number
  },
  muscleMass: {
    type: Number
  },
  bmi: {
    type: Number
  },
  // Common fields
  notes: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create index for efficient querying by user and date
fitnessSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model('Fitness', fitnessSchema); 