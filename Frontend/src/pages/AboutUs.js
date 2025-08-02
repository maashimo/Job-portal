import React from 'react';
import './styles/AboutUs.css';
import { Link } from 'react-router-dom';

const AboutUs = () => {
  return (
    <div className="about-container">
      <section className="intro-section">
        <h1>About Us</h1>
        <h2>Our Mission</h2>
        <p>
          We are dedicated to bridging the gap between top talent and the companies that need them.
          Our mission is to empower job seekers and recruiters through a smart, efficient, and user-friendly job-matching platform.
        </p>
      </section>

      <section className="who-we-are">
        <h2>Who We Are</h2>
        <p>
          Our platform was built by a passionate team of developers and hiring experts who understand the struggles of job hunting and hiring.
          We created this portal to make the process easier for both job seekers and employers.
        </p>
      </section>

      <section className="what-makes-us-different">
        <h2>What Makes Us Different</h2>
        <ul>
          <li>🔍 Personalized job matches powered by intelligent filtering</li>
          <li>📄 Clean and easy-to-navigate dashboards for both recruiters and applicants</li>
          <li>🔐 Commitment to user privacy and data security</li>
          <li>⚡ Fast and responsive design that works across all devices</li>
        </ul>
      </section>

      <section className="join-us-section">
        <h2>Join Us</h2>
        <p>
          Whether you’re a job seeker ready to launch your career or a recruiter looking to find top talent — we’re here to help.
        </p>
        <Link to="/register" className="join-button">Get Started</Link>
      </section>
    </div>
  );
};

export default AboutUs;
