const express = require('express');
const { upload, uploadAndAnalyzeResume, getLatestResume, getResumeById, getAllResumes } = require('../controllers/resumeController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/upload', protect, authorize('student'), upload.single('resume'), uploadAndAnalyzeResume);
router.get('/latest', protect, authorize('student'), getLatestResume);
router.get('/history', protect, authorize('student'), getAllResumes);
router.get('/:id', protect, getResumeById);

module.exports = router;
