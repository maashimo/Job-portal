import React, { useState, useEffect } from 'react';
import api from '../api';
import ProtectedRoute from '../components/ProtectedRoute';
import './styles/DashboardJobSeeker.css';

const DashboardJobSeeker = () => {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobsRes, appsRes] = await Promise.all([
          api.get('/jobs'),
          api.get('/applications/me')
        ]);
        setJobs(jobsRes.data);
        setApplications(appsRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const applyToJob = async (jobId) => {
    try {
      await api.post(`/jobs/${jobId}/apply`);
      alert('Application submitted!');
    } catch (err) {
      alert(err.response?.data?.message || 'Application failed');
    }
  };

  return (
    <ProtectedRoute roles={['job_seeker']}>
      <div className="dashboard">
        <h1>Job Seeker Dashboard</h1>
        
        <section className="job-listings">
          <h2>Available Jobs</h2>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ul>
              {jobs.map(job => (
                <li key={job._id}>
                  <h3>{job.title}</h3>
                  <p>{job.company} • {job.location}</p>
                  <button onClick={() => applyToJob(job._id)}>
                    Apply
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="my-applications">
          <h2>My Applications</h2>
          {applications.length === 0 ? (
            <p>No applications yet</p>
          ) : (
            <ul>
              {applications.map(app => (
                <li key={app._id}>
                  <h3>{app.job.title}</h3>
                  <p>Status: {app.status}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </ProtectedRoute>
  );
};

export default DashboardJobSeeker;