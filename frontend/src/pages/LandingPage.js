import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/LandingPage.css';

function LandingPage() {
  const [showOptions, setShowOptions] = useState(false);  // State to toggle between the Get Started button and the sign up/login options
  const navigate = useNavigate();

  const handleGetStarted = () => {
    setShowOptions(true);  // Show the options for Sign Up or Login when clicked
  };

  const handleSignUp = () => {
    navigate('/sign-up');  // Navigate to Sign Up page
  };

  const handleLogin = () => {
    navigate('/login');  // Navigate to Login page
  };

  return (
    <div className="landing-container">
      {/* Hero Section */}
      <section className="hero">
        <h1>Level Up Your Fitness Journey</h1>
        <p>Get the insights, motivation, and data you need to smash your fitness goals with FAT.</p>
        {!showOptions ? (
          <button className="hero-button" onClick={handleGetStarted}>Get Started</button>
        ) : (
          <div className="get-started-options">
            <button className="option-button" onClick={handleSignUp}>New User? Sign Up</button>
            <button className="option-button" onClick={handleLogin}>Existing User? Log In</button>
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2>Features</h2>
        <div className="card-grid">
          <div className="card">
            <h3>Personalized Tracking</h3>
            <p>Track your fitness assessments, progress, and improvement with ease.</p>
          </div>
          <div className="card">
            <h3>Data-Driven Insights</h3>
            <p>Leverage smart analytics to better understand your strengths and weaknesses.</p>
          </div>
          <div className="card">
            <h3>Gamified Experience</h3>
            <p>Stay motivated with badges, rewards, and a fun, game-like environment.</p>
          </div>
        </div>
      </section>

      {/* Why Join FAT Section */}
      <section className="why-join-section">
        <h2>Why Join FAT?</h2>
        <div className="card-grid">
          <div className="card">
            <h3>Boost Your Motivation</h3>
            <p>Get rewarded as you achieve fitness milestones, stay engaged and motivated.</p>
          </div>
          <div className="card">
            <h3>Improve Your Results</h3>
            <p>Smart data helps you focus on areas that need improvement for better progress.</p>
          </div>
          <div className="card">
            <h3>Connect With Like-Minded People</h3>
            <p>Join a community of fitness enthusiasts and share your journey.</p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <h2>What Users Are Saying</h2>
        <div className="card-grid">
          <div className="card">
            <h3>John D.</h3>
            <p>"FAT has completely changed the way I track my fitness journey. Highly recommend!"</p>
          </div>
          <div className="card">
            <h3>Sarah K.</h3>
            <p>"The gamification element makes working out so much fun. I'm hooked!"</p>
          </div>
          <div className="card">
            <h3>Mike R.</h3>
            <p>"Data-driven insights helped me understand my weaknesses and improve faster."</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
