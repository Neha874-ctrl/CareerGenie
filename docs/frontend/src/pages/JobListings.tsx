import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { jobsAPI, resumeAPI } from '../services/api';
import toast from 'react-hot-toast';
import {
  Briefcase,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Filter,
  Globe,
  IndianRupee,
  MapPin,
  Search,
  Sparkles,
  TrendingUp,
  X,
  Zap,
} from 'lucide-react';

const JOB_TYPE_OPTIONS = [
  { value: '', label: 'All Types' },
  { value: 'Full-time', label: 'Full-time' },
  { value: 'Part-time', label: 'Part-time' },
  { value: 'Internship', label: 'Internship' },
  { value: 'Contract', label: 'Contract' },
];

const SOURCE_COLORS: Record<string, string> = {
  Indeed: 'bg-blue-50 text-blue-600 border-blue-200',
  LinkedIn: 'bg-sky-50 text-sky-600 border-sky-200',
  Glassdoor: 'bg-green-50 text-green-600 border-green-200',
  ZipRecruiter: 'bg-purple-50 text-purple-600 border-purple-200',
  JSearch: 'bg-social-bg text-gray-600 border-gray-200',
  CareerGenie: 'bg-accent-bg text-accent border-accent/20',
};

const JobListings: React.FC = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [type, setType] = useState('');
  const [hasResume, setHasResume] = useState(false);
  const [page, setPage] = useState(1);
  const [totalExternal, setTotalExternal] = useState(0);
  const [totalInternal, setTotalInternal] = useState(0);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearch(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(val);
      setPage(1);
    }, 500);
  };

  const checkResumeStatus = async () => {
    try {
      const res = await resumeAPI.getLatest();
      if (res.data.resume) setHasResume(true);
    } catch { /* ignore */ }
  };

  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);
      const response = await jobsAPI.getAll({
        search: debouncedSearch,
        type,
        page,
      });
      const data = response.data;
      setJobs(data.jobs || []);
      setTotalExternal(data.totalExternal ?? 0);
      setTotalInternal(data.totalInternal ?? 0);
    } catch {
      toast.error('Failed to load job listings');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, type, page]);

  useEffect(() => { checkResumeStatus(); }, []);
  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  const clearSearch = () => {
    setSearch('');
    setDebouncedSearch('');
    setPage(1);
  };

  const getMatchColor = (score: number) => {
    if (score >= 75) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 45) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-rose-600 bg-rose-50 border-rose-200';
  };

  const getSourceLabel = (job: any) => {
    if (!job.isExternal) return 'CareerGenie';
    return job.source || 'JSearch';
  };

  const highlightText = (text: string, term: string) => {
    if (!term.trim()) return text;
    const regex = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="bg-accent/20 text-accent font-bold rounded px-0.5">
          {part}
        </mark>
      ) : part
    );
  };

  return (
    <div className="flex-1 bg-code-bg/50 px-4 md:px-8 py-10 max-w-7xl mx-auto w-full text-left">

      {/* ─── Header ─────────────────────────────────────────────── */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-text-h mb-1.5 flex items-center gap-2.5">
            <Briefcase className="text-accent" />
            Explore Opportunities
          </h1>
          <p className="text-sm text-text-body/80">
            {hasResume
              ? `Live jobs from Indeed, LinkedIn & more — ranked by your resume match.`
              : 'Live jobs from Indeed, LinkedIn, Glassdoor & more. Upload your resume to see your match score.'}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {!loading && (
            <>
              <span className="text-xs bg-bg-custom border border-border-custom text-text-body font-semibold px-3 py-1.5 rounded-full">
                {totalInternal} internal
              </span>
              <span className="text-xs bg-accent-bg text-accent border border-accent/20 font-bold px-3 py-1.5 rounded-full">
                {totalExternal} live jobs
              </span>
            </>
          )}
        </div>
      </div>

      {/* ─── Search & Filter ─────────────────────────────────────── */}
      <div className="bg-bg-custom border border-border-custom rounded-2xl p-4 shadow-xs mb-5 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-body/40 pointer-events-none" />
          <input
            type="text"
            placeholder="Search jobs, skills, companies (e.g. React developer, AWS, Google)..."
            value={search}
            onChange={handleSearchChange}
            className="w-full pl-9 pr-9 py-2.5 bg-code-bg border border-border-custom rounded-xl text-sm focus:outline-none focus:border-accent text-text-h placeholder:text-text-body/40"
          />
          {search && (
            <button onClick={clearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-body/40 hover:text-text-h">
              <X size={14} />
            </button>
          )}
        </div>
        <div className="flex items-center bg-code-bg border border-border-custom rounded-xl px-3 min-w-[170px]">
          <Filter size={14} className="text-text-body/40 mr-2 shrink-0" />
          <select
            value={type}
            onChange={(e) => { setType(e.target.value); setPage(1); }}
            className="w-full py-2.5 bg-transparent text-sm text-text-h focus:outline-none cursor-pointer font-medium"
          >
            {JOB_TYPE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      </div>

      {/* Active filter chips */}
      {(debouncedSearch || type) && (
        <div className="flex flex-wrap gap-2 mb-5">
          {debouncedSearch && (
            <span className="inline-flex items-center text-xs bg-accent-bg text-accent border border-accent/20 px-3 py-1 rounded-full font-medium gap-1.5">
              <Search size={11} /> "{debouncedSearch}"
              <button onClick={clearSearch} className="opacity-60 hover:opacity-100"><X size={11} /></button>
            </span>
          )}
          {type && (
            <span className="inline-flex items-center text-xs bg-purple-50 text-purple-600 border border-purple-200 px-3 py-1 rounded-full font-medium gap-1.5">
              <Filter size={11} /> {type}
              <button onClick={() => { setType(''); setPage(1); }} className="opacity-60 hover:opacity-100"><X size={11} /></button>
            </span>
          )}
        </div>
      )}

      {/* Resume nudge banner */}
      {!hasResume && (
        <div className="bg-gradient-to-r from-accent/10 to-purple-50 border border-accent/20 p-4 rounded-2xl mb-7 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex items-start gap-3">
            <Sparkles size={18} className="text-accent mt-0.5 shrink-0" />
            <p className="text-sm font-medium text-accent">
              <span className="font-bold">Unlock AI match scores!</span> Upload your resume to see how well you fit each job.
            </p>
          </div>
          <Link to="/resume" className="px-4 py-2 bg-accent text-white rounded-xl text-xs font-bold hover:bg-accent/90 transition-all shrink-0">
            Upload Resume
          </Link>
        </div>
      )}

      {/* ─── Job Grid ────────────────────────────────────────────── */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="bg-bg-custom border border-border-custom rounded-3xl p-6 animate-pulse">
              <div className="h-3 bg-gray-200 rounded w-1/3 mb-4" />
              <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-5" />
              <div className="flex gap-1.5 mb-5">
                <div className="h-5 bg-gray-200 rounded-lg w-14" />
                <div className="h-5 bg-gray-200 rounded-lg w-16" />
                <div className="h-5 bg-gray-200 rounded-lg w-12" />
              </div>
              <div className="h-8 bg-gray-200 rounded-xl w-full" />
            </div>
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-24 bg-bg-custom border border-border-custom rounded-3xl">
          <Briefcase size={52} className="text-text-body/20 mx-auto mb-4" />
          <p className="text-base font-bold text-text-h mb-1">No jobs found</p>
          <p className="text-sm text-text-body/60 max-w-xs mx-auto mb-5">
            Try broader keywords — the search matches titles, skills, and job descriptions across all live sources.
          </p>
          <button onClick={clearSearch} className="text-xs text-accent hover:underline font-semibold">Clear filters</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {jobs.map((job, idx) => {
            const sourceLabel = getSourceLabel(job);
            const sourceClass = SOURCE_COLORS[sourceLabel] || SOURCE_COLORS['JSearch'];
            const isTopMatch = idx === 0 && job.matchPercentage !== undefined && jobs.length > 1;

            return (
              <div
                key={job._id}
                className="group bg-bg-custom border border-border-custom rounded-3xl p-5 shadow-xs hover:shadow-lg hover:border-accent/20 transition-all duration-200 flex flex-col"
              >
                {/* Top row: source badge + match badge */}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Source */}
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 ${sourceClass}`}>
                      {job.isExternal ? <Globe size={9} /> : <Sparkles size={9} />}
                      {sourceLabel}
                    </span>

                    {/* Job type */}
                    <span className="text-[10px] bg-social-bg text-text-body font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide">
                      {job.type}
                    </span>

                    {/* Remote badge */}
                    {job.isRemote && (
                      <span className="text-[10px] bg-teal-50 text-teal-600 border border-teal-200 font-bold px-2 py-0.5 rounded-full">
                        Remote
                      </span>
                    )}
                  </div>

                  {/* Match score */}
                  {job.matchPercentage !== undefined && (
                    <span className={`text-xs font-extrabold px-2.5 py-1 rounded-full border shrink-0 ml-2 ${getMatchColor(job.matchPercentage)}`}>
                      {job.matchPercentage}% Fit
                    </span>
                  )}
                </div>

                {/* Best fit / Top match badges */}
                {(isTopMatch || (job.matchPercentage !== undefined && job.matchPercentage >= 80)) && (
                  <div className="flex gap-2 mb-3">
                    {isTopMatch && (
                      <span className="text-[10px] bg-purple-50 text-purple-600 border border-purple-100 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <TrendingUp size={9} /> Best Fit
                      </span>
                    )}
                    {job.matchPercentage >= 80 && (
                      <span className="text-[10px] bg-emerald-50 text-emerald-600 border border-emerald-100 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Zap size={9} /> Top Match
                      </span>
                    )}
                  </div>
                )}

                {/* Match bar */}
                {job.matchPercentage !== undefined && (
                  <div className="w-full h-1 bg-social-bg rounded-full mb-4 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        job.matchPercentage >= 75 ? 'bg-emerald-400' :
                        job.matchPercentage >= 45 ? 'bg-amber-400' : 'bg-rose-400'
                      }`}
                      style={{ width: `${Math.min(job.matchPercentage, 100)}%` }}
                    />
                  </div>
                )}

                {/* Company logo + title */}
                <div className="flex items-start gap-3 mb-3">
                  {job.companyLogo ? (
                    <img
                      src={job.companyLogo}
                      alt={job.company}
                      className="w-10 h-10 rounded-xl object-contain border border-border-custom bg-code-bg shrink-0 p-0.5"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-accent-bg text-accent flex items-center justify-center text-base font-black shrink-0">
                      {(job.company || '?')[0].toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0">
                    <h2 className="text-sm font-extrabold text-text-h leading-snug group-hover:text-accent transition-colors line-clamp-2">
                      {highlightText(job.title, debouncedSearch)}
                    </h2>
                    <p className="text-xs text-accent font-semibold truncate">
                      {highlightText(job.company, debouncedSearch)}
                    </p>
                  </div>
                </div>

                {/* Location + deadline */}
                <div className="flex flex-col gap-1 mb-3">
                  <p className="text-xs text-text-body flex items-center gap-1.5">
                    <MapPin size={12} className="text-text-body/40 shrink-0" />
                    <span className="truncate">{job.location}</span>
                  </p>
                  <p className="text-xs text-text-body flex items-center gap-1.5">
                    <Calendar size={12} className="text-text-body/40 shrink-0" />
                    Apply by {new Date(job.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                  {job.salary && (
                    <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                      <IndianRupee size={12} className="shrink-0" />
                      {job.salary}
                    </p>
                  )}
                </div>

                {/* Skill tags */}
                {job.requirements?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {job.requirements.slice(0, 4).map((r: string, i: number) => (
                      <span key={i} className="text-[10px] bg-social-bg text-text-body font-medium px-2 py-0.5 rounded-md hover:bg-accent-bg hover:text-accent transition-colors">
                        {r}
                      </span>
                    ))}
                    {job.requirements.length > 4 && (
                      <span className="text-[10px] text-text-body/50 px-1 py-0.5">+{job.requirements.length - 4}</span>
                    )}
                  </div>
                )}

                {/* Match insights */}
                {job.matchInsights && (
                  <p className="text-[11px] text-text-body italic line-clamp-2 leading-relaxed bg-code-bg border border-border-custom/50 rounded-xl px-3 py-2 mb-4">
                    "{job.matchInsights}"
                  </p>
                )}

                {/* CTA button */}
                <div className="mt-auto">
                  {job.isExternal && job.applyLink ? (
                    <a
                      href={job.applyLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 py-2.5 bg-accent text-white rounded-xl text-xs font-bold hover:bg-accent/90 transition-all"
                    >
                      Apply on {sourceLabel}
                      <ExternalLink size={13} />
                    </a>
                  ) : (
                    <Link
                      to={`/jobs/${job._id}`}
                      className="w-full flex items-center justify-center gap-2 py-2.5 bg-code-bg hover:bg-accent hover:text-white border border-border-custom hover:border-transparent rounded-xl text-xs font-bold text-text-h transition-all"
                    >
                      View & Apply
                      <ChevronRight size={14} />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ─── Pagination ──────────────────────────────────────────── */}
      {!loading && jobs.length > 0 && (
        <div className="mt-10 flex items-center justify-center gap-4">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="flex items-center gap-2 px-4 py-2 bg-bg-custom border border-border-custom rounded-xl text-xs font-semibold text-text-body hover:border-accent hover:text-accent disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft size={14} /> Prev
          </button>
          <span className="text-xs font-bold text-text-h bg-accent-bg px-4 py-2 rounded-xl border border-accent/20">
            Page {page}
          </span>
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={totalExternal === 0 && page >= 1}
            className="flex items-center gap-2 px-4 py-2 bg-bg-custom border border-border-custom rounded-xl text-xs font-semibold text-text-body hover:border-accent hover:text-accent disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            Next <ChevronRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
};

export default JobListings;
