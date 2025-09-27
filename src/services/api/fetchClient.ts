// Native fetch client to replace axios and avoid toString error

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api/v1';

interface FetchOptions extends RequestInit {
  params?: Record<string, any>;
}

class FetchClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(url: string, options: FetchOptions = {}): Promise<T> {
    const { params, ...fetchOptions } = options;
    
    // Build URL with query params
    let fullUrl = `${this.baseURL}${url}`;
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        searchParams.append(key, String(value));
      });
      fullUrl += `?${searchParams.toString()}`;
    }

    // Add auth token if available
    const token = localStorage.getItem('accessToken');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(fullUrl, {
        ...fetchOptions,
        headers,
      });

      // Handle 401 unauthorized
      if (response.status === 401) {
        // Clear local storage and redirect to login
        localStorage.clear();
        window.location.href = '/login';
        throw new Error('Unauthorized');
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Fetch error:', error);
      throw error;
    }
  }

  async get<T>(url: string, options?: FetchOptions): Promise<T> {
    return this.request<T>(url, { ...options, method: 'GET' });
  }

  async post<T>(url: string, data?: any, options?: FetchOptions): Promise<T> {
    return this.request<T>(url, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(url: string, data?: any, options?: FetchOptions): Promise<T> {
    return this.request<T>(url, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(url: string, options?: FetchOptions): Promise<T> {
    return this.request<T>(url, { ...options, method: 'DELETE' });
  }
}

// Create and export the fetch client instance
export const fetchClient = new FetchClient(API_BASE_URL);

// For backward compatibility with axios-like interface
const defaultExport = {
  get: fetchClient.get.bind(fetchClient),
  post: fetchClient.post.bind(fetchClient),
  put: fetchClient.put.bind(fetchClient),
  delete: fetchClient.delete.bind(fetchClient),
};

export default defaultExport;