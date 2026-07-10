const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Resume = require('../src/models/Resume');
const User = require('../src/models/User');

dotenv.config({ path: path.join(__dirname, '../.env') });

const connString = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/careergenie';

const run = async () => {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(connString);
    console.log('Connected.');
    
    // Find a student user first to use their ID
    const student = await User.findOne({ role: 'student' });
    if (!student) {
      console.log('No student user found in database. Cannot test query.');
      return;
    }
    
    console.log(`Found student user: ${student.email} (${student._id})`);
    
    console.log('Running Resume.find query...');
    const resumes = await Resume.find({ student: student._id }).sort({ createdAt: -1 });
    console.log(`Found ${resumes.length} resumes.`);
    console.log('Query completed successfully.');
  } catch (error) {
    console.error('Error occurred:', error.stack || error.message);
  } finally {
    await mongoose.disconnect();
  }
};

run();
