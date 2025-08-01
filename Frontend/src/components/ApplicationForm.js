import React, { useState } from 'react';
import api from '../api';

const ApplicationForm = ({ jobId }) => {
  const [formData, setFormData] = useState({
    coverLetter: '',
    resume: null
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('resume', formData.resume);
    data.append('coverLetter', formData.coverLetter);
    
    try {
      await api.post(`/api/jobs/${jobId}/apply`, data);
      alert('Application submitted successfully!');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={formData.coverLetter}
        onChange={(e) => setFormData({...formData, coverLetter: e.target.value})}
        placeholder="Cover Letter"
      />
      <input
        type="file"
        onChange={(e) => setFormData({...formData, resume: e.target.files[0]})}
      />
      <button type="submit">Submit Application</button>
    </form>
  );
};

export default ApplicationForm;