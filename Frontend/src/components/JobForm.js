import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const JobForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    description: '',
    requirements: '',
    type: 'Full-time',
    location: '',
    salary: '',
    contactEmail: ''
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!formData.title) newErrors.title = 'Title is required';
    if (!formData.company) newErrors.company = 'Company name is required';
    if (!formData.description) newErrors.description = 'Description is required';
    if (!formData.requirements) newErrors.requirements = 'Requirements are required';
    if (!formData.location) newErrors.location = 'Location is required';
    if (!formData.contactEmail) newErrors.contactEmail = 'Contact email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.contactEmail)) newErrors.contactEmail = 'Invalid email format';
    if (formData.salary && isNaN(formData.salary)) newErrors.salary = 'Must be a number';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    try {
      await api.post('/jobs', {
        title: formData.title,
        company: formData.company,
        description: formData.description,
        requirements: formData.requirements,
        jobType: formData.type,
        location: formData.location,
        salary: formData.salary ? parseFloat(formData.salary) : undefined,
        contactEmail: formData.contactEmail
      });

      onSubmit();
      navigate('/jobs'); // Redirect after successful submission
    } catch (err) {
      alert(err.response?.data?.error || 'Error posting job');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <form onSubmit={handleSubmit} className="job-form">
      <div className="form-group">
        <label>Job Title*</label>
        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={errors.title ? 'error' : ''}
        />
        {errors.title && <span className="error-message">{errors.title}</span>}
      </div>

      <div className="form-group">
        <label>Company Name*</label>
        <input
          name="company"
          value={formData.company}
          onChange={handleChange}
          className={errors.company ? 'error' : ''}
        />
        {errors.company && <span className="error-message">{errors.company}</span>}
      </div>

      <div className="form-group">
        <label>Description*</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={5}
          className={errors.description ? 'error' : ''}
        />
        {errors.description && <span className="error-message">{errors.description}</span>}
      </div>

      <div className="form-group">
        <label>Requirements (one per line)</label>
        <textarea
          name="requirements"
          value={formData.requirements}
          onChange={handleChange}
          rows={5}
          className={errors.requirements ? 'error' : ''}
        />
        {errors.requirements && <span className="error-message">{errors.requirements}</span>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Job Type*</label>
          <select
            name="type"
            value={formData.jobType}
            onChange={handleChange}
          >
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
            <option value="Remote">Remote</option>
          </select>
        </div>

        <div className="form-group">
          <label>Location*</label>
          <input
            name="location"
            value={formData.location}
            onChange={handleChange}
            className={errors.location ? 'error' : ''}
          />
          {errors.location && <span className="error-message">{errors.location}</span>}
        </div>

      <div className="form-group">
        <label>Salary ($)</label>
        <input
          type="number"
          name="salary"
          value={formData.salary}
          onChange={handleChange}
          className={errors.salary ? 'error' : ''}
        />
        {errors.salary && <span className="error-message">{errors.salary}</span>}
      </div>
      </div>

      <div className="form-group">
        <label>Contact Email*</label>
        <input
          type="email"
          name="contactEmail"
          value={formData.contactEmail}
          onChange={handleChange}
          className={errors.contactEmail ? 'error' : ''}
        />
        {errors.contactEmail && <span className="error-message">{errors.contactEmail}</span>}
      </div>

      <button type="submit" className="submit-btn">Post Job</button>
  </form>
);
};

export default JobForm;