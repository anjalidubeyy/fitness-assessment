const mongoose = require('mongoose');

const fitnessDataSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  weight: {
    type: Number,
    required: true,
    min: [30, 'Weight must be at least 30kg'],
    max: [200, 'Weight must be less than 200kg']
  },
  height: {
    type: Number,
    required: true,
    min: [100, 'Height must be at least 100cm'],
    max: [250, 'Height must be less than 250cm']
  },
  bmi: {
    type: Number,
    required: true
  },
  bodyFat: {
    type: Number,
    min: [3, 'Body fat percentage must be at least 3%'],
    max: [50, 'Body fat percentage must be less than 50%']
  },
  muscleMass: {
    type: Number,
    min: [0, 'Muscle mass must be positive']
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  },
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Calculate BMI before saving
fitnessDataSchema.pre('save', function(next) {
  if (this.isModified('weight') || this.isModified('height')) {
    // BMI = weight(kg) / height(m)²
    const heightInMeters = this.height / 100;
    this.bmi = (this.weight / (heightInMeters * heightInMeters)).toFixed(2);
  }
  next();
});

module.exports = mongoose.model('FitnessData', fitnessDataSchema);
