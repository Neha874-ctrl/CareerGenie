import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, FileText, Briefcase, MessageSquare, Bell, LogOut, Settings } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice';
import toast from 'react-hot-toast';

const AdminLayout: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Users', path: '/admin/users', icon: Users },
    { name: 'Resumes', path: '/admin/resumes', icon: FileText },
    { name: 'Jobs', path: '/admin/jobs', icon: Briefcase },
    { name: 'Feedback', path: '/admin/feedback', icon: MessageSquare },
    { name: 'Notifications', path: '/admin/notifications', icon: Bell },
  ];

  return (
    <div className="flex h-screen bg-code-bg/50 w-full overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-bg-custom border-r border-border-custom flex flex-col hidden md:flex">
        <div className="p-6 border-b border-border-custom flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-accent text-white flex items-center justify-center font-black text-sm">
            CG
          </div>
          <span className="font-extrabold text-text-h tracking-tight text-lg">Admin Panel</span>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === '/admin'}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  isActive
                    ? 'bg-accent text-white shadow-md shadow-accent/20'
                    : 'text-text-body hover:bg-code-bg hover:text-text-h'
                }`
              }
            >
              <item.icon size={18} />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-border-custom space-y-1">
          <button
            className="flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold text-text-body hover:bg-code-bg hover:text-text-h w-full transition-all"
            onClick={() => toast('Settings coming soon', { icon: '⚙️' })}
          >
            <Settings size={18} />
            <span>Settings</span>
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 w-full transition-all"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
