import React, { useEffect, useState } from 'react';
import { adminAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { Award, Briefcase, Check, Users, Activity } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const statsRes = await adminAPI.getStats();
      setStats(statsRes.data.stats);
    } catch (err: any) {
      toast.error('Failed to load admin reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex justify-center p-12">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (!stats) return null;

  const roleData = [
    { name: 'Students', value: stats.roles.students },
    { name: 'Recruiters', value: stats.roles.recruiters },
    { name: 'Admins', value: stats.roles.admins },
  ];
  const COLORS = ['#6366f1', '#10b981', '#f59e0b'];

  const atsData = [
    { name: '90-100', count: stats.atsDistribution?.excellent || 0 },
    { name: '80-89', count: stats.atsDistribution?.good || 0 },
    { name: '70-79', count: stats.atsDistribution?.average || 0 },
    { name: '< 70', count: stats.atsDistribution?.poor || 0 },
  ];

  return (
    <div className="text-left max-w-6xl mx-auto w-full">
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-text-h mb-2">Admin Dashboard</h1>
        <p className="text-sm text-text-body/80 font-medium">Overview of platform metrics and recent activity.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-white border border-border-custom rounded-3xl p-5 shadow-xs">
          <Users className="text-indigo-500 mb-2" size={24} />
          <p className="text-[10px] uppercase font-bold text-text-body">Total Users</p>
          <p className="text-2xl font-black text-text-h mt-1">{stats.totalUsers}</p>
        </div>
        <div className="bg-white border border-border-custom rounded-3xl p-5 shadow-xs">
          <Award className="text-emerald-500 mb-2" size={24} />
          <p className="text-[10px] uppercase font-bold text-text-body">Resumes Parsed</p>
          <p className="text-2xl font-black text-text-h mt-1">{stats.totalResumes}</p>
        </div>
        <div className="bg-white border border-border-custom rounded-3xl p-5 shadow-xs">
          <Briefcase className="text-blue-500 mb-2" size={24} />
          <p className="text-[10px] uppercase font-bold text-text-body">Active Jobs</p>
          <p className="text-2xl font-black text-text-h mt-1">{stats.jobs.approvedJobs}</p>
        </div>
        <div className="bg-white border border-border-custom rounded-3xl p-5 shadow-xs">
          <Check className="text-amber-500 mb-2" size={24} />
          <p className="text-[10px] uppercase font-bold text-text-body">Applications</p>
          <p className="text-2xl font-black text-text-h mt-1">{stats.totalApplications}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        {/* Users Chart */}
        <div className="bg-white border border-border-custom rounded-3xl p-6 shadow-xs">
          <h2 className="text-lg font-bold text-text-h mb-6">User Distribution</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={roleData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {roleData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ATS Scores Chart */}
        <div className="bg-white border border-border-custom rounded-3xl p-6 shadow-xs">
          <h2 className="text-lg font-bold text-text-h mb-6">ATS Score Distribution</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={atsData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                <Tooltip cursor={{ fill: '#f3f4f6' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white border border-border-custom rounded-3xl p-6 shadow-xs">
        <h2 className="text-lg font-bold text-text-h mb-6 flex items-center space-x-2">
          <Activity className="text-accent" size={20} />
          <span>Recent Signups</span>
        </h2>
        
        {stats.recentUsers.length === 0 ? (
          <p className="text-xs text-text-body/60 py-4">No recent users.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border-custom text-text-body/70 text-xs uppercase tracking-wider">
                  <th className="py-3 px-4 font-bold">Name</th>
                  <th className="py-3 px-4 font-bold">Email</th>
                  <th className="py-3 px-4 font-bold">Role</th>
                  <th className="py-3 px-4 font-bold">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-custom/50">
                {stats.recentUsers.map((user: any) => (
                  <tr key={user._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-4 font-bold text-text-h">{user.name}</td>
                    <td className="py-4 px-4 text-text-body">{user.email}</td>
                    <td className="py-4 px-4">
                      <span className={`text-[10px] uppercase font-bold px-2.5 py-1 rounded-full ${
                        user.role === 'admin' ? 'bg-amber-100 text-amber-700' :
                        user.role === 'recruiter' ? 'bg-blue-100 text-blue-700' :
                        'bg-emerald-100 text-emerald-700'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-text-body/80 text-xs">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
