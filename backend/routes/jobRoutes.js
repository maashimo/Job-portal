const express = require('express');
const router = express.Router();
const path = require('path');
const Job = require('../models/job');
const protect = require('../middlewares/auth');
const Application = require('../models/Application');
const multer = require('multer');

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb) { 
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });

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

// @desc    Apply for a job
// @route   POST /api/jobs/:id/apply
// @access  Private

router.post('/:id/apply', protect, upload.fields([
  {name: 'resume', maxCount:1},
  {name: 'coverLetter', maxCount:1}
]), async (req, res) => {
  try {
    const jobId = req.params.id;
    const userId = req.user.id;

    // Check if the job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if the user has already applied for this job
    const existingApplication = await Application.findOne({ job: jobId, applicant: userId });
    if (existingApplication) return res.status(400).json({ message: 'You have already applied for this job' });

    //Get uploaded files
    const resumeFile = req.files['resume']?.[0];
    const coverLetterFile = req.files['coverLetter']?.[0];

    if (!resumeFile || !coverLetterFile) {
      return res.status(400).json({ message: 'Both resume and cover letter are required'});
    }

    // Create the application
    const newApp = new Application({
      job: jobId,
      applicant: userId,
      resume: resumeFile.filename,
      coverLetter: coverLetterFile.filename,
    });

    await newApp.save();

    res.status(201).json({ message: 'Application submitted successfully' });
  } catch (err) {
    console.error('Error applying for job:', err);
    res.status(500).json({ message: 'Failed to apply for job' });
  }
});

module.exports = router;