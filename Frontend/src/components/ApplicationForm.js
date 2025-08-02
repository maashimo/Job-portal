import React, { useState, useEffect } from 'react';
import api from '../api';
import { useParams } from 'react-router-dom';
import './ApplicationForm.css'; 

const ApplicationForm = () => {
  const {id:jobId} = useParams();
  
  const [userInfo, setUserInfo] = useState(null);
  const [formData, setFormData] = useState({
    resume: null,
    coverLetter: null,
  });

  useEffect(() => {
    // Fetch user information
    const fetchUserInfo = async () => {
      try {
        const res = await api.get('/auth/me');
        setUserInfo(res.data);
      } catch (err) {
        console.error('Failed to load user info', err);
      }
    };

    fetchUserInfo();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.coverLetter || !formData.resume) {
      alert('Please upload both cover letter and resume');
      return;
    }

    try {
      const form = new FormData();
      form.append('coverLetter', formData.coverLetter);
      form.append('resume', formData.resume);

      await api.post(`/jobs/${jobId}/apply`, form, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      alert('Application submitted successfully!');
    } catch (err) {
      console.error('Error submitting application:', err);
      alert('Failed to submit application. Please try again later.');
    }
  };

  if (!userInfo) {
    return <div>Loading user information...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="application-form">
      <h2>Apply for Job</h2>

      <div className="user-info">
        <p><strong>Name:</strong> {userInfo.name}</p>
        <p><strong>Email:</strong> {userInfo.email}</p>
        <p><strong>Education:</strong> {userInfo.education || 'N/A'}</p>
        <p><strong>Skills:</strong> {userInfo.skills?.join(', ') || 'N/A'}</p>
        <p><strong>Experience:</strong> {userInfo.experience || 'N/A'}</p>
      </div>

      <div className="form-group">
        <label>Upload Cover Letter (PDF or DOC)</label>
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) => setFormData({ ...formData, coverLetter: e.target.files[0] })}
          required
        />
      </div>

      <div className="form-group">
        <label>Upload Resume / CV (PDF or DOC)</label>
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) => setFormData({ ...formData, resume: e.target.files[0] })}
        required
        />
      </div>

      <button type="submit" className="submit-btn">Submit Application</button>
    </form>
  );
};


export default ApplicationForm;