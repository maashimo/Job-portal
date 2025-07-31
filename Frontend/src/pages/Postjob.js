import React from 'react';
import JobForm from '../components/JobForm';
import './styles/PostJob.css';

const PostJob = () => {
  return (
    <div className="post-job-container">
      <div className="post-job-form-container">
        <div className="post-job-header">
          <h1 className="post-job-title">Post a New Job on JobWell</h1>
          <p className="post-job-subtitle">Fill out the form below to list your job opportunity</p>
        </div>
      <JobForm/>
    </div>
  </div>
  );
};

export default PostJob;