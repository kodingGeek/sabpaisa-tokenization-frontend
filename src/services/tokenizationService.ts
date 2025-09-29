import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8082/api/v1';

export interface TokenizeRequest {
  cardNumber: string;
  merchantId: string;
}

export interface TokenResponse {
  tokenValue: string;
  maskedPan: string;
  status: string;
  expiresAt: string;
  success: boolean;
  message: string;
}

export interface DetokenizeRequest {
  token: string;
  merchantId: string;
}

export interface TokenInfo {
  tokenValue: string;
  maskedPan: string;
  status: string;
  merchantId: string;
  merchantName: string;
  usageCount: number;
  createdAt: string;
  expiresAt: string;
}

export interface TokenListResponse {
  tokens: TokenInfo[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export interface TokenListParams {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: 'ASC' | 'DESC';
  merchantId?: string;
}

class TokenizationService {
  async tokenize(request: TokenizeRequest): Promise<TokenResponse> {
    try {
      const response = await axios.post<TokenResponse>(
        `${API_BASE_URL}/tokens/tokenize`,
        request
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw error;
    }
  }

  async detokenize(request: DetokenizeRequest): Promise<TokenResponse> {
    try {
      const response = await axios.post<TokenResponse>(
        `${API_BASE_URL}/tokens/detokenize`,
        request
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw error;
    }
  }

  async checkHealth(): Promise<boolean> {
    try {
      const response = await axios.get(`${API_BASE_URL}/tokens/health`);
      return response.status === 200;
    } catch (error) {
      return false;
    }
  }

  async getAllTokens(params: TokenListParams = {}): Promise<TokenListResponse> {
    try {
      const queryParams = new URLSearchParams();
      if (params.page !== undefined) queryParams.append('page', params.page.toString());
      if (params.size !== undefined) queryParams.append('size', params.size.toString());
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.sortDirection) queryParams.append('sortDirection', params.sortDirection);
      if (params.merchantId) queryParams.append('merchantId', params.merchantId);

      const response = await axios.get<TokenListResponse>(
        `${API_BASE_URL}/tokens?${queryParams.toString()}`
      );
      return response.data;
    } catch (error: any) {
      console.error('Error fetching tokens:', error);
      throw error;
    }
  }
}

export default new TokenizationService();