import React, { useState, useEffect } from 'react';
import JobCard from '../components/JobCard';
import api from '../api';
import './styles/joblist.css'; 

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await api.get('/jobs');
        setJobs(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching jobs:', err);
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  return (
    <div className="job-list-container">
      <h1 className="job-list-title">Available Jobs</h1>
      {loading ? (
        <div className="loading">Loading jobs...</div>
      ) : (
        <div className="job-list-grid">
          {jobs.length > 0 ? (
            jobs.map(job => (
              <JobCard key={job._id} job={job} />
            ))
          ) : (
            <p className="no-jobs">No jobs available at the moment.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default JobList;