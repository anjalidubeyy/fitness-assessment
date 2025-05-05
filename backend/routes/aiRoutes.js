const express = require('express');
const router = express.Router();
const { generateAdvice } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

// Protected route - requires authentication
router.post('/advice', protect, generateAdvice);

module.exports = router; 