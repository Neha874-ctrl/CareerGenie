const Feedback = require('../models/Feedback');

/**
 * @desc    Submit user feedback/support query
 * @route   POST /api/feedback
 * @access  Private (Student/Recruiter)
 */
exports.submitFeedback = async (req, res) => {
  try {
    const { subject, message } = req.body;
    if (!subject || !message) {
      return res.status(400).json({ success: false, error: 'Subject and message are required' });
    }

    const feedback = await Feedback.create({
      user: req.user.id,
      name: req.user.name,
      email: req.user.email,
      subject,
      message,
    });

    return res.status(201).json({ success: true, message: 'Feedback submitted successfully', feedback });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
