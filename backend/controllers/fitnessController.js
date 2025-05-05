const Fitness = require('../models/Fitness');
const asyncHandler = require('express-async-handler');

// @desc    Add new fitness data (workout, sleep, or measurement)
// @route   POST /api/fitness
// @access  Private
const addFitnessData = asyncHandler(async (req, res) => {
  try {
    const { type, workoutType, duration, intensity, sleepDuration, sleepQuality, weight, height, bodyFat, muscleMass, notes } = req.body;

    console.log('Received fitness data:', req.body);
    console.log('User ID:', req.user.id);

    if (!type) {
      console.log('Error: Type is missing');
      res.status(400);
      throw new Error('Type is required (workout, sleep, or measurement)');
    }

    // Validate required fields based on type
    if (type === 'workout' && (!workoutType || !duration || !intensity)) {
      console.log('Error: Missing required workout fields');
      console.log('workoutType:', workoutType);
      console.log('duration:', duration);
      console.log('intensity:', intensity);
      res.status(400);
      throw new Error('Workout type, duration, and intensity are required for workouts');
    }

    if (type === 'sleep' && (!sleepDuration || !sleepQuality)) {
      console.log('Error: Missing required sleep fields');
      console.log('sleepDuration:', sleepDuration);
      console.log('sleepQuality:', sleepQuality);
      res.status(400);
      throw new Error('Sleep duration and quality are required for sleep logs');
    }

    if (type === 'measurement' && (!weight || !height)) {
      console.log('Error: Missing required measurement fields');
      res.status(400);
      throw new Error('Weight and height are required for measurements');
    }

    const fitnessData = await Fitness.create({
      user: req.user.id,
      type,
      workoutType,
      duration,
      intensity,
      sleepDuration,
      sleepQuality,
      weight,
      height,
      bodyFat,
      muscleMass,
      bmi: weight && height ? (weight / ((height / 100) * (height / 100))).toFixed(2) : undefined,
      notes,
      date: new Date()
    });

    console.log('Successfully created fitness data:', fitnessData);
    res.status(201).json(fitnessData);
  } catch (error) {
    console.error('Error in addFitnessData:', error);
    if (!res.headersSent) {
      res.status(500).json({
        message: 'Error creating fitness data',
        error: error.message
      });
    }
  }
});

// @desc    Get user's fitness history
// @route   GET /api/fitness
// @access  Private
const getFitnessHistory = asyncHandler(async (req, res) => {
  const { type } = req.query;
  const query = { user: req.user.id };
  
  if (type) {
    query.type = type;
  }

  const fitnessData = await Fitness.find(query)
    .sort({ date: -1 });
  res.json(fitnessData);
});

// @desc    Get user's latest fitness data
// @route   GET /api/fitness/latest
// @access  Private
const getLatestFitnessData = asyncHandler(async (req, res) => {
  const { type } = req.query;
  const query = { user: req.user.id };
  
  if (type) {
    query.type = type;
  }

  const latestData = await Fitness.findOne(query)
    .sort({ date: -1 });

  if (!latestData) {
    res.status(404);
    throw new Error('No fitness data found');
  }

  res.json(latestData);
});

// @desc    Update fitness data
// @route   PUT /api/fitness/:id
// @access  Private
const updateFitnessData = asyncHandler(async (req, res) => {
  const fitness = await Fitness.findById(req.params.id);

  if (!fitness) {
    res.status(404);
    throw new Error('Fitness data not found');
  }

  // Check if the fitness data belongs to the logged-in user
  if (fitness.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('Not authorized to update this data');
  }

  const updatedData = await Fitness.findByIdAndUpdate(
    req.params.id,
    { ...req.body },
    { new: true, runValidators: true }
  );

  res.json(updatedData);
});

// @desc    Delete fitness data
// @route   DELETE /api/fitness/:id
// @access  Private
const deleteFitnessData = asyncHandler(async (req, res) => {
  const fitness = await Fitness.findById(req.params.id);

  if (!fitness) {
    res.status(404);
    throw new Error('Fitness data not found');
  }

  // Check if the fitness data belongs to the logged-in user
  if (fitness.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('Not authorized to delete this data');
  }

  await Fitness.deleteOne({ _id: req.params.id });
  res.json({ message: 'Fitness data removed' });
});

module.exports = {
  addFitnessData,
  getFitnessHistory,
  getLatestFitnessData,
  updateFitnessData,
  deleteFitnessData
};
