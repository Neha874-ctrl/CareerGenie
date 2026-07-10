import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to automatically attach Auth Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Endpoints definitions
export const authAPI = {
  signup: (data: any) => api.post('/auth/signup', data),
  login: (data: any) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

export const resumeAPI = {
  upload: (formData: FormData) =>
    api.post('/resume/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  getLatest: () => api.get('/resume/latest'),
  getById: (id: string) => api.get(`/resume/${id}`),
  getHistory: () => api.get('/resume/history'),
};

export const jobsAPI = {
  getAll: (filters?: { search?: string; type?: string; skill?: string; page?: number }) => {
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    if (filters?.type) params.append('type', filters.type);
    if (filters?.skill) params.append('skill', filters.skill);
    if (filters?.page) params.append('page', String(filters.page));
    return api.get(`/jobs?${params.toString()}`);
  },
  getById: (id: string) => api.get(`/jobs/${id}`),
  create: (data: any) => api.post('/jobs', data),
  getRecruiterJobs: () => api.get('/jobs/recruiter/my'),
  update: (id: string, data: any) => api.put(`/jobs/${id}`, data),
  delete: (id: string) => api.delete(`/jobs/${id}`),
};

export const applicationsAPI = {
  apply: (jobId: string) => api.post(`/applications/apply/${jobId}`),
  getStudentApplications: () => api.get('/applications/student/my'),
  getJobApplicants: (jobId: string) => api.get(`/applications/job/${jobId}`),
  updateStatus: (id: string, status: string) => api.put(`/applications/${id}/status`, { status }),
};

export const notificationsAPI = {
  getAll: () => api.get('/notifications'),
  markRead: (id: string) => api.put(`/notifications/${id}/read`),
};

export const adminAPI = {
  // Stats
  getStats: () => api.get('/admin/stats'),

  // Job moderation
  getPendingJobs: () => api.get('/admin/jobs/pending'),
  getAllJobs: (filters?: { status?: string; search?: string; page?: number }) => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.page) params.append('page', String(filters.page));
    return api.get(`/admin/jobs?${params.toString()}`);
  },
  moderateJob: (id: string, status: string) => api.put(`/admin/jobs/${id}/moderate`, { status }),
  deleteJob: (id: string) => api.delete(`/admin/jobs/${id}`),

  // User management
  getAllUsers: (filters?: { role?: string; status?: string; search?: string; page?: number; limit?: number }) => {
    const params = new URLSearchParams();
    if (filters?.role) params.append('role', filters.role);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.page) params.append('page', String(filters.page));
    if (filters?.limit) params.append('limit', String(filters.limit));
    return api.get(`/admin/users?${params.toString()}`);
  },
  updateUserRole: (id: string, role: string) => api.put(`/admin/users/${id}/role`, { role }),
  updateUserStatus: (id: string, status: string) => api.put(`/admin/users/${id}/status`, { status }),
  deleteUser: (id: string) => api.delete(`/admin/users/${id}`),

  // Resume Management
  getAllResumes: (page: number = 1, limit: number = 20) => api.get(`/admin/resumes?page=${page}&limit=${limit}`),
  deleteResume: (id: string) => api.delete(`/admin/resumes/${id}`),

  // Feedback Management
  getAllFeedback: (page: number = 1, status?: string) => {
    const params = new URLSearchParams();
    params.append('page', String(page));
    if (status) params.append('status', status);
    return api.get(`/admin/feedback?${params.toString()}`);
  },
  updateFeedbackStatus: (id: string, status: string) => api.put(`/admin/feedback/${id}/status`, { status }),
  deleteFeedback: (id: string) => api.delete(`/admin/feedback/${id}`),

  // Notifications
  getAllNotifications: (page: number = 1) => api.get(`/admin/notifications?page=${page}`),
  createNotification: (data: { title: string; message: string; recipientRole?: string }) => api.post('/admin/notifications', data),

  // Settings
  getSettings: () => api.get('/admin/settings'),
  updateSettings: (data: any) => api.put('/admin/settings', data),
};

export const feedbackAPI = {
  submitFeedback: (data: { subject: string; message: string }) => api.post('/feedback', data),
};

export default api;
