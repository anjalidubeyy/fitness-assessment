import React from 'react';
import './styles/AboutPage.css';

const AboutPage = () => {
  return (
    <div className="about-container">
      <div className="about-header">
        <h1>About FAT</h1>
        <p>Your personal fitness journey tracker, designed to keep you motivated, informed, and on track.</p>
      </div>

      <div className="about-content">
        <section>
          <h2>Our Mission</h2>
          <p>We aim to provide the most accurate and personalized fitness assessments to help you achieve your goals efficiently. Our platform uses data-driven insights to optimize your fitness journey.</p>
        </section>

        <section>
          <h2>Why Choose FAT?</h2>
          <ul>
            <li>Personalized assessments</li>
            <li>Real-time data updates</li>
            <li>Engaging and fun fitness reports</li>
            <li>Interactive gamification</li>
            <li>Detailed analytics and progress tracking</li>
          </ul>
        </section>

        <section>
          <h2>Our Team</h2>
          <p>Our team is composed of fitness enthusiasts, developers, and data scientists dedicated to helping you optimize your fitness journey.</p>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;
