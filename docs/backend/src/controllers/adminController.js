const User = require('../models/User');
const Job = require('../models/Job');
const Resume = require('../models/Resume');
const Application = require('../models/Application');
const Feedback = require('../models/Feedback');
const Notification = require('../models/Notification');

/**
 * @desc    Get system analytics stats
 * @route   GET /api/admin/stats
 * @access  Private (Admin)
 */
exports.getStats = async (req, res) => {
  try {
    const [totalUsers, totalJobs, totalResumes, totalApplications, students, recruiters, admins, approvedJobs, pendingJobs, rejectedJobs] = await Promise.all([
      User.countDocuments(),
      Job.countDocuments({ status: 'approved' }),
      Resume.countDocuments(),
      Application.countDocuments(),
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'recruiter' }),
      User.countDocuments({ role: 'admin' }),
      Job.countDocuments({ status: 'approved' }),
      Job.countDocuments({ status: 'pending' }),
      Job.countDocuments({ status: 'rejected' }),
    ]);

    // Application status breakdown
    const [accepted, rejected, underReview, applied] = await Promise.all([
      Application.countDocuments({ status: 'Accepted' }),
      Application.countDocuments({ status: 'Rejected' }),
      Application.countDocuments({ status: 'Under Review' }),
      Application.countDocuments({ status: 'Applied' }),
    ]);

    // Resume ATS Score Distribution
    const resumes = await Resume.find().select('atsScore');
    const atsDistribution = {
      excellent: resumes.filter(r => r.atsScore >= 90).length,
      good: resumes.filter(r => r.atsScore >= 80 && r.atsScore < 90).length,
      average: resumes.filter(r => r.atsScore >= 70 && r.atsScore < 80).length,
      poor: resumes.filter(r => r.atsScore < 70).length,
    };

    // Recent activity — last 5 signups
    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5).select('name email role createdAt status');

    return res.json({
      success: true,
      stats: {
        totalUsers,
        totalJobs,
        totalResumes,
        totalApplications,
        roles: { students, recruiters, admins },
        jobs: { approvedJobs, pendingJobs, rejectedJobs },
        applications: { accepted, rejected, underReview, applied },
        atsDistribution,
        recentUsers,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * @desc    Get all users with filters
 * @route   GET /api/admin/users
 * @access  Private (Admin)
 */
exports.getAllUsers = async (req, res) => {
  try {
    const { role, status, search, page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    let query = {};
    if (role) query.role = role;
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const [users, total] = await Promise.all([
      User.find(query).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)).select('-password'),
      User.countDocuments(query),
    ]);

    return res.json({ success: true, users, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * @desc    Update a user's role
 * @route   PUT /api/admin/users/:id/role
 * @access  Private (Admin)
 */
exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!['student', 'recruiter', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, error: 'Invalid role' });
    }

    if (req.params.id === req.user.id) {
      return res.status(400).json({ success: false, error: 'You cannot change your own role' });
    }

    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });

    return res.json({ success: true, message: `User role updated to ${role}`, user });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * @desc    Update a user's status (block/unblock)
 * @route   PUT /api/admin/users/:id/status
 * @access  Private (Admin)
 */
exports.updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['active', 'blocked'].includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid status' });
    }

    if (req.params.id === req.user.id) {
      return res.status(400).json({ success: false, error: 'You cannot change your own status' });
    }

    const user = await User.findByIdAndUpdate(req.params.id, { status }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });

    return res.json({ success: true, message: `User status updated to ${status}`, user });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * @desc    Delete a user account
 * @route   DELETE /api/admin/users/:id
 * @access  Private (Admin)
 */
exports.deleteUser = async (req, res) => {
  try {
    if (req.params.id === req.user.id) {
      return res.status(400).json({ success: false, error: 'You cannot delete your own account' });
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });

    // Cascade delete user's resumes and applications
    await Promise.all([
      Resume.deleteMany({ student: req.params.id }),
      Application.deleteMany({ student: req.params.id }),
    ]);

    return res.json({ success: true, message: 'User and associated data deleted' });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * @desc    Get all resumes
 * @route   GET /api/admin/resumes
 * @access  Private (Admin)
 */
exports.getAllResumes = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [resumes, total] = await Promise.all([
      Resume.find().populate('student', 'name email').sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
      Resume.countDocuments(),
    ]);

    return res.json({ success: true, resumes, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * @desc    Delete a resume
 * @route   DELETE /api/admin/resumes/:id
 * @access  Private (Admin)
 */
exports.deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findByIdAndDelete(req.params.id);
    if (!resume) return res.status(404).json({ success: false, error: 'Resume not found' });
    return res.json({ success: true, message: 'Resume deleted' });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * @desc    Moderate a job posting (approve/reject)
 * @route   PUT /api/admin/jobs/:id/moderate
 * @access  Private (Admin)
 */
exports.moderateJob = async (req, res) => {
  const { status } = req.body;
  if (!['approved', 'rejected', 'pending'].includes(status)) {
    return res.status(400).json({ success: false, error: 'Invalid job status' });
  }

  try {
    const job = await Job.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!job) return res.status(404).json({ success: false, error: 'Job not found' });
    return res.json({ success: true, message: `Job has been ${status}`, job });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * @desc    Get all pending jobs for moderation
 * @route   GET /api/admin/jobs/pending
 * @access  Private (Admin)
 */
exports.getPendingJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ status: 'pending' }).sort({ createdAt: -1 });
    return res.json({ success: true, jobs });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * @desc    Get all jobs (all statuses) for admin
 * @route   GET /api/admin/jobs
 * @access  Private (Admin)
 */
exports.getAllJobs = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    let query = {};
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
      ];
    }

    const [jobs, total] = await Promise.all([
      Job.find(query).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
      Job.countDocuments(query),
    ]);

    return res.json({ success: true, jobs, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * @desc    Admin delete any job posting
 * @route   DELETE /api/admin/jobs/:id
 * @access  Private (Admin)
 */
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ success: false, error: 'Job not found' });
    await Application.deleteMany({ job: req.params.id });
    return res.json({ success: true, message: 'Job and its applications deleted' });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * @desc    Get all feedback / contact queries
 * @route   GET /api/admin/feedback
 * @access  Private (Admin)
 */
exports.getAllFeedback = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    let query = {};
    if (status) query.status = status;

    const [feedback, total] = await Promise.all([
      Feedback.find(query).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
      Feedback.countDocuments(query),
    ]);

    return res.json({ success: true, feedback, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * @desc    Update feedback status
 * @route   PUT /api/admin/feedback/:id/status
 * @access  Private (Admin)
 */
exports.updateFeedbackStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['pending', 'resolved', 'spam'].includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid status' });
    }

    const feedback = await Feedback.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!feedback) return res.status(404).json({ success: false, error: 'Feedback not found' });

    return res.json({ success: true, message: `Feedback marked as ${status}`, feedback });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * @desc    Delete feedback
 * @route   DELETE /api/admin/feedback/:id
 * @access  Private (Admin)
 */
exports.deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndDelete(req.params.id);
    if (!feedback) return res.status(404).json({ success: false, error: 'Feedback not found' });
    return res.json({ success: true, message: 'Feedback deleted' });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * @desc    Get all notifications (admin view)
 * @route   GET /api/admin/notifications
 * @access  Private (Admin)
 */
exports.getAllNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [notifications, total] = await Promise.all([
      Notification.find().sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
      Notification.countDocuments(),
    ]);

    return res.json({ success: true, notifications, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * @desc    Create a new system broadcast notification
 * @route   POST /api/admin/notifications
 * @access  Private (Admin)
 */
exports.createNotification = async (req, res) => {
  try {
    const { title, message, recipientRole } = req.body;
    if (!title || !message) {
      return res.status(400).json({ success: false, error: 'Title and message are required' });
    }

    const notification = await Notification.create({
      title,
      message,
      type: 'announcement',
      recipientRole: recipientRole || 'all',
    });

    return res.status(201).json({ success: true, message: 'Notification broadcasted', notification });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

const Setting = require('../models/Setting');

/**
 * @desc    Get global settings
 * @route   GET /api/admin/settings
 * @access  Private (Admin)
 */
exports.getSettings = async (req, res) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = await Setting.create({});
    }
    return res.json({ success: true, settings });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * @desc    Update global settings
 * @route   PUT /api/admin/settings
 * @access  Private (Admin)
 */
exports.updateSettings = async (req, res) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = new Setting();
    }
    
    const { maintenanceMode, allowRegistrations, maxResumeUploadSizeMB, geminiModelVersion } = req.body;
    
    if (maintenanceMode !== undefined) settings.maintenanceMode = maintenanceMode;
    if (allowRegistrations !== undefined) settings.allowRegistrations = allowRegistrations;
    if (maxResumeUploadSizeMB !== undefined) settings.maxResumeUploadSizeMB = maxResumeUploadSizeMB;
    if (geminiModelVersion !== undefined) settings.geminiModelVersion = geminiModelVersion;
    
    settings.updatedAt = Date.now();
    await settings.save();

    return res.json({ success: true, message: 'Settings updated successfully', settings });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
