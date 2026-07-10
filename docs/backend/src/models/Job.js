const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a job title'],
    trim: true,
  },
  company: {
    type: String,
    required: [true, 'Please add a company name'],
    trim: true,
  },
  location: {
    type: String,
    required: [true, 'Please add a job location'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please add a job description'],
  },
  requirements: {
    type: [String],
    required: [true, 'Please add job requirements/skills'],
  },
  type: {
    type: String,
    required: [true, 'Please select a job type'],
    enum: ['Full-time', 'Part-time', 'Internship', 'Contract'],
    default: 'Full-time',
  },
  deadline: {
    type: Date,
    required: [true, 'Please add an application deadline'],
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'approved',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Job', jobSchema);
