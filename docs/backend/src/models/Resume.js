const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  filePath: {
    type: String,
    required: true,
  },
  parsedText: {
    type: String,
    default: '',
  },
  skills: {
    type: [String],
    default: [],
  },
  experience: {
    type: [String],
    default: [],
  },
  education: {
    type: [String],
    default: [],
  },
  feedback: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Resume', resumeSchema);
