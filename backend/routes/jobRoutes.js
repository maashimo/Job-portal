const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const protect = require('../middlewares/auth');

// @desc    Create a new job
// @route   POST /api/jobs
// @access  Private (Employers only)
router.post('/', protect, async (req, res) => {
  try {
    // Add the user who posted the job
    req.body.postedBy = req.user.id;
    
    const job = await Job.create(req.body);
    res.status(201).json(job);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
router.get('/', async (req, res) => {
  try {
    const jobs = await Job.find({ isActive: true })
      .populate('postedBy', 'name company')
      .sort('-createdAt');
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// @desc    Get jobs posted by the logged-in recruiter
// @route   GET /api/jobs/my-jobs
// @access  Private
router.get('/my-jobs', protect, async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user.id }).sort('-createdAt');
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch your jobs' });
  }
});

// @desc    Get job by ID
// @route   GET /api/jobs/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('postedBy', 'name company');
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (err) {
    console.error('Error fetching job:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;