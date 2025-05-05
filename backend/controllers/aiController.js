const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateAdvice = async (req, res) => {
  console.log('AI Advice Request:', req.body);
  try {
    const { age, gender, goal } = req.body;

    // Validate required fields
    if (!age || !gender || !goal) {
      console.log('Missing required fields:', { age, gender, goal });
      return res.status(400).json({
        error: 'Missing required fields',
        advice: 'Focus on consistency and proper form in your workouts for the best results.'
      });
    }

    // Create prompt for Gemini
    const prompt = `Give a helpful and specific fitness tip for a ${age}-year-old ${gender} whose goal is ${goal}. Keep the tip under 40 words and beginner-friendly. Focus on actionable advice.`;
    console.log('Gemini Prompt:', prompt);

    try {
      // Get Gemini model
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      console.log('Gemini model initialized');

      // Generate content
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const advice = response.text();
      console.log('Generated advice:', advice);

      return res.json({ advice });
    } catch (aiError) {
      console.error('Gemini API Error:', aiError);
      
      // Fallback responses based on goals
      const fallbackAdvice = {
        'muscle gain': 'Focus on compound exercises like squats and deadlifts. Ensure you eat enough protein and get adequate rest between workouts.',
        'weight loss': 'Combine cardio with strength training, and focus on creating a sustainable caloric deficit through healthy eating habits.',
        'general fitness': 'Start with 30 minutes of moderate exercise daily. Mix cardio and basic strength training for overall fitness improvement.',
      };

      console.log('Using fallback advice for goal:', goal.toLowerCase());
      return res.json({
        advice: fallbackAdvice[goal.toLowerCase()] || 'Start with small, achievable goals and gradually increase intensity as you build consistency in your routine.'
      });
    }
  } catch (error) {
    console.error('Server Error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      advice: 'Remember to stay hydrated and listen to your body during workouts.'
    });
  }
};

module.exports = {
  generateAdvice
}; 