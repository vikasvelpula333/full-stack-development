import api from './api';

export const authService = {
  // User authentication
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  // User profile
  getProfile: async () => {
    const response = await api.get('/profile');
    return response.data.data;
  },

  // Teacher management
  getTeachers: async () => {
    const response = await api.get('/teachers');
    return response.data;
  },

  getTeacher: async (id) => {
    const response = await api.get(`/teachers/${id}`);
    return response.data;
  },

  updateTeacher: async (id, data) => {
    const response = await api.put(`/teachers/${id}`, data);
    return response.data;
  },

  deleteTeacher: async (id) => {
    const response = await api.delete(`/teachers/${id}`);
    return response.data;
  },

  searchTeachers: async (searchTerm) => {
    const response = await api.get(`/teachers/search?q=${encodeURIComponent(searchTerm)}`);
    return response.data;
  },

  // Health check
  healthCheck: async () => {
    const response = await api.get('/health');
    return response.data;
  }
};
