import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import { logout } from '../store/authSlice';
import { notificationsAPI } from '../services/api';
import { Bell, Briefcase, FileText, LayoutDashboard, LogOut, ShieldAlert, Sun, Moon, History } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const fetchNotifications = async () => {
    if (!isAuthenticated) return;
    try {
      const response = await notificationsAPI.getAll();
      setNotifications(response.data.notifications);
    } catch (err) {
      console.error('Failed to load notifications', err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000); // refresh every 10s
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const markAsRead = async (id: string) => {
    try {
      await notificationsAPI.markRead(id);
      setNotifications(prev =>
        prev.map(notif => (notif._id === id ? { ...notif, read: true } : notif))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <nav className="bg-bg-custom border-b border-border-custom px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-xs">
      <Link to="/" className="flex items-center space-x-2">
        <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-md shadow-accent/20">
          CG
        </div>
        <span className="font-bold text-2xl tracking-tight text-text-h">
          Career<span className="text-accent">Genie</span>
        </span>
      </Link>

      <div className="flex items-center space-x-6">
        {isAuthenticated && (
          <div className="hidden md:flex space-x-4 items-center">
            {user?.role === 'student' && (
              <>
                <Link to="/dashboard/student" className="flex items-center space-x-1 text-sm font-medium hover:text-accent transition-colors">
                  <LayoutDashboard size={16} />
                  <span>Dashboard</span>
                </Link>
                <Link to="/resume" className="flex items-center space-x-1 text-sm font-medium hover:text-accent transition-colors">
                  <FileText size={16} />
                  <span>AI Resume Builder</span>
                </Link>
                <Link to="/jobs" className="flex items-center space-x-1 text-sm font-medium hover:text-accent transition-colors">
                  <Briefcase size={16} />
                  <span>Match Jobs</span>
                </Link>
                <Link to="/resume/history" className="flex items-center space-x-1 text-sm font-medium hover:text-accent transition-colors">
                  <History size={16} />
                  <span>History</span>
                </Link>
              </>
            )}
            {user?.role === 'recruiter' && (
              <>
                <Link to="/dashboard/recruiter" className="flex items-center space-x-1 text-sm font-medium hover:text-accent transition-colors">
                  <LayoutDashboard size={16} />
                  <span>Dashboard</span>
                </Link>
                <Link to="/jobs" className="flex items-center space-x-1 text-sm font-medium hover:text-accent transition-colors">
                  <Briefcase size={16} />
                  <span>All Jobs</span>
                </Link>
              </>
            )}
            {user?.role === 'admin' && (
              <Link to="/admin" className="flex items-center space-x-1 text-sm font-medium hover:text-accent transition-colors">
                <ShieldAlert size={16} />
                <span>Admin Command</span>
              </Link>
            )}
          </div>
        )}

        <div className="flex items-center space-x-4">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-text-body hover:bg-accent-bg hover:text-accent transition-all cursor-pointer"
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          {isAuthenticated ? (
            <>
              {/* Notification Bell */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                  className="p-2 rounded-lg text-text-body hover:bg-accent-bg hover:text-accent transition-all relative"
                >
                  <Bell size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {showNotifDropdown && (
                  <div className="absolute right-0 mt-3 w-80 bg-bg-custom border border-border-custom rounded-2xl shadow-xl py-2 z-50 text-left max-h-96 overflow-y-auto">
                    <div className="px-4 py-2 border-b border-border-custom font-semibold text-text-h flex justify-between items-center">
                      <span>Notifications</span>
                      <span className="text-xs text-accent bg-accent-bg px-2 py-0.5 rounded-full">{unreadCount} unread</span>
                    </div>
                    {notifications.length === 0 ? (
                      <p className="text-sm text-text-body/60 text-center py-6 px-4">No notifications yet</p>
                    ) : (
                      notifications.map(notif => (
                        <div
                          key={notif._id}
                          onClick={() => markAsRead(notif._id)}
                          className={`px-4 py-3 hover:bg-accent-bg/30 transition-colors border-b border-border-custom last:border-0 cursor-pointer ${
                            !notif.read ? 'bg-accent-bg/10 font-medium' : ''
                          }`}
                        >
                          <p className="text-xs text-text-h mb-0.5">{notif.title}</p>
                          <p className="text-xs text-text-body">{notif.message}</p>
                          <span className="text-[10px] text-text-body/60 mt-1 block">
                            {new Date(notif.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* User profile details */}
              <div className="flex items-center space-x-3 border-l border-border-custom pl-4">
                <div className="w-8 h-8 rounded-full bg-accent-bg text-accent flex items-center justify-center font-semibold text-sm">
                  {user?.name.charAt(0).toUpperCase()}
                </div>
                <div className="hidden lg:block text-left">
                  <p className="text-xs font-semibold text-text-h leading-tight">{user?.name}</p>
                  <p className="text-[10px] text-accent font-medium uppercase leading-tight">{user?.role}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg text-red-500 hover:bg-red-50 hover:text-red-600 transition-all ml-1"
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-3">
              <Link
                to="/login"
                className="text-sm font-semibold text-text-body hover:text-accent transition-colors px-4 py-2"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                className="text-sm font-semibold bg-accent text-white px-5 py-2.5 rounded-xl hover:bg-accent/90 transition-all hover:shadow-lg hover:shadow-accent/20"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
