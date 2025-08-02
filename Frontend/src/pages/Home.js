import React from 'react';
import { Link } from 'react-router-dom'; // Import Link component
import background from '../assets/background.jpg';
import './styles/Home.css';

const Home = () => {
  return (
    <div 
      className="home-page"
      style={{ 
        backgroundImage: `url(${background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        height: '100vh',
        color: '#fff'
      }}
    >
      
      <main className="home-content">
        <section className="hero-section">
          <h1>Find Your Dream Job Today</h1>
          <p>
            Explore thousands of opportunities from top companies around the world.          
          </p>
          
          {/* Registration Buttons */}
          <div className="registration-cta">
            <h2>Ready to get started?</h2>
             <Link to="/register" className="register-btn">
          Register Now
        </Link>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;