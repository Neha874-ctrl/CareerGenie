import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useSelector } from 'react-redux';
import { store } from './store/store';
import type { RootState } from './store/store';
import { Toaster } from 'react-hot-toast';

// Components & Pages
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import StudentDashboard from './pages/StudentDashboard';
import RecruiterDashboard from './pages/RecruiterDashboard';
import ResumeUpload from './pages/ResumeUpload';
import JobListings from './pages/JobListings';
import JobDetails from './pages/JobDetails';
import ResumeHistory from './pages/ResumeHistory';

import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminJobs from './pages/admin/AdminJobs';
import AdminResumes from './pages/admin/AdminResumes';
import AdminFeedback from './pages/admin/AdminFeedback';
import AdminNotifications from './pages/admin/AdminNotifications';

import './App.css';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactElement; allowedRoles?: string[] }> = ({
  children,
  allowedRoles,
}) => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Redirect to home if they don't have permission
    return <Navigate to="/" replace />;
  }

  return children;
};

const AppContent: React.FC = () => {
  return (
    <Router>
      <div id="root-container" className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <main className="flex-1 flex flex-col">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Student & Recruiter Jobs Search (shared protected) */}
            <Route
              path="/jobs"
              element={
                <ProtectedRoute allowedRoles={['student', 'recruiter', 'admin']}>
                  <JobListings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/jobs/:id"
              element={
                <ProtectedRoute allowedRoles={['student', 'recruiter', 'admin']}>
                  <JobDetails />
                </ProtectedRoute>
              }
            />

            {/* Student Dashboard & Resume */}
            <Route
              path="/dashboard/student"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/resume"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <ResumeUpload />
                </ProtectedRoute>
              }
            />
            <Route
              path="/resume/history"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <ResumeHistory />
                </ProtectedRoute>
              }
            />

            {/* Recruiter Dashboard */}
            <Route
              path="/dashboard/recruiter"
              element={
                <ProtectedRoute allowedRoles={['recruiter', 'admin']}>
                  <RecruiterDashboard />
                </ProtectedRoute>
              }
            />

            {/* Admin Command Panel */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="resumes" element={<AdminResumes />} />
              <Route path="jobs" element={<AdminJobs />} />
              <Route path="feedback" element={<AdminFeedback />} />
              <Route path="notifications" element={<AdminNotifications />} />
            </Route>

            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
      </div>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
};

export default App;
