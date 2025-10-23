import axios from 'axios';
import env from '../config/environment';

const API_BASE_URL = env.API_BASE_URL;
const API_V2_BASE_URL = env.API_V2_BASE_URL;

export interface TokenizeRequest {
  cardNumber: string;
  merchantId: string;
}

export interface EnhancedTokenizeRequest {
  cardNumber: string;
  merchantId: string;
  algorithmType?: 'SIMPLE' | 'COF' | 'FPE';
  customerId?: string;
  customerEmail?: string;
  customerPhone?: string;
  transactionId?: string;
  transactionAmount?: number;
  transactionCurrency?: string;
  isCof?: boolean;
  cofContractId?: string;
  cofInitialTransactionId?: string;
  metadata?: Record<string, string>;
}

export interface TokenResponse {
  tokenValue: string;
  maskedPan: string;
  status: string;
  expiresAt: string;
  success: boolean;
  message: string;
  data?: {
    tokenValue?: string;
    maskedPan?: string;
    status?: string;
    algorithmType?: string;
    cardBrand?: string;
    cardType?: string;
    merchantId?: string;
    merchantName?: string;
  };
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
  merchantName?: string;
  usageCount?: number;
  createdAt: string;
  expiresAt?: string;
  tokenizationMode?: string;
  cardBrand?: string;
  cardType?: string;
  algorithmType?: string; // For backward compatibility
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

export interface Merchant {
  id?: number;
  merchantId: string;
  businessName: string;
  email: string;                    // API uses "email" not "contactEmail"
  contactEmail?: string;            // Keep for backward compatibility
  contactPhone?: string;
  status: string;
  kycStatus?: string;
  registrationDate?: string;
  createdAt?: string;               // API uses "createdAt"
  businessType?: string;
  riskRating?: string;
  tokenCount?: number;
  activeTokens?: number;            // API uses "activeTokens"
  lastActivity?: string;
}

export interface MerchantListResponse {
  merchants: Merchant[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
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

  async tokenizeV2(request: EnhancedTokenizeRequest): Promise<TokenResponse> {
    try {
      const response = await axios.post<TokenResponse>(
        `${API_V2_BASE_URL}/tokens`,
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
      if (params.sortBy) queryParams.append('sort', `${params.sortBy},${params.sortDirection || 'DESC'}`);
      if (params.merchantId) queryParams.append('merchantId', params.merchantId);

      const response = await axios.get(
        `${API_V2_BASE_URL}/tokens/search?${queryParams.toString()}`
      );
      
      // Transform the Spring Boot Page response to our expected format
      const data = response.data.data || response.data;
      return {
        tokens: data.content || [],
        totalElements: data.totalElements || 0,
        totalPages: data.totalPages || 0,
        currentPage: data.number || 0,
        pageSize: data.size || 10
      };
    } catch (error: any) {
      console.error('Error fetching tokens:', error);
      // Return empty response on error
      return {
        tokens: [],
        totalElements: 0,
        totalPages: 0,
        currentPage: 0,
        pageSize: 10
      };
    }
  }

  async updateTokenStatus(tokenValue: string, status: string, merchantId: string): Promise<TokenResponse> {
    try {
      const response = await axios.put<TokenResponse>(
        `${API_V2_BASE_URL}/tokens/${tokenValue}/status`,
        null,
        {
          params: { merchantId, status }
        }
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw error;
    }
  }

  async deleteToken(tokenValue: string, merchantId: string): Promise<void> {
    try {
      await axios.delete(
        `${API_V2_BASE_URL}/tokens/${tokenValue}`,
        {
          params: { merchantId }
        }
      );
    } catch (error: any) {
      throw error;
    }
  }

  async getToken(tokenValue: string, merchantId: string): Promise<TokenResponse> {
    try {
      const response = await axios.get<TokenResponse>(
        `${API_V2_BASE_URL}/tokens/${tokenValue}`,
        {
          params: { merchantId }
        }
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw error;
    }
  }

  async getAllMerchants(params: TokenListParams = {}): Promise<MerchantListResponse> {
    try {
      const queryParams = new URLSearchParams();
      if (params.page !== undefined) queryParams.append('page', params.page.toString());
      if (params.size !== undefined) queryParams.append('size', params.size.toString());
      if (params.sortBy) queryParams.append('sort', `${params.sortBy},${params.sortDirection || 'DESC'}`);

      const response = await axios.get(
        `${API_BASE_URL}/merchants?${queryParams.toString()}`
      );
      
      // Transform the API response to our expected format
      const data = response.data;
      
      // Check if the response already has merchants array (our API format)
      if (data.merchants) {
        // Map API response to match interface
        const merchants = data.merchants.map((merchant: any) => ({
          ...merchant,
          contactEmail: merchant.email || merchant.contactEmail,
          tokenCount: merchant.activeTokens || merchant.tokenCount || 0,
          kycStatus: merchant.kycStatus || 'PENDING',
          riskRating: merchant.riskRating || 'LOW',
          contactPhone: merchant.contactPhone || 'N/A',
          lastActivity: merchant.lastActivity || 'Recently'
        }));
        
        return {
          merchants: merchants,
          totalElements: data.totalElements || data.merchants.length,
          totalPages: data.totalPages || 1,
          currentPage: data.currentPage || 0,
          pageSize: data.pageSize || 10
        };
      } else if (Array.isArray(data)) {
        // If it's a simple array, wrap it in a page structure
        return {
          merchants: data,
          totalElements: data.length,
          totalPages: 1,
          currentPage: 0,
          pageSize: data.length
        };
      } else {
        // If it's a Spring Boot page response
        return {
          merchants: data.content || [],
          totalElements: data.totalElements || 0,
          totalPages: data.totalPages || 0,
          currentPage: data.number || 0,
          pageSize: data.size || 10
        };
      }
    } catch (error: any) {
      console.error('Error fetching merchants:', error);
      // Return empty response on error
      return {
        merchants: [],
        totalElements: 0,
        totalPages: 0,
        currentPage: 0,
        pageSize: 10
      };
    }
  }

  async getMerchantTokens(merchantId: string): Promise<TokenListResponse> {
    return this.getAllTokens({ merchantId });
  }
}

export const merchantService = {
  getAllMerchants: (params: TokenListParams = {}) => new TokenizationService().getAllMerchants(params),
  getMerchantTokens: (merchantId: string) => new TokenizationService().getMerchantTokens(merchantId)
};

export default new TokenizationService();