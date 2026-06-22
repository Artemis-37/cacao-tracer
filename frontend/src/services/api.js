import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth API
export const authAPI = {
  login: (email, password) =>
    apiClient.post('/auth/login', { email, password }),
  register: (data) =>
    apiClient.post('/auth/register', data),
  getCurrentUser: () =>
    apiClient.get('/auth/me'),
};

// Settings API
export const settingsAPI = {
  getCooperative: () =>
    apiClient.get('/settings/cooperative'),
  updateCooperative: (data) =>
    apiClient.put('/settings/cooperative', data),
  getCampaigns: () =>
    apiClient.get('/settings/campaigns'),
  createCampaign: (data) =>
    apiClient.post('/settings/campaigns', data),
  getSeasons: () =>
    apiClient.get('/settings/seasons'),
  createSeason: (data) =>
    apiClient.post('/settings/seasons', data),
  getProducers: () =>
    apiClient.get('/settings/producers'),
  createProducer: (data) =>
    apiClient.post('/settings/producers', data),
  getExporters: () =>
    apiClient.get('/settings/exporters'),
  createExporter: (data) =>
    apiClient.post('/settings/exporters', data),
  getVehicles: () =>
    apiClient.get('/settings/vehicles'),
  createVehicle: (data) =>
    apiClient.post('/settings/vehicles', data),
};

// Operations API
export const operationsAPI = {
  createLoading: (data) =>
    apiClient.post('/operations/loadings', data),
  getLoading: (id) =>
    apiClient.get(`/operations/loadings/${id}`),
  allocateLoading: (id) =>
    apiClient.post(`/operations/loadings/${id}/allocate`),
  createReceipt: (data) =>
    apiClient.post('/operations/receipts', data),
};

// Database API
export const databaseAPI = {
  importProducers: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post('/database/import-producers', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  exportProducers: () =>
    apiClient.get('/database/export-producers', { responseType: 'blob' }),
  exportLoadings: () =>
    apiClient.get('/database/export-loadings', { responseType: 'blob' }),
  exportGeoJSON: () =>
    apiClient.get('/database/export-geojson', { responseType: 'blob' }),
};

export default apiClient;
