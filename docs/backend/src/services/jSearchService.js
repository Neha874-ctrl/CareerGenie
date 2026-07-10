const axios = require('axios');

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;

/**
 * Fetch jobs from Remotive.com (completely free, no API key needed)
 * Covers remote tech/engineering/design/marketing jobs globally
 */
const fetchRemotiveJobs = async (query = 'developer') => {
  try {
    const url = `https://remotive.com/api/remote-jobs?search=${encodeURIComponent(query)}&limit=20`;
    const res = await axios.get(url, { timeout: 8000 });
    const jobs = res.data?.jobs || [];

    return jobs.map((job) => ({
      _id: `ext_remotive_${job.id}`,
      isExternal: true,
      title: job.title || 'Untitled Position',
      company: job.company_name || 'Unknown Company',
      companyLogo: job.company_logo || null,
      location: job.candidate_required_location || 'Remote / Worldwide',
      description: job.description ? job.description.replace(/<[^>]+>/g, ' ').substring(0, 500) : '',
      requirements: extractTags(job.tags || ''),
      qualifications: [],
      type: normalizeJobType(job.job_type),
      isRemote: true,
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      applyLink: job.url || null,
      postedAt: job.publication_date ? new Date(job.publication_date) : new Date(),
      source: 'Remotive',
      salary: job.salary || null,
      status: 'approved',
    }));
  } catch (error) {
    console.error('Remotive API error:', error.message);
    return [];
  }
};

/**
 * Fetch jobs from JSearch RapidAPI (requires subscribed RapidAPI key)
 * Aggregates Indeed, LinkedIn, Glassdoor, ZipRecruiter
 */
const fetchJSearchJobs = async ({ query = 'developer', location = 'India', page = 1 } = {}) => {
  if (!RAPIDAPI_KEY) return [];

  try {
    const res = await axios.get('https://jsearch.p.rapidapi.com/search', {
      params: {
        query: `${query} in ${location}`,
        page: String(page),
        num_pages: '1',
        date_posted: 'month',
      },
      headers: {
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'jsearch.p.rapidapi.com',
      },
      timeout: 10000,
    });

    const rawJobs = res.data?.data || [];
    return rawJobs.map((job) => ({
      _id: `ext_jsearch_${job.job_id}`,
      isExternal: true,
      title: job.job_title || 'Untitled Position',
      company: job.employer_name || 'Unknown Company',
      companyLogo: job.employer_logo || null,
      location: job.job_city
        ? `${job.job_city}${job.job_country ? ', ' + job.job_country : ''}`
        : job.job_country || 'Unspecified',
      description: job.job_description || '',
      requirements: job.job_required_skills || [],
      qualifications: [],
      type: normalizeJobType(job.job_employment_type),
      isRemote: job.job_is_remote || false,
      deadline: job.job_offer_expiration_datetime_utc
        ? new Date(job.job_offer_expiration_datetime_utc)
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      applyLink: job.job_apply_link || null,
      postedAt: job.job_posted_at_datetime_utc ? new Date(job.job_posted_at_datetime_utc) : new Date(),
      source: job.job_publisher || 'Indeed',
      salary: job.job_min_salary && job.job_max_salary
        ? `${job.job_salary_currency || '$'}${job.job_min_salary.toLocaleString()}–${job.job_max_salary.toLocaleString()}`
        : null,
      status: 'approved',
    }));
  } catch (error) {
    const status = error?.response?.status;
    const msg = error?.response?.data?.message || error.message;
    // 403/404 = not subscribed — silently fall back
    if (status === 403 || status === 404) {
      console.info(`JSearch not available (${status}): ${msg} — using Remotive only`);
    } else {
      console.error(`JSearch error [${status}]:`, msg);
    }
    return [];
  }
};

/**
 * Main entry: fetch external jobs from all available sources
 */
const searchExternalJobs = async ({ query = 'software engineer', location = 'India', page = 1 } = {}) => {
  // Run sources in parallel, gracefully degrade if one fails
  const [remotiveJobs, jSearchJobs] = await Promise.all([
    fetchRemotiveJobs(query),
    fetchJSearchJobs({ query, location, page }),
  ]);

  // Merge: JSearch first (more geo-relevant), then Remotive
  return [...jSearchJobs, ...remotiveJobs];
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

const normalizeJobType = (type) => {
  if (!type) return 'Full-time';
  const t = type.toLowerCase();
  if (t.includes('intern')) return 'Internship';
  if (t.includes('part')) return 'Part-time';
  if (t.includes('contract') || t.includes('freelance') || t.includes('temp')) return 'Contract';
  return 'Full-time';
};

const extractTags = (tags) => {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags.map((t) => t.name || t).filter(Boolean).slice(0, 8);
  return tags.split(',').map((s) => s.trim()).filter(Boolean).slice(0, 8);
};

module.exports = { searchExternalJobs };

