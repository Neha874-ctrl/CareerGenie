const Application = require('../models/Application');
const Job = require('../models/Job');
const Resume = require('../models/Resume');
const Notification = require('../models/Notification');
const { calculateMatchScore } = require('../services/matchingService');

/**
 * @desc    Apply for a job
 * @route   POST /api/applications/apply/:jobId
 * @access  Private (Student)
 */
exports.applyForJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ success: false, error: 'Job listing not found' });
    }

    // Check if user has already applied
    const alreadyApplied = await Application.findOne({ job: job._id, student: req.user.id });
    if (alreadyApplied) {
      return res.status(400).json({ success: false, error: 'You have already applied for this job' });
    }

    // Fetch student's latest resume
    const resume = await Resume.findOne({ student: req.user.id }).sort({ createdAt: -1 });
    if (!resume) {
      return res.status(400).json({ success: false, error: 'Please upload and analyze a resume first' });
    }

    // Calculate match percentage
    const { matchPercentage, matchInsights } = calculateMatchScore(resume, job);

    const application = await Application.create({
      job: job._id,
      student: req.user.id,
      resume: resume._id,
      matchPercentage,
      matchInsights,
    });

    // Create Notification for the Recruiter
    await Notification.create({
      user: job.postedBy,
      title: 'New Job Application',
      message: `${req.user.name} has applied for ${job.title}. AI Match Score: ${matchPercentage}%.`,
    });

    return res.status(201).json({
      success: true,
      message: 'Application submitted successfully!',
      application,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * @desc    Get student applications
 * @route   GET /api/applications/student/my
 * @access  Private (Student)
 */
exports.getStudentApplications = async (req, res) => {
  try {
    const applications = await Application.find({ student: req.user.id })
      .populate('job', 'title company location type deadline')
      .sort({ appliedAt: -1 });

    return res.json({ success: true, applications });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * @desc    Get applicants for a job
 * @route   GET /api/applications/job/:jobId
 * @access  Private (Recruiter/Coordinator)
 */
exports.getJobApplicants = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ success: false, error: 'Job not found' });
    }

    // Recruiter authorization check
    if (job.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Not authorized to view applicants for this job' });
    }

    const applicants = await Application.find({ job: req.params.jobId })
      .populate('student', 'name email')
      .populate('resume', 'skills education experience')
      .sort({ matchPercentage: -1 }); // Rank by match score!

    return res.json({ success: true, applicants });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * @desc    Update application status
 * @route   PUT /api/applications/:id/status
 * @access  Private (Recruiter/Coordinator)
 */
exports.updateApplicationStatus = async (req, res) => {
  const { status } = req.body;

  if (!['Applied', 'Under Review', 'Interviewing', 'Accepted', 'Rejected'].includes(status)) {
    return res.status(400).json({ success: false, error: 'Invalid application status' });
  }

  try {
    let application = await Application.findById(req.params.id)
      .populate('job', 'title postedBy')
      .populate('student', 'name');

    if (!application) {
      return res.status(404).json({ success: false, error: 'Application not found' });
    }

    // Check recruiter authorization
    if (application.job.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Not authorized to manage this application' });
    }

    application.status = status;
    await application.save();

    // Create Notification for the student
    await Notification.create({
      user: application.student._id,
      title: 'Application Status Update',
      message: `Your application status for "${application.job.title}" has been updated to "${status}".`,
    });

    return res.json({ success: true, message: 'Status updated successfully', application });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
