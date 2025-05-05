const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// CORS configuration
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(express.json());

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
const userRoutes = require('./routes/userRoutes');
const fitnessRoutes = require('./routes/fitnessRoutes');
const aiRoutes = require('./routes/aiRoutes');
app.use('/api/users', userRoutes);
app.use('/api/fitness', fitnessRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/contact/submit', require('./routes/contactRoutes'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Handle 404 routes
app.use((req, res) => {
  console.log('404 Not Found:', req.method, req.url);
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Available routes:');
  console.log('- /api/auth');
  console.log('- /api/users');
  console.log('- /api/contact/submit');
  console.log('- /api/fitness');
  console.log('- /api/ai');
});
