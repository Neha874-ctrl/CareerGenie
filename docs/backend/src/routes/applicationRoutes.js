const express = require('express');
const { applyForJob, getStudentApplications, getJobApplicants, updateApplicationStatus } = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Student routes
router.post('/apply/:jobId', protect, authorize('student'), applyForJob);
router.get('/student/my', protect, authorize('student'), getStudentApplications);

// Recruiter / Coordinator routes
router.get('/job/:jobId', protect, authorize('recruiter', 'admin'), getJobApplicants);
router.put('/:id/status', protect, authorize('recruiter', 'admin'), updateApplicationStatus);

module.exports = router;
