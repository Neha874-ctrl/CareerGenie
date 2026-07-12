require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

const seedJobs = async () => {
  try {
    const Job = require('./models/Job');
    const User = require('./models/User');
    
    const count = await Job.countDocuments();
    if (count > 0) {
      console.log('Jobs database already seeded.');
      return;
    }
    
    console.log('Seeding initial premium job offers...');
    let systemUser = await User.findOne({ email: 'system@careergenie.com' });
    if (!systemUser) {
      systemUser = await User.findOne({ role: { $in: ['admin', 'recruiter'] } });
    }
    if (!systemUser) {
      const bcrypt = require('bcrypt');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('systempassword123', salt);
      systemUser = await User.create({
        name: 'CareerGenie Recruiter',
        email: 'system@careergenie.com',
        password: hashedPassword,
        role: 'recruiter',
      });
    }
    
    const futureDate = new Date();
    futureDate.setMonth(futureDate.getMonth() + 3);
    
    await Job.create([
      {
        title: 'Software Engineer (React & Node.js)',
        company: 'TechCorp Solutions',
        location: 'Remote / Bengaluru, India',
        description: 'Join our core engineering team to build product platforms, build interfaces, scale databases, and engineer API integrations.',
        requirements: ['React', 'Node.js', 'JavaScript', 'MongoDB', 'Express', 'Git', 'REST APIs'],
        type: 'Full-time',
        deadline: futureDate,
        postedBy: systemUser._id,
        status: 'approved'
      },
      {
        title: 'Data Scientist & ML Developer',
        company: 'DataLabs AI',
        location: 'New York, USA',
        description: 'Build robust machine learning models, parse massive datasets, and analyze predictive trends to optimize corporate strategies.',
        requirements: ['Python', 'Machine Learning', 'SQL', 'Pandas', 'PyTorch', 'Data Visualization', 'Statistics'],
        type: 'Full-time',
        deadline: futureDate,
        postedBy: systemUser._id,
        status: 'approved'
      },
      {
        title: 'Frontend Developer Intern',
        company: 'Designify Agency',
        location: 'Remote / London, UK',
        description: 'Learn and construct highly interactive frontend components with Tailwind CSS and React, working directly with senior developers.',
        requirements: ['React', 'HTML5', 'CSS3', 'JavaScript', 'Tailwind CSS', 'Figma'],
        type: 'Internship',
        deadline: futureDate,
        postedBy: systemUser._id,
        status: 'approved'
      },
      {
        title: 'Technical Product Manager',
        company: 'SaaSify Inc',
        location: 'San Francisco, USA',
        description: 'Define key product milestones, manage agile engineering sprints, write documentation, and coordinate cross-functional product ships.',
        requirements: ['Product Management', 'Agile', 'Scrum', 'Roadmapping', 'UX design', 'Analytics'],
        type: 'Full-time',
        deadline: futureDate,
        postedBy: systemUser._id,
        status: 'approved'
      },
      {
        title: 'DevOps & Cloud Engineer',
        company: 'CloudScale Networks',
        location: 'Bengaluru, India',
        description: 'Automate build processes, secure AWS cloud deployments, establish CI/CD pipelines, and configure Kubernetes clusters.',
        requirements: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Linux', 'Terraform', 'Python'],
        type: 'Contract',
        deadline: futureDate,
        postedBy: systemUser._id,
        status: 'approved'
      }
    ]);
    console.log('Successfully seeded 5 initial premium job postings!');
  } catch (error) {
    console.error('Failed to seed jobs:', error.message);
  }
};

const connectDB = async () => {
  const connString = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/careergenie';
  const mongoose = require('mongoose');
  try {
    const conn = await mongoose.connect(connString);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    await seedJobs();
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

// Import Routes
const authRoutes = require('./routes/authRoutes');
const resumeRoutes = require('./routes/resumeRoutes');

const jobRoutes = require('./routes/jobRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const adminRoutes = require('./routes/adminRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');

const app = express();
app.set('trust proxy', 1);
// Connect to Database
connectDB();

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: false, // Allow frontend to fetch uploaded files
}));
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (Postman, mobile apps, server-to-server)
    if (!origin) return callback(null, true);

    const isLocalhost = /^http:\/\/localhost:\d+$/.test(origin);
    const isVercel = /^https:\/\/careergenie[^.]*\.vercel\.app$/.test(origin);
    const isAllowedEnv = process.env.CLIENT_URL && origin === process.env.CLIENT_URL;

    if (isLocalhost || isVercel || isAllowedEnv) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: origin ${origin} not allowed`));
    }
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());

// Logger
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 200 requests per window
  message: { success: false, error: 'Too many requests from this IP, please try again after 15 minutes' },
});
app.use('/api/', limiter);

// Serve static uploaded files
app.use('/src/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes Middleware
app.use('/api/auth', authRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/feedback', feedbackRoutes);

// Root route status check
app.get('/status', (req, res) => {
  res.json({ success: true, message: 'CareerGenie API is fully functional' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error',
  });
});

module.exports = app;