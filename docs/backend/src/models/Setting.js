const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
  maintenanceMode: {
    type: Boolean,
    default: false,
  },
  allowRegistrations: {
    type: Boolean,
    default: true,
  },
  maxResumeUploadSizeMB: {
    type: Number,
    default: 5,
  },
  geminiModelVersion: {
    type: String,
    default: 'gemini-1.5-flash',
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Setting', settingSchema);
