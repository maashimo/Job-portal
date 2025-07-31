import React from 'react';
import { Link } from 'react-router-dom';

const JobCard = ({ job }) => {
  return (
    <div className="job-card">
      <h3>{job.title}</h3>
      <p>{job.company} • {job.location}</p>
      <p>Salary: ${job.salary? job.salary.toLocaleString() : 'Not specified'}</p>
      <p>Type: {job.type}</p>
      <Link to={`/jobs/${job._id}`}>View Details</Link>
    </div>
  );
};

export default JobCard;