import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
api.interceptors.request.use(
  config => {
    // Add JWT token to requests (except login)
    const token = localStorage.getItem('token');
    if (token && !config.url.includes('/auth/login')) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    console.error('API request error:', error);
    
    // Handle 401 unauthorized errors
    if (error.response && error.response.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('token');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// API方法定义
export default {
  // Authentication
  login: (password) => api.post('/auth/login', { password }),
  // Server control
  getServerStatus: () => api.get('/status'),
  startServer: () => api.post('/start'),
  stopServer: () => api.post('/stop'),
  restartServer: () => api.post('/restart'),

  // Server configuration
  getServerConfig: () => api.get('/config'),
  updateServerConfig: (config) => api.put('/config', config),

  // Allowlist management
  getAllowlist: () => api.get('/allowlist'),
  addToAllowlist: (entry) => api.post('/allowlist', entry),
  removeFromAllowlist: (name) => api.delete(`/allowlist/${name}`),

  // Permission management
  getPermissions: () => api.get('/permissions'),
  updatePermission: (permission) => api.put('/permissions', permission),
  removePermission: (xuid) => api.delete(`/permissions/${xuid}`),

  // World management
  getWorlds: () => api.get('/worlds'),
  uploadWorld: (formData) => api.post('/worlds/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deleteWorld: (name) => api.delete(`/worlds/${name}`),
  activateWorld: (name) => api.put(`/worlds/${name}/activate`),

  // Resource pack management
  getResourcePacks: () => api.get('/resource-packs'),
  uploadResourcePack: (formData) => api.post('/resource-packs/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  activateResourcePack: (uuid) => api.put(`/resource-packs/${uuid}/activate`),
  deactivateResourcePack: (uuid) => api.put(`/resource-packs/${uuid}/deactivate`),
  deleteResourcePack: (uuid) => api.delete(`/resource-packs/${uuid}`),

  // Server version management
  getServerVersions: () => api.get('/server-versions'),
  downloadServerVersion: (version) => api.post(`/server-versions/${version}/download`),
  getDownloadProgress: (version) => api.get(`/server-versions/${version}/progress`),
  activateServerVersion: (version) => api.post(`/server-versions/${version}/activate`),
  updateVersionConfig: (config) => api.post('/server-versions/update-config', config),

  // Log management
  getLogs: (limit = 100) => api.get(`/logs?limit=${limit}`),
  clearLogs: () => api.delete('/logs'),

  // Server interaction
  getInteractionStatus: () => api.get('/interaction/status'),
  sendCommand: (command) => api.post('/interaction/command', {
    command,
    timestamp: new Date().toISOString()
  }),
  getCommandHistory: (limit = 50) => api.get(`/interaction/history?limit=${limit}`),
  clearCommandHistory: () => api.delete('/interaction/history'),

  // Quick commands
  getQuickCommands: (category) => api.get(`/commands${category ? `?category=${category}` : ''}`),
  getCommandCategories: () => api.get('/commands/categories'),
  executeQuickCommand: (id) => api.post(`/commands/${id}/execute`),
  addQuickCommand: (command) => api.post('/commands', command),
  deleteQuickCommand: (id) => api.delete(`/commands/${id}`),

  // Performance monitoring
  getPerformanceData: () => api.get('/monitor/performance')
};