const Job = require('../models/Job');
const Resume = require('../models/Resume');
const { calculateMatchScore } = require('../services/matchingService');
const { searchExternalJobs } = require('../services/jSearchService');

/**
 * @desc    Create a job post
 * @route   POST /api/jobs
 * @access  Private (Recruiter/Coordinator)
 */
exports.createJob = async (req, res) => {
  const { title, company, location, description, requirements, type, deadline } = req.body;

  try {
    if (!title || !company || !location || !description || !requirements || !deadline) {
      return res.status(400).json({ success: false, error: 'Please provide all required job fields' });
    }

    const job = await Job.create({
      title,
      company,
      location,
      description,
      requirements: Array.isArray(requirements) ? requirements : requirements.split(',').map((s) => s.trim()),
      type,
      deadline,
      postedBy: req.user.id,
    });

    return res.status(201).json({ success: true, job });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * @desc    Get all approved jobs (internal + live external) with filters + match scores
 * @route   GET /api/jobs
 * @access  Protected
 */
exports.getJobs = async (req, res) => {
  try {
    const { search, type, skill, page = '1' } = req.query;
    const pageNum = Math.max(1, parseInt(page, 10));

    // ---------- Internal DB query ----------
    let dbQuery = { status: 'approved' };
    if (search) {
      dbQuery.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { requirements: { $regex: search, $options: 'i' } },
      ];
    }
    if (type) dbQuery.type = type;
    if (skill) dbQuery.requirements = { $in: [new RegExp(skill, 'i')] };

    const internalJobs = await Job.find(dbQuery).sort({ createdAt: -1 }).lean();

    // ---------- External live jobs from JSearch ----------
    const searchQuery = search || skill || 'software engineer';
    const externalJobs = await searchExternalJobs({
      query: type ? `${searchQuery} ${type}` : searchQuery,
      location: 'India',
      page: pageNum,
      numPages: 1,
    });

    // Filter external by type if specified
    const filteredExternal = type
      ? externalJobs.filter((j) => j.type === type)
      : externalJobs;

    // ---------- Combine: internal first, then external ----------
    let allJobs = [
      ...internalJobs.map((j) => ({ ...j, isExternal: false })),
      ...filteredExternal,
    ];

    // ---------- Apply resume match scores for students ----------
    if (req.user && req.user.role === 'student') {
      const resume = await Resume.findOne({ student: req.user.id }).sort({ createdAt: -1 }).lean();
      if (resume) {
        allJobs = allJobs.map((job) => {
          const { matchPercentage, matchInsights } = calculateMatchScore(resume, job);
          return { ...job, matchPercentage, matchInsights };
        });
        // Sort by match score, best first
        allJobs.sort((a, b) => b.matchPercentage - a.matchPercentage);
      }
    }

    return res.json({
      success: true,
      totalInternal: internalJobs.length,
      totalExternal: filteredExternal.length,
      page: pageNum,
      jobs: allJobs,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * @desc    Get a single job details
 * @route   GET /api/jobs/:id
 * @access  Public
 */
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, error: 'Job listing not found' });
    }

    let matchPercentage = null;
    let matchInsights = '';

    // Calculate match percentage if student is viewing
    if (req.user && req.user.role === 'student') {
      const resume = await Resume.findOne({ student: req.user.id }).sort({ createdAt: -1 });
      if (resume) {
        const scoreResult = calculateMatchScore(resume, job);
        matchPercentage = scoreResult.matchPercentage;
        matchInsights = scoreResult.matchInsights;
      }
    }

    return res.json({
      success: true,
      job: {
        ...job.toObject(),
        matchPercentage,
        matchInsights,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * @desc    Get jobs posted by recruiter
 * @route   GET /api/jobs/recruiter/my
 * @access  Private (Recruiter/Coordinator)
 */
exports.getRecruiterJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user.id }).sort({ createdAt: -1 });
    return res.json({ success: true, jobs });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * @desc    Update a job posting
 * @route   PUT /api/jobs/:id
 * @access  Private (Recruiter/Coordinator)
 */
exports.updateJob = async (req, res) => {
  try {
    let job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, error: 'Job listing not found' });
    }

    // Check ownership
    if (job.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Not authorized to edit this job' });
    }

    const { title, company, location, description, requirements, type, deadline, status } = req.body;

    const updateFields = {
      title,
      company,
      location,
      description,
      type,
      deadline,
    };

    if (requirements) {
      updateFields.requirements = Array.isArray(requirements)
        ? requirements
        : requirements.split(',').map((s) => s.trim());
    }

    if (status && req.user.role === 'admin') {
      updateFields.status = status;
    }

    job = await Job.findByIdAndUpdate(req.params.id, updateFields, { new: true, runValidators: true });
    return res.json({ success: true, job });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * @desc    Delete a job posting
 * @route   DELETE /api/jobs/:id
 * @access  Private (Recruiter/Coordinator)
 */
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, error: 'Job listing not found' });
    }

    // Check authorization
    if (job.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Not authorized to delete this job' });
    }

    await job.deleteOne();
    return res.json({ success: true, message: 'Job post deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
