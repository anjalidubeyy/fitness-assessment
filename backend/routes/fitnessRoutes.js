const express = require('express');
const router = express.Router();
const {
  addFitnessData,
  getFitnessHistory,
  getLatestFitnessData,
  updateFitnessData,
  deleteFitnessData
} = require('../controllers/fitnessController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected and require authentication
router.use(protect);

// Routes
router.route('/')
  .post(addFitnessData)
  .get(getFitnessHistory);

router.get('/latest', getLatestFitnessData);

router.route('/:id')
  .put(updateFitnessData)
  .delete(deleteFitnessData);

module.exports = router;
