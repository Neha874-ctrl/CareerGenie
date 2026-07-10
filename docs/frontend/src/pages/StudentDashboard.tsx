import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { resumeAPI, applicationsAPI, jobsAPI } from '../services/api';
import { Calendar, CheckCircle, FileText, UploadCloud } from 'lucide-react';
import toast from 'react-hot-toast';

const StudentDashboard: React.FC = () => {
  const [resume, setResume] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Fetch latest resume
      try {
        const resumeRes = await resumeAPI.getLatest();
        setResume(resumeRes.data.resume);
      } catch (err) {
        // Safe to ignore if student hasn't uploaded a resume yet
      }

      // Fetch student applications
      const appsRes = await applicationsAPI.getStudentApplications();
      setApplications(appsRes.data.applications);

      // Fetch matched jobs
      const jobsRes = await jobsAPI.getAll();
      setJobs(jobsRes.data.jobs.slice(0, 3)); // show top 3 recommendations
    } catch (err: any) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Applied':
        return 'bg-blue-50 text-blue-600 border border-blue-100';
      case 'Under Review':
        return 'bg-amber-50 text-amber-600 border border-amber-100';
      case 'Interviewing':
        return 'bg-purple-50 text-purple-600 border border-purple-100';
      case 'Accepted':
        return 'bg-green-50 text-green-600 border border-green-100';
      case 'Rejected':
        return 'bg-red-50 text-red-600 border border-red-100';
      default:
        return 'bg-code-bg text-gray-600 border border-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-code-bg/50 px-6 py-10 max-w-6xl mx-auto w-full text-left">
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-text-h mb-2">Student Workspace</h1>
        <p className="text-sm text-text-body/80">Manage your resume profile, track application processes, and view matches.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Columns - Resume and Applications */}
        <div className="lg:col-span-2 space-y-8">
          {/* Resume Card */}
          <div className="bg-bg-custom border border-border-custom rounded-3xl p-6 shadow-xs">
            <h2 className="text-xl font-bold text-text-h mb-4 flex items-center space-x-2">
              <FileText className="text-accent" />
              <span>Resume Analysis Profile</span>
            </h2>

            {resume ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-accent-bg/20 p-4 rounded-2xl border border-accent-border/10">
                  <div>
                    <p className="text-xs font-semibold uppercase text-accent tracking-wide">Resume Score</p>
                    <p className="text-3xl font-extrabold text-text-h">{resume.feedback?.score || 75}/100</p>
                  </div>
                  <Link
                    to="/resume"
                    className="px-4 py-2 text-xs font-semibold bg-accent text-white rounded-xl hover:bg-accent/90 transition-all"
                  >
                    View Report Feedback
                  </Link>
                </div>

                <div>
                  <p className="text-xs font-semibold text-text-h uppercase tracking-wider mb-2">Skills Detected</p>
                  <div className="flex flex-wrap gap-1.5">
                    {resume.skills?.slice(0, 10).map((skill: string, index: number) => (
                      <span key={index} className="text-xs bg-social-bg text-text-h px-3 py-1 rounded-lg">
                        {skill}
                      </span>
                    ))}
                    {resume.skills?.length > 10 && (
                      <span className="text-xs text-accent bg-accent-bg px-3 py-1 rounded-lg font-semibold">
                        +{resume.skills.length - 10} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="border-2 border-dashed border-border-custom rounded-2xl p-8 text-center flex flex-col items-center">
                <UploadCloud size={48} className="text-text-body/40 mb-3" />
                <h3 className="text-sm font-bold text-text-h mb-1">No Resume Uploaded</h3>
                <p className="text-xs text-text-body/70 max-w-xs mb-4">
                  Upload your resume in PDF format to enable AI score checking and match jobs instantly!
                </p>
                <Link
                  to="/resume"
                  className="px-5 py-2.5 bg-accent text-white font-semibold text-xs rounded-xl hover:bg-accent/90 transition-all shadow-sm shadow-accent/20"
                >
                  Upload Resume
                </Link>
              </div>
            )}
          </div>

          {/* Application History Tracker */}
          <div className="bg-bg-custom border border-border-custom rounded-3xl p-6 shadow-xs">
            <h2 className="text-xl font-bold text-text-h mb-6 flex items-center space-x-2">
              <CheckCircle className="text-accent" />
              <span>Application Tracker</span>
            </h2>

            {applications.length === 0 ? (
              <p className="text-sm text-text-body/60 text-center py-10">No applications sent yet. Search for matching jobs to apply!</p>
            ) : (
              <div className="space-y-4">
                {applications.map((app: any) => (
                  <div
                    key={app._id}
                    className="border border-border-custom hover:border-accent-border/30 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 transition-colors"
                  >
                    <div>
                      <h3 className="text-sm font-bold text-text-h">{app.job?.title}</h3>
                      <p className="text-xs text-text-body">{app.job?.company} &bull; {app.job?.location}</p>
                      <p className="text-[10px] text-text-body/70 mt-1 flex items-center">
                        <Calendar size={10} className="mr-1" />
                        Applied: {new Date(app.appliedAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <span className="text-xs font-semibold text-accent block">AI Match: {app.matchPercentage}%</span>
                      </div>
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusColor(app.status)}`}>
                        {app.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Recommended Jobs */}
        <div className="space-y-8">
          <div className="bg-bg-custom border border-border-custom rounded-3xl p-6 shadow-xs">
            <h2 className="text-xl font-bold text-text-h mb-6 flex items-center justify-between">
              <span>Matching Jobs</span>
              <Link to="/jobs" className="text-xs text-accent hover:underline font-semibold">View All</Link>
            </h2>

            {!resume ? (
              <p className="text-xs text-text-body/70 text-center py-8">
                Upload your resume to display personalized job match recommendations.
              </p>
            ) : jobs.length === 0 ? (
              <p className="text-xs text-text-body/60 text-center py-8">No matching jobs found at this time.</p>
            ) : (
              <div className="space-y-4">
                {jobs.map((job: any) => (
                  <div key={job._id} className="border border-border-custom rounded-2xl p-4 hover:border-accent-border/20 transition-all">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] bg-accent-bg text-accent font-semibold px-2 py-0.5 rounded-full">
                        {job.type}
                      </span>
                      <span className="text-xs font-extrabold text-accent">{job.matchPercentage || 80}% Fit</span>
                    </div>
                    <h3 className="text-sm font-bold text-text-h mb-0.5">{job.title}</h3>
                    <p className="text-xs text-text-body mb-3">{job.company} &bull; {job.location}</p>
                    <Link
                      to={`/jobs/${job._id}`}
                      className="w-full text-center block py-2 border border-border-custom hover:border-accent-border/30 hover:bg-accent-bg/10 rounded-xl text-xs font-semibold text-text-h hover:text-accent transition-all"
                    >
                      Details & Apply
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
