import React, { useEffect, useState } from 'react';
import { adminAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { Check, X, Search, Briefcase, Trash2 } from 'lucide-react';

const AdminJobs: React.FC = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getAllJobs({ status: statusFilter, search: searchTerm, page: 1 });
      setJobs(res.data.jobs);
    } catch (err) {
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => fetchJobs(), 500);
    return () => clearTimeout(delay);
  }, [statusFilter, searchTerm]);

  const handleModerate = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await adminAPI.moderateJob(id, status);
      toast.success(`Job marked as ${status}`);
      fetchJobs();
    } catch (err) {
      toast.error('Failed to update job status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this job post permanently?')) return;
    try {
      await adminAPI.deleteJob(id);
      toast.success('Job deleted');
      fetchJobs();
    } catch (err) {
      toast.error('Failed to delete job');
    }
  };

  return (
    <div className="text-left max-w-6xl mx-auto w-full">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-text-h mb-2">Job Moderation</h1>
          <p className="text-sm text-text-body/80 font-medium">Review, approve, and manage recruiter job postings.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-body/50" size={18} />
          <input
            type="text"
            placeholder="Search jobs or companies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-bg-custom border border-border-custom rounded-xl text-sm focus:outline-none focus:border-accent shadow-xs"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-3 bg-bg-custom border border-border-custom rounded-xl text-sm focus:outline-none focus:border-accent shadow-xs cursor-pointer min-w-[150px]"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
          </div>
        ) : jobs.length === 0 ? (
          <div className="bg-bg-custom border border-border-custom rounded-3xl p-12 text-center text-text-body/60 text-sm">
            No jobs found.
          </div>
        ) : (
          jobs.map(job => (
            <div key={job._id} className="bg-bg-custom border border-border-custom rounded-3xl p-6 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                    job.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                    job.status === 'rejected' ? 'bg-red-100 text-red-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {job.status}
                  </span>
                  <span className="text-[10px] bg-accent-bg text-accent font-bold px-2 py-0.5 rounded-full uppercase">
                    {job.type}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-text-h mb-1 flex items-center">
                  <Briefcase className="mr-2 text-text-body/50" size={16} />
                  {job.title}
                </h3>
                <p className="text-sm text-text-body">{job.company} &bull; {job.location}</p>
                <p className="text-xs text-text-body/70 mt-2 truncate max-w-2xl">{job.description}</p>
              </div>

              <div className="flex items-center space-x-2">
                {job.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleModerate(job._id, 'approved')}
                      className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-colors flex items-center space-x-1 shadow-sm"
                    >
                      <Check size={14} />
                      <span>Approve</span>
                    </button>
                    <button
                      onClick={() => handleModerate(job._id, 'rejected')}
                      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs font-bold transition-colors flex items-center space-x-1 shadow-sm"
                    >
                      <X size={14} />
                      <span>Reject</span>
                    </button>
                  </>
                )}
                <button
                  onClick={() => handleDelete(job._id)}
                  className="p-2 ml-2 text-text-body hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors border border-transparent hover:border-red-200"
                  title="Delete Job"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminJobs;
