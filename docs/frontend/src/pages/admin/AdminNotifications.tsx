import React, { useEffect, useState } from 'react';
import { adminAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { Bell, Send } from 'lucide-react';
import { useForm } from 'react-hook-form';

const AdminNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getAllNotifications();
      setNotifications(res.data.notifications);
    } catch (err) {
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleBroadcast = async (data: any) => {
    try {
      await adminAPI.createNotification(data);
      toast.success('Notification broadcasted successfully!');
      reset();
      fetchNotifications();
    } catch (err) {
      toast.error('Failed to send notification');
    }
  };

  return (
    <div className="text-left max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1">
        <div className="mb-6">
          <h1 className="text-3xl font-extrabold text-text-h mb-2">Notifications</h1>
          <p className="text-sm text-text-body/80 font-medium">Broadcast announcements to users across the platform.</p>
        </div>

        <div className="bg-bg-custom border border-border-custom rounded-3xl p-6 shadow-xs sticky top-8">
          <h2 className="text-lg font-bold text-text-h mb-4">New Broadcast</h2>
          <form onSubmit={handleSubmit(handleBroadcast)} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-text-h uppercase tracking-wide mb-2">Title</label>
              <input
                type="text"
                placeholder="Platform Maintenance Notice"
                {...register('title', { required: 'Title is required' })}
                className="w-full px-4 py-2.5 bg-code-bg border border-border-custom rounded-xl text-sm focus:outline-none focus:border-accent"
              />
              {errors.title && <span className="text-xs text-red-500 mt-1 block">{(errors.title as any).message}</span>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-h uppercase tracking-wide mb-2">Message</label>
              <textarea
                rows={4}
                placeholder="Details of the announcement..."
                {...register('message', { required: 'Message is required' })}
                className="w-full px-4 py-2.5 bg-code-bg border border-border-custom rounded-xl text-sm focus:outline-none focus:border-accent"
              ></textarea>
              {errors.message && <span className="text-xs text-red-500 mt-1 block">{(errors.message as any).message}</span>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-h uppercase tracking-wide mb-2">Target Audience</label>
              <select
                {...register('recipientRole')}
                className="w-full px-4 py-2.5 bg-code-bg border border-border-custom rounded-xl text-sm focus:outline-none focus:border-accent cursor-pointer"
              >
                <option value="all">All Users</option>
                <option value="student">Students Only</option>
                <option value="recruiter">Recruiters Only</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full px-4 py-3 bg-accent text-white font-bold text-xs rounded-xl hover:bg-accent/90 transition-all flex items-center justify-center space-x-2"
            >
              <Send size={16} />
              <span>Broadcast Now</span>
            </button>
          </form>
        </div>
      </div>

      <div className="lg:col-span-2">
        <div className="bg-bg-custom border border-border-custom rounded-3xl p-6 shadow-xs min-h-[500px]">
          <h2 className="text-lg font-bold text-text-h mb-6">Broadcast History</h2>
          
          {loading ? (
            <div className="flex justify-center p-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-20 text-text-body/60">
              <Bell size={40} className="mx-auto mb-4 opacity-30" />
              <p className="text-sm">No announcements have been sent yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map((n) => (
                <div key={n._id} className="border border-border-custom rounded-2xl p-4 flex items-start space-x-4">
                  <div className="bg-accent-bg p-3 rounded-xl text-accent">
                    <Bell size={20} />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-[9px] uppercase font-bold bg-social-bg text-text-body/80 px-2 py-0.5 rounded-md">
                        To: {n.recipientRole}
                      </span>
                      <span className="text-[10px] font-semibold text-text-body/60">
                        {new Date(n.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-text-h">{n.title}</h3>
                    <p className="text-xs text-text-body mt-1 leading-relaxed">{n.message}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminNotifications;
