const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['system', 'job', 'application', 'announcement'],
    default: 'system',
  },
  recipientRole: {
    type: String,
    enum: ['all', 'student', 'recruiter'],
    default: 'all', // who should see this if not targeted to a specific user
  },
  recipientUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false, // null means it's a global broadcast based on recipientRole
  },
  readBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Notification', notificationSchema);
