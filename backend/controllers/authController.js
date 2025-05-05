const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    console.log('Registration attempt with:', { name, email });
    
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'User exists' });

    // Create a new user with empty profile
    const user = await User.create({ 
      name, 
      email, 
      password,
      profile: {
        isProfileComplete: false
      }
    });
    
    console.log('User created successfully:', user._id);
    
    // Return response with token and user data
    res.status(201).json({
      token: generateToken(user._id),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isProfileComplete: false
      }
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ 
      message: err.message || 'Server error during registration',
      error: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: 'Invalid credentials' });

    res.json({
      token: generateToken(user._id),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isProfileComplete: user.isProfileComplete()
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ 
      message: 'Server error during login',
      error: err.message 
    });
  }
};
