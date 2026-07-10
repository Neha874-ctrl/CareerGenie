const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { PDFParse } = require('pdf-parse');
const Resume = require('../models/Resume');
const { analyzeResume } = require('../services/aiService');

// Configure Multer
const uploadDirectory = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF resumes are supported!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
});

/**
 * @desc    Upload and Analyze Resume
 * @route   POST /api/resume/upload
 * @access  Private (Student)
 */
const uploadAndAnalyzeResume = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'Please upload a PDF resume' });
  }

  try {
    const filePath = req.file.path;
    const fileBuffer = fs.readFileSync(filePath);

    // Parse PDF text
    const u8 = new Uint8Array(fileBuffer);
    const parser = new PDFParse(u8);
    await parser.load();
    const pdfData = await parser.getText();
    const parsedText = pdfData.text;

    if (!parsedText || parsedText.trim().length === 0) {
      // Remove local file
      fs.unlinkSync(filePath);
      return res.status(400).json({
        success: false,
        error: 'Could not extract text from the PDF. Ensure it contains selectable text, not scanned images.',
      });
    }

    // Call AI service to analyze
    const aiAnalysis = await analyzeResume(parsedText);

    // Save to Database
    const resume = await Resume.create({
      student: req.user.id,
      filePath: `/src/uploads/${req.file.filename}`, // relative path for server
      parsedText: parsedText,
      skills: aiAnalysis.skills || [],
      experience: aiAnalysis.experience || [],
      education: aiAnalysis.education || [],
      feedback: aiAnalysis.feedback || {},
    });

    return res.status(201).json({
      success: true,
      message: 'Resume uploaded and analyzed successfully',
      resume,
    });
  } catch (error) {
    // Delete file if error occurs
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    console.error('Error during resume upload and analysis:', error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * @desc    Get Latest Student Resume
 * @route   GET /api/resume/latest
 * @access  Private (Student)
 */
const getLatestResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ student: req.user.id }).sort({ createdAt: -1 });
    return res.json({ success: true, resume: resume || null });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * @desc    Get Resume By ID
 * @route   GET /api/resume/:id
 * @access  Private
 */
const getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) {
      return res.status(404).json({ success: false, error: 'Resume not found' });
    }

    // Security check: Only the owning student or recruiters/admins can view
    if (req.user.role === 'student' && resume.student.toString() !== req.user.id) {
      return res.status(403).json({ success: false, error: 'Access denied to this resume' });
    }

    return res.json({ success: true, resume });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * @desc    Get All Student Resumes
 * @route   GET /api/resume/history
 * @access  Private (Student)
 */
const getAllResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ student: req.user.id }).sort({ createdAt: -1 });
    return res.json({ success: true, resumes });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * @desc    Delete a student's own resume
 * @route   DELETE /api/resume/:id
 * @access  Private (Student)
 */
const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, student: req.user.id });
    if (!resume) {
      return res.status(404).json({ success: false, error: 'Resume not found or access denied' });
    }

    // Remove physical file if it exists
    if (resume.filePath && fs.existsSync(resume.filePath)) {
      fs.unlinkSync(resume.filePath);
    }

    await resume.deleteOne();
    return res.json({ success: true, message: 'Resume deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  upload,
  uploadAndAnalyzeResume,
  getLatestResume,
  getResumeById,
  getAllResumes,
  deleteResume,
};
