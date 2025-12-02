import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
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

// Handle 401 errors (redirect to login)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (username: string, password: string) =>
    api.post('/auth/login', { username, password }),

  verify2FA: (username: string, token: string) =>
    api.post('/auth/verify-2fa', { username, token }),

  logout: () => api.post('/auth/logout'),

  getCurrentUser: () => api.get('/auth/me'),
};

// Whitelist API
export const whitelistAPI = {
  getAll: (params?: any) => api.get('/whitelists', { params }),

  getById: (id: number) => api.get(`/whitelists/${id}`),

  create: (data: any) => api.post('/whitelists', data),

  update: (id: number, data: any) => api.put(`/whitelists/${id}`, data),

  validate: (id: number, validationComment?: string) =>
    api.post(`/whitelists/${id}/validate`, { validationComment }),

  refuse: (id: number, refusalReason: string) =>
    api.post(`/whitelists/${id}/refuse`, { refusalReason }),

  delete: (id: number) => api.delete(`/whitelists/${id}`),

  getStats: () => api.get('/whitelists/stats'),
};

// Template API
export const templateAPI = {
  // Scenarios
  getScenarios: () => api.get('/templates/scenarios'),

  createScenario: (data: any) => api.post('/templates/scenarios', data),

  updateScenario: (id: number, data: any) => api.put(`/templates/scenarios/${id}`, data),

  deleteScenario: (id: number) => api.delete(`/templates/scenarios/${id}`),

  // Rule Questions
  getRuleQuestions: () => api.get('/templates/rule-questions'),

  createRuleQuestion: (data: any) => api.post('/templates/rule-questions', data),

  updateRuleQuestion: (id: number, data: any) => api.put(`/templates/rule-questions/${id}`, data),

  deleteRuleQuestion: (id: number) => api.delete(`/templates/rule-questions/${id}`),

  // Lexicon Questions
  getLexiconQuestions: () => api.get('/templates/lexicon-questions'),

  createLexiconQuestion: (data: any) => api.post('/templates/lexicon-questions', data),

  updateLexiconQuestion: (id: number, data: any) => api.put(`/templates/lexicon-questions/${id}`, data),

  deleteLexiconQuestion: (id: number) => api.delete(`/templates/lexicon-questions/${id}`),
};

// Admin API
export const adminAPI = {
  getAll: () => api.get('/admins'),

  getById: (id: number) => api.get(`/admins/${id}`),

  create: (data: any) => api.post('/admins', data),

  update: (id: number, data: any) => api.put(`/admins/${id}`, data),

  updateOwnProfile: (data: { username?: string; password?: string; currentPassword?: string }) =>
    api.put('/admins/me/profile', data),

  delete: (id: number) => api.delete(`/admins/${id}`),

  updatePermissions: (id: number, permissions: any) =>
    api.put(`/admins/${id}/permissions`, permissions),
};

// Chat API
export const chatAPI = {
  getMessages: (params?: any) => api.get('/chat/messages', { params }),

  sendMessage: (message: string, room?: string) => api.post('/chat/messages', { message, room }),

  deleteMessage: (id: number) => api.delete(`/chat/messages/${id}`),

  getOnlineAdmins: () => api.get('/chat/admins'),
};

// Ticket API
export const ticketAPI = {
  getAll: (params?: any) => api.get('/tickets', { params }),

  getById: (id: number) => api.get(`/tickets/${id}`),

  create: (data: any) => api.post('/tickets', data),

  update: (id: number, data: any) => api.put(`/tickets/${id}`, data),

  delete: (id: number) => api.delete(`/tickets/${id}`),

  addComment: (ticketId: number, content: string) =>
    api.post(`/tickets/${ticketId}/comments`, { content }),
};

// Statistics API
export const statsAPI = {
  getDashboard: () => api.get('/stats/dashboard'),

  getWhitelistStats: (period?: string) => api.get('/stats/whitelists', { params: { period } }),

  getAdminStats: () => api.get('/stats/admins'),
};

export default api;
