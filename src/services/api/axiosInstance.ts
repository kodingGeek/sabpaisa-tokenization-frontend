import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// Create a custom axios instance with error handling
const createAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api/v1',
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = localStorage.getItem('accessToken');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error: AxiosError) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor
  instance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
      if (error.response?.status === 401) {
        // Handle token refresh
        try {
          const refreshToken = localStorage.getItem('refreshToken');
          if (refreshToken) {
            // TODO: Implement refresh token logic
            // const newToken = await refreshAccessToken(refreshToken);
            // return instance(error.config);
          }
        } catch (refreshError) {
          // Redirect to login
          localStorage.clear();
          window.location.href = '/login';
        }
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

// Create and export the axios instance
const axiosInstance = createAxiosInstance();

// Export a safe request function that handles the toString error
export const safeRequest = async (config: AxiosRequestConfig) => {
  try {
    // Workaround for toString read-only error
    if (config.params && typeof config.params === 'object') {
      const searchParams = new URLSearchParams();
      Object.entries(config.params).forEach(([key, value]) => {
        searchParams.append(key, String(value));
      });
      config.url = `${config.url}?${searchParams.toString()}`;
      delete config.params;
    }
    return await axiosInstance(config);
  } catch (error) {
    throw error;
  }
};

export default axiosInstance;