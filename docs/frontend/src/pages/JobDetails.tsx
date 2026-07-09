import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { jobsAPI, applicationsAPI, resumeAPI } from '../services/api';
import type { RootState } from '../store/store';
import toast from 'react-hot-toast';
import { ArrowLeft, Calendar, CheckCircle, MapPin } from 'lucide-react';

const JobDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const [hasResume, setHasResume] = useState(false);

  const fetchJobDetails = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const response = await jobsAPI.getById(id);
      setJob(response.data.job);

      // Check if student already applied
      if (isAuthenticated && user?.role === 'student') {
        const appsRes = await applicationsAPI.getStudentApplications();
        const applied = appsRes.data.applications.some((app: any) => app.job?._id === id);
        setAlreadyApplied(applied);

        // Check if student has resume
        try {
          const resumeRes = await resumeAPI.getLatest();
          if (resumeRes.data.resume) {
            setHasResume(true);
          }
        } catch (rErr) {}
      }
    } catch (err: any) {
      toast.error('Failed to load job details');
      navigate('/jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobDetails();
  }, [id, isAuthenticated]);

  const handleApply = async () => {
    if (!id) return;
    if (!hasResume) {
      toast.error('Please upload and analyze your resume first!');
      navigate('/resume');
      return;
    }

    setApplying(true);
    const toastId = toast.loading('Submitting application...');
    try {
      await applicationsAPI.apply(id);
      setAlreadyApplied(true);
      toast.success('Applied successfully!', { id: toastId });
    } catch (err: any) {
      const errMsg = err.response?.data?.error || 'Failed to submit application';
      toast.error(errMsg, { id: toastId });
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex justify-center p-12">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (!job) return null;

  return (
    <div className="flex-1 bg-gray-50/50 px-6 py-10 max-w-4xl mx-auto w-full text-left">
      <Link to="/jobs" className="inline-flex items-center text-xs font-bold text-accent hover:underline mb-6">
        <ArrowLeft size={14} className="mr-1" /> Back to listings
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Job details card */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-border-custom rounded-3xl p-6 shadow-xs">
            <span className="text-[10px] bg-accent-bg text-accent font-bold px-2.5 py-1 rounded-full uppercase tracking-wider mb-4 inline-block">
              {job.type}
            </span>

            <h1 className="text-2xl font-black text-text-h mb-1 leading-snug">{job.title}</h1>
            <p className="text-base text-accent font-semibold mb-6">{job.company}</p>

            <div className="grid grid-cols-2 gap-4 border-y border-border-custom py-4 mb-6">
              <div className="flex items-center text-xs text-text-body">
                <MapPin size={16} className="mr-2 text-text-body/60" />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center text-xs text-text-body">
                <Calendar size={16} className="mr-2 text-text-body/60" />
                <span>Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
              </div>
            </div>

            <div>
              <h2 className="text-sm font-extrabold text-text-h uppercase tracking-wide mb-3">Job Description</h2>
              <div className="text-xs text-text-body leading-relaxed whitespace-pre-line">
                {job.description}
              </div>
            </div>
          </div>

          <div className="bg-white border border-border-custom rounded-3xl p-6 shadow-xs">
            <h2 className="text-sm font-extrabold text-text-h uppercase tracking-wide mb-3">Key Requirements</h2>
            <div className="flex flex-wrap gap-1.5">
              {job.requirements?.map((req: string, idx: number) => (
                <span key={idx} className="text-xs bg-gray-100 text-text-h px-3 py-1.5 rounded-xl font-medium">
                  {req}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right side - Apply Panel */}
        <div className="space-y-6">
          <div className="bg-white border border-border-custom rounded-3xl p-6 shadow-xs sticky top-24">
            <h3 className="text-sm font-extrabold text-text-h uppercase tracking-wide mb-4">Application Panel</h3>

            {isAuthenticated && user?.role === 'student' ? (
              <div className="space-y-4">
                {/* Score section */}
                {job.matchPercentage !== null && job.matchPercentage !== undefined && (
                  <div className="bg-accent-bg/25 border border-accent-border/10 p-4 rounded-2xl mb-4">
                    <p className="text-[10px] text-accent uppercase font-bold tracking-wider leading-none">AI Profile Fit</p>
                    <p className="text-2xl font-black text-text-h mt-1 leading-none">{job.matchPercentage}% Match</p>

                    {job.matchInsights && (
                      <p className="text-[10px] text-text-body mt-3 italic leading-relaxed">
                        "{job.matchInsights}"
                      </p>
                    )}
                  </div>
                )}

                {alreadyApplied ? (
                  <div className="bg-green-50 border border-green-200 text-green-700 text-xs font-semibold p-4 rounded-xl flex items-center space-x-2">
                    <CheckCircle size={16} />
                    <span>You have applied for this job!</span>
                  </div>
                ) : (
                  <button
                    onClick={handleApply}
                    disabled={applying}
                    className="w-full py-3 bg-accent text-white font-bold rounded-xl hover:bg-accent/90 transition-all shadow-md shadow-accent/20 cursor-pointer text-xs"
                  >
                    {applying ? 'Applying...' : 'Apply for Job'}
                  </button>
                )}
              </div>
            ) : isAuthenticated ? (
              <p className="text-xs text-text-body/70 text-center py-4">
                Only students can submit job applications.
              </p>
            ) : (
              <div className="text-center py-4 space-y-3">
                <p className="text-xs text-text-body/75">Log in to view compatibility match scoring and apply.</p>
                <Link
                  to="/login"
                  className="block w-full text-center py-2.5 bg-accent text-white font-bold rounded-xl text-xs hover:bg-accent/90 transition-all"
                >
                  Log In to Apply
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
