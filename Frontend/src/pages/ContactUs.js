// src/pages/ContactUs.js
import React, { useState } from 'react';
import './styles/ContactUs.css';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // For now just simulate submission
    console.log('Message submitted:', formData);
    setSubmitted(true);
  };

  return (
    <div className="contact-page">
      <div className="contact-container">
        <h1>Contact Us</h1>
        <p className="description">
          Have questions, feedback, or need help? Reach out to us!
        </p>

        {submitted ? (
          <div className="success-message">
            Thank you! Your message has been received.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="contact-form">
            <label htmlFor="name">Your Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <label htmlFor="email">Your Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <label htmlFor="message">Your Message</label>
            <textarea
              name="message"
              rows="5"
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>

            <button type="submit" className="submit-btn">Send Message</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ContactUs;
