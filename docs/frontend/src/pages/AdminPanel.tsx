import React, { useEffect, useState } from 'react';
import { adminAPI } from '../services/api';
import toast from 'react-hot-toast';
import { Award, Briefcase, Check, ShieldAlert, Users, X } from 'lucide-react';

const AdminPanel: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [pendingJobs, setPendingJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const statsRes = await adminAPI.getStats();
      setStats(statsRes.data.stats);

      const pendingRes = await adminAPI.getPendingJobs();
      setPendingJobs(pendingRes.data.jobs);
    } catch (err: any) {
      toast.error('Failed to load admin reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleModerate = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await adminAPI.moderateJob(id, status);
      toast.success(`Job post ${status} successfully!`);
      // Update local state
      setPendingJobs(prev => prev.filter(job => job._id !== id));
      // Refresh stats
      const statsRes = await adminAPI.getStats();
      setStats(statsRes.data.stats);
    } catch (err) {
      toast.error('Failed to moderate job posting');
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex justify-center p-12">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-50/50 px-6 py-10 max-w-6xl mx-auto w-full text-left">
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-text-h mb-2 flex items-center space-x-2">
          <ShieldAlert className="text-accent" />
          <span>Admin Command Panel</span>
        </h1>
        <p className="text-sm text-text-body/80 font-medium">Moderate job postings, monitor user counts, and review platform metrics.</p>
      </div>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          {/* Card 1 */}
          <div className="bg-white border border-border-custom rounded-3xl p-5 shadow-xs">
            <Users className="text-accent mb-2" size={24} />
            <p className="text-[10px] uppercase font-bold text-text-body">Total Accounts</p>
            <p className="text-2xl font-black text-text-h mt-1">{stats.totalUsers}</p>
          </div>
          {/* Card 2 */}
          <div className="bg-white border border-border-custom rounded-3xl p-5 shadow-xs">
            <Briefcase className="text-accent mb-2" size={24} />
            <p className="text-[10px] uppercase font-bold text-text-body">Active Jobs</p>
            <p className="text-2xl font-black text-text-h mt-1">{stats.totalJobs}</p>
          </div>
          {/* Card 3 */}
          <div className="bg-white border border-border-custom rounded-3xl p-5 shadow-xs">
            <Award className="text-accent mb-2" size={24} />
            <p className="text-[10px] uppercase font-bold text-text-body">Resumes Parsed</p>
            <p className="text-2xl font-black text-text-h mt-1">{stats.totalResumes}</p>
          </div>
          {/* Card 4 */}
          <div className="bg-white border border-border-custom rounded-3xl p-5 shadow-xs">
            <Check className="text-accent mb-2" size={24} />
            <p className="text-[10px] uppercase font-bold text-text-body">Applications Sent</p>
            <p className="text-2xl font-black text-text-h mt-1">{stats.totalApplications}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Pending Moderation */}
        <div className="lg:col-span-2 bg-white border border-border-custom rounded-3xl p-6 shadow-xs">
          <h2 className="text-lg font-bold text-text-h mb-6">Pending Job Approvals</h2>

          {pendingJobs.length === 0 ? (
            <p className="text-xs text-text-body/60 text-center py-10">No jobs currently pending approval.</p>
          ) : (
            <div className="space-y-4">
              {pendingJobs.map((job) => (
                <div
                  key={job._id}
                  className="border border-border-custom hover:border-accent-border/20 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 transition-colors"
                >
                  <div>
                    <span className="text-[9px] bg-accent-bg text-accent font-bold px-2 py-0.5 rounded-full uppercase">
                      {job.type}
                    </span>
                    <h3 className="text-sm font-bold text-text-h mt-2 mb-0.5 leading-snug">{job.title}</h3>
                    <p className="text-xs text-text-body">{job.company} &bull; {job.location}</p>
                  </div>

                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleModerate(job._id, 'approved')}
                      className="px-3.5 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl text-xs font-bold transition-colors flex items-center space-x-1 cursor-pointer"
                    >
                      <Check size={14} />
                      <span>Approve</span>
                    </button>
                    <button
                      onClick={() => handleModerate(job._id, 'rejected')}
                      className="px-3.5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs font-bold transition-colors flex items-center space-x-1 cursor-pointer"
                    >
                      <X size={14} />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* User distribution */}
        {stats && (
          <div className="bg-white border border-border-custom rounded-3xl p-6 shadow-xs">
            <h2 className="text-lg font-bold text-text-h mb-6">User Distribution</h2>
            <div className="space-y-4 text-xs font-medium text-text-body">
              <div className="flex justify-between items-center py-2 border-b border-border-custom">
                <span>Students</span>
                <span className="text-text-h font-bold">{stats.roles.students}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border-custom">
                <span>Recruiters</span>
                <span className="text-text-h font-bold">{stats.roles.recruiters}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span>Administrators</span>
                <span className="text-text-h font-bold">{stats.roles.admins}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
