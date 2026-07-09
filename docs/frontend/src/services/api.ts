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
  getStats: () => api.get('/admin/stats'),
  getPendingJobs: () => api.get('/admin/jobs/pending'),
  moderateJob: (id: string, status: string) => api.put(`/admin/jobs/${id}/moderate`, { status }),
};

export default api;
