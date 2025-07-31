const Job = require('../models/Job');

exports.createJob = async (jobData, userId) => {
  const job = await Job.create({
    ...jobData,
    postedBy: userId
  });
  return job;
};

exports.getJobs = async (filters) => {
  return await Job.find(filters).populate('postedBy', 'profile.name');
};