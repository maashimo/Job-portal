// models/Application.js
const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  applicant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  resume: {
    type: String,
    required: [true, 'Resume is required']
  },
  coverLetter: {
    type: String
  },
  status: {
    type: String,
    enum: ['submitted', 'reviewed', 'interview', 'rejected', 'hired'],
    default: 'submitted'
  },
  appliedAt: {
    type: Date,
    default: Date.now
  },
  notes: [{
    content: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
});

// Ensure one application per job per user
applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);