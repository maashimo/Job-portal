import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import JobForm from '../components/JobForm';
import './styles/DashboardRecruiter.css';

const DashboardRecruiter = () => {
  const [jobs, setJobs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [recruiter, setRecruiter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch recruiter information and jobs
  const fetchJobsAndProfile = async () => {
    try {
      const [jobsRes, userRes] = await Promise.all([
        api.get('/jobs/my-jobs'),
        api.get('/auth/me')
      ]);
      setJobs(jobsRes.data);
      setRecruiter(userRes.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobsAndProfile();
  }, []);

  // Handle input changes in the job form
  const handleJobPosted = async () => {
    const response = await api.get('/jobs/my-jobs');
    setJobs(response.data);
    setShowForm(false);
  };

  // Handle logout
  const handleLogout = async () => {
    sessionStorage.clear();
    navigate('/login');
  };

  if (loading) return <div className="loading">Loading your job posting...</div>
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="recruiter-dashboard">
      {recruiter && (
        <div className="recruiter-info">
          <h2>Welcome, {recruiter.name}</h2>
          <p><strong>Email:</strong> {recruiter.email}</p>
          { recruiter.company && <p><strong>Company:</strong> {recruiter.company}</p>}
          <button onClick={() => navigate('/edit-profile')} className="edit-profile-btn">
            Edit
          </button>
        </div>
      )}
          
      <div className="dashboard-header">
        <h1>Your Job Postings</h1>
        <button 
          className={`toggle-form-btn ${showForm ? 'cancel' : 'add'}`}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? '✕ Cancel' : '+ Post New Job'}
        </button>
      </div>

      {showForm && (
        <div className="job-form">
          <h2>Create New Job Posting</h2>
          <JobForm onSubmit={handleJobPosted} />
        </div>
      )}

      <div className="jobs-list">
        {jobs.length === 0 ? (
          <div className="empty-state">
            <p>You haven't posted any jobs yet</p>
            <button 
              className="add-job-btn"
              onClick={() => setShowForm(true)}
            >
              Post Your First Job
            </button>
          </div>
        ) : (
          jobs.map(job => (
            <div key={job._id} className="job-card">
              <div className="job-header">
                <h3>{job.title}</h3>
                <span className={`job-type ${job.jobType?.toLowerCase()}`}>
                  {job.jobType}
                </span>
              </div>
              <p className="company-location">
                {job.company} • {job.location}
              </p>
              <p className="salary">
                {job.salaryRange?.min ? `$${job.salaryRange.min} - $${job.salaryRange.max}` : 'Salary not specified'}
              </p>
              <div className="job-footer">
                <button 
                  className="view-applicants"
                  onClick={() => navigate(`/jobs/${job._id}/applications`)}
                >
                  View Applicants ({job.applications?.length || 0})
                </button>
                <span className="post-date">
                  Posted on {new Date(job.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="logout">
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>  
    </div>
  );
};

export default DashboardRecruiter;