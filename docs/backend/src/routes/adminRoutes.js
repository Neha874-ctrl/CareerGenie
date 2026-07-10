const express = require('express');
const {
  getStats,
  getAllUsers,
  updateUserRole,
  updateUserStatus,
  deleteUser,
  getAllResumes,
  deleteResume,
  moderateJob,
  getPendingJobs,
  getAllJobs,
  deleteJob,
  getAllFeedback,
  updateFeedbackStatus,
  deleteFeedback,
  getAllNotifications,
  createNotification,
  getSettings,
  updateSettings,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All admin routes require auth + admin role
router.use(protect, authorize('admin'));

// Stats & Analytics
router.get('/stats', getStats);

// User Management
router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);
router.put('/users/:id/status', updateUserStatus);
router.delete('/users/:id', deleteUser);

// Resume Management
router.get('/resumes', getAllResumes);
router.delete('/resumes/:id', deleteResume);

// Job Management
router.get('/jobs', getAllJobs);
router.get('/jobs/pending', getPendingJobs);
router.put('/jobs/:id/moderate', moderateJob);
router.delete('/jobs/:id', deleteJob);

// Feedback / Contact
router.get('/feedback', getAllFeedback);
router.put('/feedback/:id/status', updateFeedbackStatus);
router.delete('/feedback/:id', deleteFeedback);

// Notifications
router.get('/notifications', getAllNotifications);
router.post('/notifications', createNotification);

// Settings
router.get('/settings', getSettings);
router.put('/settings', updateSettings);

module.exports = router;
