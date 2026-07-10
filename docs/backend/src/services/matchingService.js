/**
 * Calculate the match score and generate matching insights between a resume and a job listing.
 * @param {Object} resume - Mongoose Resume document or object
 * @param {Object} job - Mongoose Job document or object
 */
const calculateMatchScore = (resume, job) => {
  const resumeSkills = (resume.skills || []).map((s) => s.toLowerCase().trim());
  const jobRequirements = (job.requirements || []).map((r) => r.toLowerCase().trim());

  if (jobRequirements.length === 0) {
    return {
      matchPercentage: 100,
      matchInsights: 'This job posting has no specific skill requirements. You are a perfect fit!',
    };
  }

  const matchedSkills = [];
  const missingSkills = [];

  job.requirements.forEach((req) => {
    const normalizedReq = req.toLowerCase().trim();
    // Check if requirement is partially or fully contained in resume skills
    const isMatched = resumeSkills.some(
      (skill) => skill.includes(normalizedReq) || normalizedReq.includes(skill)
    );

    if (isMatched) {
      matchedSkills.push(req);
    } else {
      missingSkills.push(req);
    }
  });

  const matchPercentage = Math.round((matchedSkills.length / jobRequirements.length) * 100);

  let matchInsights = '';
  if (matchedSkills.length === jobRequirements.length) {
    matchInsights = `Perfect match! You have all the requested skills: ${matchedSkills.join(', ')}.`;
  } else if (matchedSkills.length > 0) {
    matchInsights = `Good match! You meet ${matchedSkills.length} out of ${jobRequirements.length} requirements. Matched: ${matchedSkills.join(', ')}. Missing: ${missingSkills.join(', ')}.`;
  } else {
    matchInsights = `Low match. You don't have the listed skills. Try picking up: ${missingSkills.join(', ')}.`;
  }

  return {
    matchPercentage,
    matchInsights,
  };
};

module.exports = {
  calculateMatchScore,
};
