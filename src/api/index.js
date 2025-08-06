import axios from 'axios';

// 创建axios实例
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器
api.interceptors.request.use(
  config => {
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    console.error('API请求错误:', error);
    return Promise.reject(error);
  }
);

// API方法定义
export default {
  // 服务器控制
  getServerStatus: () => api.get('/status'),
  startServer: () => api.post('/start'),
  stopServer: () => api.post('/stop'),
  restartServer: () => api.post('/restart'),

  // 服务器配置
  getServerConfig: () => api.get('/config'),
  updateServerConfig: (config) => api.put('/config', config),

  // 白名单管理
  getAllowlist: () => api.get('/allowlist'),
  addToAllowlist: (player) => api.post('/allowlist', player),
  removeFromAllowlist: (name) => api.delete(`/allowlist/${name}`),

  // 权限管理
  getPermissions: () => api.get('/permissions'),
  updatePermission: (permission) => api.put('/permissions', permission),
  removePermission: (xuid) => api.delete(`/permissions/${xuid}`),

  // 世界管理
  getWorlds: () => api.get('/worlds'),
  uploadWorld: (formData) => api.post('/worlds/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deleteWorld: (name) => api.delete(`/worlds/${name}`),
  activateWorld: (name) => api.put(`/worlds/${name}/activate`),

  // 资源包管理
  getResourcePacks: () => api.get('/resource-packs'),
  uploadResourcePack: (formData) => api.post('/resource-packs/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  activateResourcePack: (uuid) => api.put(`/resource-packs/${uuid}/activate`),
  deactivateResourcePack: (uuid) => api.put(`/resource-packs/${uuid}/deactivate`),
  deleteResourcePack: (uuid) => api.delete(`/resource-packs/${uuid}`),

  // 服务器版本管理
  getServerVersions: () => api.get('/server-versions'),
  downloadServerVersion: (version) => api.post(`/server-versions/${version}/download`),
  getDownloadProgress: (version) => api.get(`/server-versions/${version}/progress`),
  activateServerVersion: (version) => api.post(`/server-versions/${version}/activate`),
  updateVersionConfig: (config) => api.post('/server-versions/update-config', config),

  // 日志管理
  getLogs: (limit = 100) => api.get(`/logs?limit=${limit}`),
  clearLogs: () => api.delete('/logs'),

  // 服务器交互
  getInteractionStatus: () => api.get('/interaction/status'),
  sendCommand: (command) => api.post('/interaction/command', {
    command,
    timestamp: new Date().toISOString()
  }),
  getCommandHistory: (limit = 50) => api.get(`/interaction/history?limit=${limit}`),
  clearCommandHistory: () => api.delete('/interaction/history'),

  // 快捷命令
  getQuickCommands: (category) => api.get(`/commands${category ? `?category=${category}` : ''}`),
  getCommandCategories: () => api.get('/commands/categories'),
  executeQuickCommand: (id) => api.post(`/commands/${id}/execute`),
  addQuickCommand: (command) => api.post('/commands', command),
  deleteQuickCommand: (id) => api.delete(`/commands/${id}`),

  // 性能监控
  getPerformanceData: () => api.get('/monitor/performance')
};