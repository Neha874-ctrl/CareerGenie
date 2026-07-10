const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Job = require('../src/models/Job');

dotenv.config({ path: path.join(__dirname, '../.env') });

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const jobs = await Job.find().select('title company type status');
  console.log(`Total jobs: ${jobs.length}`);
  jobs.forEach((j, i) => {
    console.log(`  ${i + 1}. [${j.status}] ${j.title} @ ${j.company} (${j.type})`);
  });
  await mongoose.disconnect();
};
run().catch(console.error);
