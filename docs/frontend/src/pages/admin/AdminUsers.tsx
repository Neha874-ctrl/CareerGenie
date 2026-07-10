import React, { useEffect, useState } from 'react';
import { adminAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { Search, ShieldAlert, Ban, CheckCircle2, UserX } from 'lucide-react';

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getAllUsers({ search: searchTerm, role: roleFilter, limit: 50 });
      setUsers(res.data.users);
    } catch (err) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchUsers();
    }, 500);
    return () => clearTimeout(delay);
  }, [searchTerm, roleFilter]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await adminAPI.updateUserStatus(id, newStatus);
      toast.success(`User ${newStatus === 'blocked' ? 'blocked' : 'unblocked'}`);
      fetchUsers();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to update status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to completely delete this user and all associated data?')) return;
    try {
      await adminAPI.deleteUser(id);
      toast.success('User deleted successfully');
      fetchUsers();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to delete user');
    }
  };

  return (
    <div className="text-left max-w-6xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-text-h mb-2">User Management</h1>
        <p className="text-sm text-text-body/80 font-medium">Search, block, and manage platform accounts.</p>
      </div>

      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-body/50" size={18} />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-bg-custom border border-border-custom rounded-xl text-sm focus:outline-none focus:border-accent shadow-xs"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-4 py-3 bg-bg-custom border border-border-custom rounded-xl text-sm focus:outline-none focus:border-accent shadow-xs cursor-pointer min-w-[150px]"
        >
          <option value="">All Roles</option>
          <option value="student">Students</option>
          <option value="recruiter">Recruiters</option>
          <option value="admin">Admins</option>
        </select>
      </div>

      <div className="bg-bg-custom border border-border-custom rounded-3xl overflow-hidden shadow-xs">
        {loading ? (
          <div className="flex justify-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center text-text-body/60 text-sm">No users found matching your search.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-code-bg/50">
                <tr className="border-b border-border-custom text-text-body/70 text-xs uppercase tracking-wider">
                  <th className="py-4 px-6 font-bold">User</th>
                  <th className="py-4 px-6 font-bold">Role</th>
                  <th className="py-4 px-6 font-bold">Status</th>
                  <th className="py-4 px-6 font-bold">Joined</th>
                  <th className="py-4 px-6 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-custom/50">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-code-bg/30 transition-colors">
                    <td className="py-4 px-6">
                      <p className="font-bold text-text-h">{user.name}</p>
                      <p className="text-xs text-text-body">{user.email}</p>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-[10px] uppercase font-bold text-text-body/80 bg-social-bg px-2.5 py-1 rounded-full">
                        {user.role}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      {user.status === 'blocked' ? (
                        <span className="flex items-center space-x-1 text-red-600 text-xs font-bold">
                          <Ban size={14} />
                          <span>Blocked</span>
                        </span>
                      ) : (
                        <span className="flex items-center space-x-1 text-emerald-600 text-xs font-bold">
                          <CheckCircle2 size={14} />
                          <span>Active</span>
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-text-body/80 text-xs">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex justify-end space-x-2">
                        {user.status === 'blocked' ? (
                          <button
                            onClick={() => handleStatusChange(user._id, 'active')}
                            className="p-2 text-text-body hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-colors"
                            title="Unblock User"
                          >
                            <ShieldAlert size={16} />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleStatusChange(user._id, 'blocked')}
                            className="p-2 text-text-body hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors"
                            title="Block User"
                          >
                            <Ban size={16} />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="p-2 text-text-body hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                          title="Delete User"
                        >
                          <UserX size={16} />
                        </button>
                      </div>
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

export default AdminUsers;
