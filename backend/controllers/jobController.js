const jobService = require('../Services/jobService');
const errorHandler = require('../utils/errorHandler');

exports.createJob = async (req, res) => {
  try {
    const job = await jobService.createJob(req.body, req.user.id);
    res.status(201).json({ success: true, data: job });
  } catch (err) {
    errorHandler(res, 400, err.message);
  }
};

exports.getJobs = async (req, res) => {
  try {
    const jobs = await jobService.getJobs(req.query);
    res.status(200).json({ success: true, data: jobs });
  } catch (err) {
    errorHandler(res, 500, err.message);
  }
};