import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles/Auth.css'; // Reusing the same CSS file

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'job_seeker' // Default role
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    
    try {
      const res = await axios.post('/api/auth/login', {
        email: formData.email.trim(),
        password: formData.password,
        role: formData.role
      });
      
      sessionStorage.setItem('token', res.data.token);
      sessionStorage.setItem('user', JSON.stringify(res.data.user));

      //notify other components of login
      window.dispatchEvent(new Event('storage'));


      navigate(`/${res.data.user.role}/dashboard`);
    } catch (err) {
      setErrors({
        message: err.response?.data?.message || 'Login failed. Please try again.'
      });
    }
  };

  return (
    <div className="register-portal">
      <div className="register-card">
        <h2>Login to Your Account</h2>
        
        {errors.message && (
          <div className="error-message">{errors.message}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="role-selection">
            <p>Login As</p>
            <div className="role-options">
              <label className={formData.role === 'job_seeker' ? 'active' : ''}>
                <input
                  type="radio"
                  name="role"
                  value="job_seeker"
                  checked={formData.role === 'job_seeker'}
                  onChange={handleChange}
                />
                Job Seeker
              </label>
              <label className={formData.role === 'recruiter' ? 'active' : ''}>
                <input
                  type="radio"
                  name="role"
                  value="recruiter"
                  checked={formData.role === 'recruiter'}
                  onChange={handleChange}
                />
                Recruiter
              </label>
            </div>
          </div>

          <button type="submit" className="register-button">
            Login
          </button>
        </form>

        <div className="login-link">
          Don't have an account? <Link to="/register">Register</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;