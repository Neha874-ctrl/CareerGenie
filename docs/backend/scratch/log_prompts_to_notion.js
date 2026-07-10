/**
 * Bulk-logs all user prompts from this CareerGenie development session
 * into the Notion "Prompts" database.
 */

const axios = require('axios');

const NOTION_TOKEN = 'ntn_m28498838765gez91Z1Y2p7zkLZjPhC3CuCu5PmqDkr57a';
const DATABASE_ID  = '3980a9dd-c6e4-8078-a29b-fa33d457a070';

// ─── All user prompts from this session ──────────────────────────────────────
const PROMPTS = [
  {
    name: 'Session Start – Fresh Project',
    prompt: 'we are starting fresh totally',
    quality: '🟡 Good',
    suggestion: 'More context about what "fresh" means would help – e.g. which parts to reset and which to keep.',
    agents: ['Project Setup'],
  },
  {
    name: 'AGENTS.md Notion Prompt Database Setup',
    prompt: 'populate the AGENTS.md file in such a way that the notion would have a database in which all the prompts would go there, from this application development. make sure to have the table for it, columns: prompt, prompt quality, suggestion. this must be followed within that particular database.',
    quality: '🟢 Excellent',
    suggestion: 'Well-structured requirement. Could additionally specify which Notion workspace and whether the database should be shared or private.',
    agents: ['Notion Integration', 'Documentation'],
  },
  {
    name: 'Verify Notion Prompts DB Connection',
    prompt: 'database of name prompts has been created see if this is working',
    quality: '🟡 Good',
    suggestion: 'Providing the database ID directly would speed up verification. A screenshot or link would also help confirm setup.',
    agents: ['Notion Integration'],
  },
  {
    name: 'Build Full Project from Notion Documentation',
    prompt: 'i have added content in my node account take the details from there and build my project will ful functionality and the color palette of the light theme is also mentioned in the documentation both frontend and backend should be working good',
    quality: '🟡 Good',
    suggestion: 'Breaking this into two separate requests (1. Read docs & plan, 2. Build) would reduce ambiguity. Specifying "Notion" explicitly instead of "node account" is clearer.',
    agents: ['Full-Stack Development', 'Frontend', 'Backend'],
  },
  {
    name: 'Add Theme Toggle + Fix Light Text Color',
    prompt: 'everything is good but you didn\'t include the toggle and also the color of the text is also very light change the color of all the text in the application to something dark and also tell me which api you need to make the backend functional i will provide you with those list them out for me',
    quality: '🟢 Excellent',
    suggestion: 'Effective bug report and clear action request. Listing multiple concerns in one prompt is fine here since they are all UI-related.',
    agents: ['Frontend', 'UI/UX', 'Theme'],
  },
  {
    name: 'Provide Gemini API Key',
    prompt: '[REDACTED_API_KEY] — this is my gemini api key and this is my mongodb uri place them in env file and wherever req',
    quality: '🟡 Good',
    suggestion: 'Avoid sharing API keys in plain text in chat. Use secure secret management (e.g. .env files or secret managers) and rotate keys after sharing.',
    agents: ['Backend', 'Environment Config'],
  },
  {
    name: 'Provide MongoDB Atlas URI',
    prompt: 'mongodb+srv://careergenie:EmCIzrZDSYL1T7sJ@careergenie.sm7qqow.mongodb.net/?appName=careergenie — this is my mongo uri use this also',
    quality: '🟡 Good',
    suggestion: 'Avoid pasting connection strings with credentials in chat. Use environment variable files or a secrets manager and rotate credentials after session.',
    agents: ['Backend', 'Database', 'Environment Config'],
  },
  {
    name: 'Debug 404 on /api/resume/latest and 500 on /api/resume/upload',
    prompt: 'Failed to load resource: the server responded with a status of 404 (Not Found) on /api/resume/latest and 500 (Internal Server Error) on /api/resume/upload — debug this error',
    quality: '🟢 Excellent',
    suggestion: 'Clear error report with exact endpoint and HTTP status codes. Including a stack trace or server log excerpt would make diagnosis even faster.',
    agents: ['Backend', 'Resume', 'Debugging'],
  },
  {
    name: 'Debug /api/resume/history 500 + PDF Upload Failure',
    prompt: 'Failed to load resource: the server responded with a status of 500 (Internal Server Error) on /api/resume/history — debug this error and the history is not getting updated as i am uploading my resume it is not shown in the history tab',
    quality: '🟢 Excellent',
    suggestion: 'Good dual-issue report. Mentioning the exact steps to reproduce (e.g. login → upload → navigate to history) would help pinpoint timing-related bugs.',
    agents: ['Backend', 'Resume', 'Debugging'],
  },
  {
    name: 'Add Resume History Page',
    prompt: 'i also want a history page where all my previous resumes checks and there feedback is stored',
    quality: '🟡 Good',
    suggestion: 'Good feature request. Adding detail on how to navigate to it (sidebar, navbar, dashboard) and whether feedback should be paginated would improve the spec.',
    agents: ['Frontend', 'Resume', 'Feature Request'],
  },
  {
    name: 'Improve Job Postings with Initial Listings and Keyword Search',
    prompt: 'now improve the area of job postings as there should be initially be some some job offers and after search match the keywords and give those job offers',
    quality: '🟡 Good',
    suggestion: 'Solid direction. Specifying how many seed jobs and what keyword-matching strategy is preferred (exact, fuzzy, semantic) would improve implementation precision.',
    agents: ['Frontend', 'Backend', 'Jobs', 'Feature Request'],
  },
  {
    name: 'Request Indeed-like Live Job Board',
    prompt: 'why only you have a list of 2-3 jobs i want it like indeed as there are job opening i should be notified tell if to access that you need some kind of key i will give it but make it like this',
    quality: '🟢 Excellent',
    suggestion: 'Great comparison reference (Indeed). Asking proactively about required API credentials shows good collaboration. A wireframe or screenshot reference would make it even clearer.',
    agents: ['Frontend', 'Backend', 'Jobs', 'External API'],
  },
  {
    name: 'Provide RapidAPI Key for JSearch',
    prompt: 'X-RapidAPI-Key: 10ed988ee0mshc05d17da0f40ce5p1916fcjsn8709051046ee — here is the key now do the essentials',
    quality: '🟡 Good',
    suggestion: 'Key was provided promptly. However, ensure the key is specifically subscribed to JSearch on RapidAPI before use. Avoid sharing API keys in plain text chat.',
    agents: ['External API', 'Jobs', 'JSearch'],
  },
  {
    name: 'Continue Integration',
    prompt: 'Continue',
    quality: '🔴 Poor',
    suggestion: 'Single-word continuation prompts are ambiguous. Instead, specify what to continue and what the acceptance criteria is. E.g. "Continue implementing the JSearch API integration and restart the backend".',
    agents: ['General'],
  },
  {
    name: 'Log All Session Prompts to Notion Database',
    prompt: 'ntn_m28498838765gez91Z1Y2p7zkLZjPhC3CuCu5PmqDkr57a — this is my notion access key now add all the prompts that are in this chat to the prompts database section in the notion',
    quality: '🟢 Excellent',
    suggestion: 'Good traceability practice. For production, avoid sharing integration tokens in chat — use environment variables. Consider automating prompt logging at the end of every session.',
    agents: ['Notion Integration', 'Documentation'],
  },
];

// ─── Notion API helpers ───────────────────────────────────────────────────────

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

const createPage = async (entry) => {
  const payload = {
    parent: { database_id: DATABASE_ID },
    properties: {
      Name: {
        title: [{ text: { content: entry.name } }],
      },
      Prompt: {
        rich_text: [{ text: { content: entry.prompt.substring(0, 2000) } }],
      },
      'Prompt Quality': {
        select: { name: entry.quality },
      },
      Suggestion: {
        rich_text: [{ text: { content: entry.suggestion.substring(0, 2000) } }],
      },
    },
  };

  const res = await axios.post('https://api.notion.com/v1/pages', payload, {
    headers: {
      Authorization: `Bearer ${NOTION_TOKEN}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json',
    },
  });

  return res.data.id;
};

// ─── Main ─────────────────────────────────────────────────────────────────────

(async () => {
  console.log(`\n🚀 Logging ${PROMPTS.length} prompts to Notion database...\n`);

  let success = 0;
  let failed  = 0;

  for (let i = 0; i < PROMPTS.length; i++) {
    const entry = PROMPTS[i];
    try {
      const pageId = await createPage(entry);
      console.log(`  ✅ [${i + 1}/${PROMPTS.length}] "${entry.name}" → ${pageId}`);
      success++;
      await delay(350); // Respect Notion rate limits (3 req/s)
    } catch (err) {
      const msg = err?.response?.data
        ? JSON.stringify(err.response.data)
        : err.message;
      console.error(`  ❌ [${i + 1}/${PROMPTS.length}] "${entry.name}" → FAILED: ${msg}`);
      failed++;
      await delay(500);
    }
  }

  console.log(`\n──────────────────────────────────────`);
  console.log(`Done! ✅ ${success} logged  ❌ ${failed} failed`);
  console.log(`View your database: https://notion.so/${DATABASE_ID.replace(/-/g, '')}`);
})();
