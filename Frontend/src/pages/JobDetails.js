import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import './styles/JobDetails.css'; 

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await api.get(`/jobs/${id}`);
        setJob(response.data);
      } catch (error) {
        console.error('Error fetching job details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const navigate = useNavigate();

  const handleApply = () => {
    navigate(`/jobs/${id}/apply`);
  };

  if (loading) return <p>Loading job details...</p>;
  if (!job) return <p>Job not found.</p>;

  return (
    <div className="job-details">
      <h2>{job.title}</h2>
      <p><strong>Company:</strong> {job.company}</p>
      <p><strong>Location:</strong> {job.location}</p>
      <p><strong>Salary:</strong> ${job.salary}</p>
      <p><strong>Type:</strong> {job.type}</p>
      <p><strong>Description:</strong> {job.description}</p>
      <p><strong>Requirements:</strong></p>
      <ul>
        {Array.isArray(job.requirements) ? (
          job.requirements.map((req, index) => <li key={index}>{req}</li>)
        ) : (
          <li>{job.requirements}</li>
        )}
      </ul>

      <button className="apply-button" onClick={handleApply}>Apply Now</button>
    </div>
  );
};

export default JobDetails;