const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const fitnessDataSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now
  },
  weight: {
    type: Number,
    required: true
  },
  height: {
    type: Number,
    required: true
  },
  bodyFat: {
    type: Number,
    default: null
  },
  muscleMass: {
    type: Number,
    default: null
  },
  bmi: {
    type: Number,
    required: true
  }
}, { _id: true });

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  profile: {
    height: {
      type: Number,
      min: [100, 'Height must be at least 100cm'],
      max: [250, 'Height must be less than 250cm'],
      required: false
    },
    weight: {
      type: Number,
      min: [30, 'Weight must be at least 30kg'],
      max: [200, 'Weight must be less than 200kg'],
      required: false
    },
    age: {
      type: Number,
      min: [13, 'Must be at least 13 years old'],
      max: [120, 'Age must be less than 120'],
      required: false
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      required: false
    },
    fitnessGoal: {
      type: String,
      enum: ['weight-loss', 'muscle-gain', 'maintenance', 'endurance'],
      required: false
    },
    activityLevel: {
      type: String,
      enum: ['sedentary', 'light', 'moderate', 'very', 'extra'],
      required: false
    },
    isProfileComplete: {
      type: Boolean,
      default: false
    }
  },
  fitnessData: [fitnessDataSchema]
}, { 
  timestamps: true 
});

// Hash password before saving user
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare hashed password
userSchema.methods.matchPassword = async function(enteredPassword) {
  try {
    return await bcrypt.compare(enteredPassword, this.password);
  } catch (error) {
    throw new Error('Error comparing passwords');
  }
};

// Check if profile is complete
userSchema.methods.isProfileComplete = function() {
  const profile = this.profile;
  return profile.height && 
         profile.weight && 
         profile.age && 
         profile.gender && 
         profile.fitnessGoal && 
         profile.activityLevel;
};

module.exports = mongoose.model('User', userSchema);
