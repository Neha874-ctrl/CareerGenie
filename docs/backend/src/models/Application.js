const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true,
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  resume: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resume',
    required: true,
  },
  status: {
    type: String,
    enum: ['Applied', 'Under Review', 'Interviewing', 'Accepted', 'Rejected'],
    default: 'Applied',
  },
  matchPercentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  matchInsights: {
    type: String,
    default: '',
  },
  appliedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Application', applicationSchema);
