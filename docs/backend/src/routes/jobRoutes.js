const express = require('express');
const { createJob, getJobs, getJobById, getRecruiterJobs, updateJob, deleteJob } = require('../controllers/jobController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes for listings
router.get('/', protect, getJobs);
router.get('/:id', protect, getJobById);

// Recruiter routes
router.post('/', protect, authorize('recruiter', 'admin'), createJob);
router.get('/recruiter/my', protect, authorize('recruiter', 'admin'), getRecruiterJobs);
router.put('/:id', protect, authorize('recruiter', 'admin'), updateJob);
router.delete('/:id', protect, authorize('recruiter', 'admin'), deleteJob);

module.exports = router;
