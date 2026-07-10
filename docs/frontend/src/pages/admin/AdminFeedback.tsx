import React, { useEffect, useState } from 'react';
import { adminAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { MessageSquare, Trash2, CheckCircle2, Clock } from 'lucide-react';

const AdminFeedback: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getAllFeedback(1, statusFilter);
      setFeedbacks(res.data.feedback);
    } catch (err) {
      toast.error('Failed to load feedback');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, [statusFilter]);

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await adminAPI.updateFeedbackStatus(id, status);
      toast.success(`Feedback marked as ${status}`);
      fetchFeedback();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this feedback permanently?')) return;
    try {
      await adminAPI.deleteFeedback(id);
      toast.success('Feedback deleted');
      fetchFeedback();
    } catch (err) {
      toast.error('Failed to delete feedback');
    }
  };

  return (
    <div className="text-left max-w-6xl mx-auto w-full">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-text-h mb-2">User Feedback & Support</h1>
          <p className="text-sm text-text-body/80 font-medium">Review and resolve contact queries and platform feedback.</p>
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="mt-4 md:mt-0 px-4 py-3 bg-bg-custom border border-border-custom rounded-xl text-sm focus:outline-none focus:border-accent shadow-xs cursor-pointer"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="resolved">Resolved</option>
          <option value="spam">Spam</option>
        </select>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
          </div>
        ) : feedbacks.length === 0 ? (
          <div className="bg-bg-custom border border-border-custom rounded-3xl p-12 text-center text-text-body/60 text-sm">
            <MessageSquare size={40} className="mx-auto mb-4 opacity-30" />
            <p>No feedback found.</p>
          </div>
        ) : (
          feedbacks.map(fb => (
            <div key={fb._id} className="bg-bg-custom border border-border-custom rounded-3xl p-6 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <span className={`flex items-center space-x-1 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                    fb.status === 'resolved' ? 'bg-emerald-100 text-emerald-700' :
                    fb.status === 'spam' ? 'bg-red-100 text-red-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {fb.status === 'pending' && <Clock size={12} />}
                    {fb.status === 'resolved' && <CheckCircle2 size={12} />}
                    <span>{fb.status}</span>
                  </span>
                  <span className="text-[10px] font-semibold text-text-body/60">
                    {new Date(fb.createdAt).toLocaleString()}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-text-h mb-1">{fb.subject}</h3>
                <p className="text-xs text-text-body/80 mb-3"><span className="font-bold text-text-h">{fb.name}</span> &lt;{fb.email}&gt;</p>
                <div className="bg-code-bg/50 border border-border-custom p-4 rounded-xl">
                  <p className="text-sm text-text-body whitespace-pre-wrap">{fb.message}</p>
                </div>
              </div>

              <div className="flex flex-col space-y-2 md:ml-6 mt-4 md:mt-0 min-w-[120px]">
                {fb.status === 'pending' && (
                  <button
                    onClick={() => handleStatusUpdate(fb._id, 'resolved')}
                    className="w-full px-4 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl text-xs font-bold transition-colors shadow-sm"
                  >
                    Mark Resolved
                  </button>
                )}
                {fb.status !== 'spam' && (
                  <button
                    onClick={() => handleStatusUpdate(fb._id, 'spam')}
                    className="w-full px-4 py-2 bg-red-50 text-red-700 hover:bg-red-100 rounded-xl text-xs font-bold transition-colors shadow-sm"
                  >
                    Mark Spam
                  </button>
                )}
                <button
                  onClick={() => handleDelete(fb._id)}
                  className="w-full px-4 py-2 text-text-body hover:bg-social-bg rounded-xl text-xs font-bold transition-colors flex justify-center items-center space-x-1"
                >
                  <Trash2 size={14} />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminFeedback;
