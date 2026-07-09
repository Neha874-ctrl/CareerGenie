import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { jobsAPI, resumeAPI } from '../services/api';
import toast from 'react-hot-toast';
import { Briefcase, Calendar, Filter, MapPin, Search } from 'lucide-react';

const JobListings: React.FC = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [hasResume, setHasResume] = useState(false);

  const checkResumeStatus = async () => {
    try {
      const resumeRes = await resumeAPI.getLatest();
      if (resumeRes.data.resume) {
        setHasResume(true);
      }
    } catch (err) {
      // Safe to ignore if user has no resume yet
    }
  };

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await jobsAPI.getAll({ search, type });
      setJobs(response.data.jobs);
    } catch (err: any) {
      toast.error('Failed to load job listings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkResumeStatus();
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [search, type]);

  const getMatchScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50 border-green-100';
    if (score >= 50) return 'text-amber-600 bg-amber-50 border-amber-100';
    return 'text-red-600 bg-red-50 border-red-100';
  };

  return (
    <div className="flex-1 bg-gray-50/50 px-6 py-10 max-w-6xl mx-auto w-full text-left">
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-text-h mb-2">Explore Opportunities</h1>
        <p className="text-sm text-text-body/80">Search and find matching job postings tailored to your skill sets.</p>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white border border-border-custom rounded-2xl p-4 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 items-center mb-8 shadow-xs">
        {/* Search */}
        <div className="relative w-full md:flex-1">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-text-body/60">
            <Search size={18} />
          </span>
          <input
            type="text"
            placeholder="Search by job title or company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-border-custom rounded-xl text-sm focus:outline-none focus:border-accent text-text-h"
          />
        </div>

        {/* Filter Dropdown */}
        <div className="relative w-full md:w-64 flex items-center bg-gray-50 border border-border-custom rounded-xl px-3 py-1">
          <Filter size={16} className="text-text-body/60 mr-2" />
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full py-2 bg-transparent text-sm text-text-h focus:outline-none cursor-pointer font-semibold"
          >
            <option value="">All Job Types</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Internship">Internship</option>
            <option value="Contract">Contract</option>
          </select>
        </div>
      </div>

      {/* Resume Reminder Notification Banner */}
      {!hasResume && (
        <div className="bg-accent-bg border border-accent-border/20 p-4 rounded-2xl mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
          <p className="text-xs font-semibold text-accent leading-relaxed">
            🚀 Tip: Upload your resume in the AI Builder tab to see compatibility match scores for each job posting!
          </p>
          <Link
            to="/resume"
            className="px-4 py-2 bg-accent text-white rounded-xl text-xs font-bold hover:bg-accent/90 transition-all shrink-0"
          >
            Upload Resume
          </Link>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-accent"></div>
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-20 bg-white border border-border-custom rounded-3xl">
          <Briefcase size={48} className="text-text-body/30 mx-auto mb-3" />
          <p className="text-sm font-semibold text-text-h">No job postings found</p>
          <p className="text-xs text-text-body/80 mt-1">Try updating your search queries or filter categories</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="bg-white border border-border-custom rounded-3xl p-6 shadow-xs hover:shadow-md hover:border-accent-border/20 transition-all flex flex-col"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] bg-accent-bg text-accent font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                  {job.type}
                </span>

                {/* Show match score badge */}
                {job.matchPercentage !== undefined && job.matchPercentage !== null && (
                  <span className={`text-xs font-extrabold px-3 py-1 rounded-full border ${getMatchScoreColor(job.matchPercentage)}`}>
                    {job.matchPercentage}% Fit
                  </span>
                )}
              </div>

              <h2 className="text-lg font-extrabold text-text-h mb-1 leading-snug">{job.title}</h2>
              <p className="text-sm text-accent font-semibold mb-4">{job.company}</p>

              <div className="space-y-2 mb-6">
                <p className="text-xs text-text-body flex items-center">
                  <MapPin size={14} className="mr-1.5 text-text-body/60" />
                  {job.location}
                </p>
                <p className="text-xs text-text-body flex items-center">
                  <Calendar size={14} className="mr-1.5 text-text-body/60" />
                  Deadline: {new Date(job.deadline).toLocaleDateString()}
                </p>
              </div>

              {job.matchInsights && (
                <div className="bg-gray-50 border border-border-custom/50 p-3 rounded-xl mb-6 text-xs text-text-body italic line-clamp-2 leading-relaxed">
                  "{job.matchInsights}"
                </div>
              )}

              <Link
                to={`/jobs/${job._id}`}
                className="w-full text-center py-2.5 bg-gray-50 hover:bg-accent hover:text-white border border-border-custom hover:border-transparent rounded-xl text-xs font-bold text-text-h transition-all mt-auto"
              >
                View Job & Apply
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobListings;
