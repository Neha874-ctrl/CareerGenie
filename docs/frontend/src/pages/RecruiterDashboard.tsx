import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { jobsAPI, applicationsAPI } from '../services/api';
import toast from 'react-hot-toast';
import { Briefcase, PlusCircle, Trash, Users } from 'lucide-react';

const RecruiterDashboard: React.FC = () => {
  const [myJobs, setMyJobs] = useState<any[]>([]);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [applicants, setApplicants] = useState<any[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [loadingApplicants, setLoadingApplicants] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const fetchRecruiterJobs = async () => {
    try {
      setLoadingJobs(true);
      const response = await jobsAPI.getRecruiterJobs();
      setMyJobs(response.data.jobs);
    } catch (err: any) {
      toast.error('Failed to load your job postings');
    } finally {
      setLoadingJobs(false);
    }
  };

  useEffect(() => {
    fetchRecruiterJobs();
  }, []);

  const handleSelectJob = async (job: any) => {
    if (selectedJob?._id === job._id) {
      setSelectedJob(null);
      setApplicants([]);
      return;
    }

    setSelectedJob(job);
    try {
      setLoadingApplicants(true);
      const response = await applicationsAPI.getJobApplicants(job._id);
      setApplicants(response.data.applicants);
    } catch (err) {
      toast.error('Failed to load applicant pipeline');
    } finally {
      setLoadingApplicants(false);
    }
  };

  const handleCreateJob = async (data: any) => {
    try {
      await jobsAPI.create(data);
      toast.success('Job listing posted successfully!');
      setShowCreateForm(false);
      reset();
      fetchRecruiterJobs();
    } catch (err: any) {
      const errMsg = err.response?.data?.error || 'Failed to post job listing';
      toast.error(errMsg);
    }
  };

  const handleDeleteJob = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this job posting?')) return;
    try {
      await jobsAPI.delete(id);
      toast.success('Job posting deleted.');
      if (selectedJob?._id === id) {
        setSelectedJob(null);
        setApplicants([]);
      }
      fetchRecruiterJobs();
    } catch (err) {
      toast.error('Failed to delete job listing');
    }
  };

  const handleUpdateStatus = async (appId: string, status: string) => {
    try {
      await applicationsAPI.updateStatus(appId, status);
      toast.success(`Applicant status updated to: ${status}`);
      // Refresh applicants list
      if (selectedJob) {
        const response = await applicationsAPI.getJobApplicants(selectedJob._id);
        setApplicants(response.data.applicants);
      }
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="flex-1 bg-code-bg/50 px-6 py-10 max-w-6xl mx-auto w-full text-left">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-extrabold text-text-h mb-2">Recruiter Workspace</h1>
          <p className="text-sm text-text-body/80 font-medium">Create job descriptions, manage candidates, and view AI scoring analytics.</p>
        </div>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="px-5 py-3 bg-accent text-white font-bold text-xs rounded-xl hover:bg-accent/90 transition-all flex items-center space-x-1.5 shadow-md shadow-accent/20 cursor-pointer"
        >
          <PlusCircle size={16} />
          <span>{showCreateForm ? 'View Job List' : 'Post Internship / Job'}</span>
        </button>
      </div>

      {showCreateForm ? (
        /* Create Job Form */
        <div className="bg-bg-custom border border-border-custom rounded-3xl p-6 shadow-xs max-w-2xl">
          <h2 className="text-xl font-bold text-text-h mb-6">Post New Opening</h2>

          <form onSubmit={handleSubmit(handleCreateJob)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Job Title */}
              <div className="text-left">
                <label className="block text-xs font-semibold text-text-h uppercase tracking-wide mb-2">Job Title</label>
                <input
                  type="text"
                  placeholder="Software Engineer Intern"
                  {...register('title', { required: 'Job title is required' })}
                  className="w-full px-4 py-2.5 bg-code-bg border border-border-custom rounded-xl text-sm focus:outline-none focus:border-accent text-text-h"
                />
                {errors.title && <span className="text-xs text-red-500 mt-1 block">{(errors.title as any).message}</span>}
              </div>

              {/* Company Name */}
              <div className="text-left">
                <label className="block text-xs font-semibold text-text-h uppercase tracking-wide mb-2">Company Name</label>
                <input
                  type="text"
                  placeholder="CareerGenie Inc"
                  {...register('company', { required: 'Company is required' })}
                  className="w-full px-4 py-2.5 bg-code-bg border border-border-custom rounded-xl text-sm focus:outline-none focus:border-accent text-text-h"
                />
                {errors.company && <span className="text-xs text-red-500 mt-1 block">{(errors.company as any).message}</span>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Location */}
              <div className="text-left">
                <label className="block text-xs font-semibold text-text-h uppercase tracking-wide mb-2">Location</label>
                <input
                  type="text"
                  placeholder="New York, NY (Hybrid)"
                  {...register('location', { required: 'Location is required' })}
                  className="w-full px-4 py-2.5 bg-code-bg border border-border-custom rounded-xl text-sm focus:outline-none focus:border-accent text-text-h"
                />
                {errors.location && <span className="text-xs text-red-500 mt-1 block">{(errors.location as any).message}</span>}
              </div>

              {/* Job Type */}
              <div className="text-left">
                <label className="block text-xs font-semibold text-text-h uppercase tracking-wide mb-2">Job Type</label>
                <select
                  {...register('type', { required: true })}
                  className="w-full px-4 py-2.5 bg-code-bg border border-border-custom rounded-xl text-sm focus:outline-none focus:border-accent text-text-h cursor-pointer"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Internship">Internship</option>
                  <option value="Contract">Contract</option>
                </select>
              </div>

              {/* Deadline */}
              <div className="text-left">
                <label className="block text-xs font-semibold text-text-h uppercase tracking-wide mb-2">Application Deadline</label>
                <input
                  type="date"
                  {...register('deadline', { required: 'Deadline is required' })}
                  className="w-full px-4 py-2.5 bg-code-bg border border-border-custom rounded-xl text-sm focus:outline-none focus:border-accent text-text-h"
                />
                {errors.deadline && <span className="text-xs text-red-500 mt-1 block">{(errors.deadline as any).message}</span>}
              </div>
            </div>

            {/* Key Skill Requirements */}
            <div className="text-left">
              <label className="block text-xs font-semibold text-text-h uppercase tracking-wide mb-2">Required Skills (Comma separated)</label>
              <input
                type="text"
                placeholder="React, TypeScript, Node.js, MongoDB, Git"
                {...register('requirements', { required: 'Requirements are required' })}
                className="w-full px-4 py-2.5 bg-code-bg border border-border-custom rounded-xl text-sm focus:outline-none focus:border-accent text-text-h"
              />
              <p className="text-[10px] text-text-body/70 mt-1">Provide critical skills. Matches are calculated against these items.</p>
              {errors.requirements && <span className="text-xs text-red-500 mt-1 block">{(errors.requirements as any).message}</span>}
            </div>

            {/* Description */}
            <div className="text-left">
              <label className="block text-xs font-semibold text-text-h uppercase tracking-wide mb-2">Job Description</label>
              <textarea
                rows={5}
                placeholder="Detail job tasks, responsibilities, and qualifications..."
                {...register('description', { required: 'Description is required' })}
                className="w-full px-4 py-2.5 bg-code-bg border border-border-custom rounded-xl text-sm focus:outline-none focus:border-accent text-text-h"
              ></textarea>
              {errors.description && <span className="text-xs text-red-500 mt-1 block">{(errors.description as any).message}</span>}
            </div>

            <button
              type="submit"
              className="px-6 py-3 bg-accent text-white font-bold text-xs rounded-xl hover:bg-accent/90 transition-all shadow-sm shadow-accent/20 cursor-pointer"
            >
              Submit Job Posting
            </button>
          </form>
        </div>
      ) : (
        /* Job Listing & Pipelines */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Active Job list */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-lg font-bold text-text-h mb-2 flex items-center space-x-1.5">
              <Briefcase size={20} className="text-accent" />
              <span>Your Postings</span>
            </h2>

            {loadingJobs ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto"></div>
            ) : myJobs.length === 0 ? (
              <p className="text-xs text-text-body/60 py-6">You have not posted any jobs yet.</p>
            ) : (
              myJobs.map((job) => (
                <div
                  key={job._id}
                  onClick={() => handleSelectJob(job)}
                  className={`border p-4 rounded-2xl hover:border-accent-border/30 transition-all cursor-pointer relative flex justify-between items-start ${
                    selectedJob?._id === job._id ? 'border-accent bg-accent-bg/10' : 'border-border-custom bg-bg-custom'
                  }`}
                >
                  <div>
                    <span className="text-[9px] bg-accent-bg text-accent font-bold px-2 py-0.5 rounded-full uppercase">
                      {job.type}
                    </span>
                    <h3 className="text-sm font-bold text-text-h mt-2 mb-0.5 leading-snug">{job.title}</h3>
                    <p className="text-[11px] text-text-body">{job.company} &bull; {job.location}</p>
                  </div>
                  <button
                    onClick={(e) => handleDeleteJob(job._id, e)}
                    className="p-1.5 text-text-body/50 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    title="Delete Job"
                  >
                    <Trash size={14} />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Applicant Pipeline details */}
          <div className="lg:col-span-2 space-y-4 bg-bg-custom border border-border-custom rounded-3xl p-6 shadow-xs">
            <h2 className="text-lg font-bold text-text-h mb-6 flex items-center space-x-1.5">
              <Users size={20} className="text-accent" />
              <span>Applicant Pipeline</span>
            </h2>

            {!selectedJob ? (
              <div className="text-center py-20">
                <Briefcase size={36} className="text-text-body/25 mx-auto mb-2" />
                <p className="text-xs text-text-body/75">Select one of your postings on the left to review applicants.</p>
              </div>
            ) : loadingApplicants ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
              </div>
            ) : applicants.length === 0 ? (
              <p className="text-xs text-text-body/60 py-10 text-center">No students have applied for "{selectedJob.title}" yet.</p>
            ) : (
              <div className="space-y-6">
                {applicants.map((app) => (
                  <div key={app._id} className="border border-border-custom rounded-2xl p-4 space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0 border-b border-border-custom/50 pb-3">
                      <div>
                        <h3 className="text-sm font-extrabold text-text-h">{app.student?.name}</h3>
                        <p className="text-xs text-text-body">{app.student?.email}</p>
                      </div>

                      <div className="flex items-center space-x-4">
                        <span className="text-xs font-black text-accent bg-accent-bg px-2.5 py-1 rounded-full">
                          {app.matchPercentage}% Fit
                        </span>

                        {/* Status Select dropdown */}
                        <select
                          value={app.status}
                          onChange={(e) => handleUpdateStatus(app._id, e.target.value)}
                          className="text-xs font-bold border border-border-custom bg-code-bg rounded-xl px-3 py-1.5 focus:outline-none focus:border-accent text-text-h cursor-pointer"
                        >
                          <option value="Applied">Applied</option>
                          <option value="Under Review">Under Review</option>
                          <option value="Interviewing">Interviewing</option>
                          <option value="Accepted">Accepted</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </div>
                    </div>

                    {/* Applicant resume structure */}
                    <div className="space-y-3">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-text-h block mb-1">Key Skills Detected</span>
                        <div className="flex flex-wrap gap-1">
                          {app.resume?.skills?.map((skill: string, idx: number) => (
                            <span key={idx} className="text-[10px] bg-social-bg text-text-h px-2 py-0.5 rounded-md">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      {app.matchInsights && (
                        <div className="bg-accent-bg/15 border border-accent-border/5 p-3 rounded-xl">
                          <span className="text-[9px] uppercase font-bold text-accent block mb-1">AI Match Insights</span>
                          <p className="text-xs text-text-body italic leading-relaxed">
                            "{app.matchInsights}"
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RecruiterDashboard;
