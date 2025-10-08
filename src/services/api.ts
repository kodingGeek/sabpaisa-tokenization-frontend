import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8082/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Token APIs
export const tokenizationApi = {
  tokenize: (data: { cardNumber: string; merchantId: string }) => 
    api.post('/tokens/tokenize', data),
  
  detokenize: (data: { token: string; merchantId: string }) => 
    api.post('/tokens/detokenize', data),
  
  getTokensByMerchant: (merchantId: string) => 
    api.get(`/tokens/merchant/${merchantId}`),
  
  getTokensByStatus: (merchantId: string, status: string) => 
    api.get(`/tokens/merchant/${merchantId}/status/${status}`),
};

// Platform APIs
export const platformApi = {
  getAll: () => api.get('/platforms'),
  getById: (id: string) => api.get(`/platforms/${id}`),
  create: (data: any) => api.post('/platforms', data),
  update: (id: string, data: any) => api.put(`/platforms/${id}`, data),
  delete: (id: string) => api.delete(`/platforms/${id}`),
};

// Billing/Monetization APIs
export const billingApi = {
  getCurrentUsage: (merchantId: string) => 
    api.get(`/billing/usage/${merchantId}`),
  
  getBillingHistory: (merchantId: string) => 
    api.get(`/billing/history/${merchantId}`),
  
  getEstimatedCharges: (merchantId: string) => 
    api.get(`/billing/estimated/${merchantId}`),
};

// Bulk Operations APIs
export const bulkApi = {
  retokenize: (data: { merchantId: string; tokenIds: string[] }) => 
    api.post('/bulk/retokenize', data),
  
  getRetokenizationStatus: (jobId: string) => 
    api.get(`/bulk/retokenize/status/${jobId}`),
};

// Mock data functions (remove these when backend is ready)
export const mockApi = {
  getTokens: async () => {
    // Mock response
    return {
      data: [
        {
          tokenValue: '4111111111111234',
          maskedPan: '411111******1234',
          status: 'ACTIVE',
          expiresAt: '2024-12-31',
          createdAt: '2024-01-15',
          platform: 'E-Commerce',
          tokenType: 'COF',
        },
        {
          tokenValue: '5200000000001005',
          maskedPan: '520000******1005',
          status: 'ACTIVE',
          expiresAt: '2024-11-30',
          createdAt: '2024-02-20',
          platform: 'POS',
          tokenType: 'FPT',
        },
      ]
    };
  },
  
  getPlatforms: async () => {
    return {
      data: [
        { id: '1', platformCode: 'ECOM', platformName: 'E-Commerce', description: 'Online payments' },
        { id: '2', platformCode: 'POS', platformName: 'Point of Sale', description: 'Physical store payments' },
        { id: '3', platformCode: 'MOBILE', platformName: 'Mobile', description: 'Mobile app payments' },
      ]
    };
  },
  
  getBillingData: async () => {
    return {
      data: {
        currentUsage: 2500,
        monthlyLimit: 10000,
        estimatedCharges: 125.50,
        billingHistory: [
          { month: 'January', usage: 2100, charges: 105.00 },
          { month: 'February', usage: 1800, charges: 90.00 },
          { month: 'March', usage: 2500, charges: 125.00 },
        ]
      }
    };
  }
};

export default api;