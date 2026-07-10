const { GoogleGenAI } = require('@google/genai');
const { logPromptToNotion } = require('./notionService');

// Initialize Gemini Client
let ai = null;
const apiKey = process.env.GEMINI_API_KEY;

if (apiKey && apiKey !== 'your_gemini_api_key') {
  try {
    ai = new GoogleGenAI({ apiKey });
  } catch (error) {
    console.error('Failed to initialize Google Gen AI Client:', error.message);
  }
}

/**
 * Generate mock resume feedback when Gemini API is unavailable.
 */
const generateMockFeedback = (text) => {
  // Regex skill extraction
  const commonSkills = [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'C\\+\\+', 'C#', 'Go', 'Rust',
    'HTML', 'CSS', 'React', 'Vue', 'Angular', 'Node\\.js', 'Express', 'Django',
    'Flask', 'Spring Boot', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Docker',
    'Kubernetes', 'AWS', 'GCP', 'Azure', 'Git', 'Linux', 'REST API', 'GraphQL', 'Redux'
  ];
  
  const extractedSkills = [];
  commonSkills.forEach(skillPattern => {
    const regex = new RegExp(`\\b${skillPattern}\\b`, 'gi');
    if (regex.test(text)) {
      // Return original capitalization from commonSkills list
      const matched = skillPattern.replace('\\', '');
      if (!extractedSkills.includes(matched)) {
        extractedSkills.push(matched);
      }
    }
  });

  // Extract education-like lines
  const educationKeywords = ['University', 'College', 'Bachelor', 'Master', 'B.Tech', 'M.Tech', 'B.Sc', 'M.Sc', 'Degree', 'Institute'];
  const educationLines = [];
  const lines = text.split('\n');
  lines.forEach(line => {
    if (educationKeywords.some(keyword => line.toLowerCase().includes(keyword.toLowerCase()))) {
      const trimmed = line.trim();
      if (trimmed.length > 5 && trimmed.length < 150 && !educationLines.includes(trimmed)) {
        educationLines.push(trimmed);
      }
    }
  });

  // Extract experience-like lines (lines containing dates, project, job titles)
  const experienceKeywords = ['Developer', 'Engineer', 'Intern', 'Analyst', 'Manager', 'Lead', 'Project', 'Experience', 'Work', 'Job', '2023', '2024', '2025', '2026'];
  const experienceLines = [];
  lines.forEach(line => {
    if (experienceKeywords.some(keyword => line.toLowerCase().includes(keyword.toLowerCase())) && !educationKeywords.some(k => line.toLowerCase().includes(k.toLowerCase()))) {
      const trimmed = line.trim();
      if (trimmed.length > 10 && trimmed.length < 150 && !experienceLines.includes(trimmed)) {
        experienceLines.push(trimmed);
      }
    }
  });

  // Default fallbacks if regex was dry
  if (extractedSkills.length === 0) extractedSkills.push('Communication', 'Problem Solving', 'Adaptability');
  if (educationLines.length === 0) educationLines.push('High School Diploma or equivalent candidate');
  if (experienceLines.length === 0) experienceLines.push('Personal Projects and hands-on coding challenges');

  return {
    skills: extractedSkills,
    education: educationLines.slice(0, 3),
    experience: experienceLines.slice(0, 5),
    feedback: {
      score: 75,
      formatting: {
        status: '🟡 Good',
        comments: [
          'The layout is readable but could benefit from a modern single-column layout.',
          'Ensure margins are consistent and bullet points are aligned.'
        ]
      },
      content: {
        status: '🟡 Good',
        comments: [
          'Add quantified achievements (e.g., "Improved load times by 20%") to your project descriptions.',
          'Add a strong professional summary at the top highlighting your career focus.'
        ]
      },
      skillsFeedback: {
        status: '🟢 Excellent',
        comments: [
          `Great technical skills detected: ${extractedSkills.slice(0, 5).join(', ')}.`,
          'Consider grouping technical tools by category (e.g. Languages, Frameworks, Databases).'
        ]
      },
      overallSuggestions: 'Overall, a competitive resume. Refine bullet points to emphasize impact over just listing duties.'
    }
  };
};

/**
 * Analyze resume text using Gemini, or fallback to Mock analysis if API key is not available.
 * @param {string} resumeText - Extracted text from PDF
 */
const analyzeResume = async (resumeText) => {
  const prompt = `
You are an expert HR manager and professional career coach. Your task is to analyze the following resume text and provide structured feedback.

Return a JSON object with the following fields:
{
  "skills": ["Skill1", "Skill2", ...],
  "education": ["Education details 1", ...],
  "experience": ["Work / Project experience details 1", ...],
  "feedback": {
    "score": 85, // out of 100
    "formatting": {
      "status": "🟢 Excellent" | "🟡 Good" | "🟠 Fair" | "🔴 Poor",
      "comments": ["comment 1", "comment 2"]
    },
    "content": {
      "status": "🟢 Excellent" | "🟡 Good" | "🟠 Fair" | "🔴 Poor",
      "comments": ["comment 1", "comment 2"]
    },
    "skillsFeedback": {
      "status": "🟢 Excellent" | "🟡 Good" | "🟠 Fair" | "🔴 Poor",
      "comments": ["comment 1", "comment 2"]
    },
    "overallSuggestions": "A concise paragraph summarizing suggestions"
  }
}

Analyze the resume text carefully to pull actual skills, education history, and experience.

Resume text:
${resumeText}
`;

  // Determine prompt quality & suggestions for Notion logging
  const quality = ai ? '🟢 Excellent' : '🟠 Fair';
  const suggestion = ai 
    ? 'Gemini 2.5 Flash is active with structured output parsing. Prompt is well-configured.' 
    : 'System is running in Offline Mock mode. Configure GEMINI_API_KEY in backend .env to enable true AI analysis.';

  // Log the prompt to Notion
  await logPromptToNotion({
    name: 'Resume Analysis Prompt',
    prompt: prompt,
    quality: quality,
    suggestion: suggestion,
    agents: ['Resume Builder']
  });

  if (!ai) {
    console.log('Gemini API Client not initialized. Using regex-based local fallback parser.');
    return generateMockFeedback(resumeText);
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const responseText = response.text;
    const parsedData = JSON.parse(responseText);
    return parsedData;
  } catch (error) {
    console.error('Gemini API Analysis failed. Falling back to local parser:', error.message);
    return generateMockFeedback(resumeText);
  }
};

module.exports = {
  analyzeResume,
};
