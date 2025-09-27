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
}

export default new TokenizationService();