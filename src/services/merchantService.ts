import axios from 'axios';
import env from '../config/environment';

const API_BASE_URL = env.API_BASE_URL;

export interface CreateMerchantRequest {
  businessName: string;
  email: string;
  phoneNumber: string;
  businessType: string;
  businessAddress?: string;
  panNumber?: string;
  gstNumber?: string;
  webhookUrl?: string;
  settings?: {
    allowRefunds?: boolean;
    allowPartialRefunds?: boolean;
    tokenExpiryDays?: number;
    maxTokensPerCard?: number;
    notifyOnTokenCreation?: boolean;
  };
}

export interface UpdateMerchantRequest {
  businessName?: string;
  email?: string;
  phoneNumber?: string;
  businessType?: string;
  businessAddress?: string;
  webhookUrl?: string;
  status?: string;
  settings?: {
    allowRefunds?: boolean;
    allowPartialRefunds?: boolean;
    tokenExpiryDays?: number;
    maxTokensPerCard?: number;
    notifyOnTokenCreation?: boolean;
  };
}

export interface MerchantResponse {
  merchantId: string;
  businessName: string;
  email: string;
  phoneNumber: string;
  businessType: string;
  businessAddress?: string;
  panNumber?: string;
  gstNumber?: string;
  status: string;
  webhookUrl?: string;
  apiCredentials?: {
    apiKey: string;
    apiKeyHint: string;
  };
  settings: {
    allowRefunds: boolean;
    allowPartialRefunds: boolean;
    tokenExpiryDays: number;
    maxTokensPerCard: number;
    notifyOnTokenCreation: boolean;
  };
  stats: {
    totalTokens: number;
    activeTokens: number;
    totalTransactions: number;
    tokensCreatedToday: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface MerchantSummary {
  merchantId: string;
  businessName: string;
  email: string;
  businessType: string;
  status: string;
  activeTokens: number;
  createdAt: string;
}

export interface MerchantListResponse {
  merchants: MerchantSummary[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export interface MerchantListParams {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: 'ASC' | 'DESC';
  status?: string;
}

class MerchantService {
  async createMerchant(request: CreateMerchantRequest): Promise<MerchantResponse> {
    try {
      const response = await axios.post<MerchantResponse>(
        `${API_BASE_URL}/merchants`,
        request
      );
      return response.data;
    } catch (error: any) {
      console.error('Error creating merchant:', error);
      throw error;
    }
  }

  async getMerchant(merchantId: string): Promise<MerchantResponse> {
    try {
      const response = await axios.get<MerchantResponse>(
        `${API_BASE_URL}/merchants/${merchantId}`
      );
      return response.data;
    } catch (error: any) {
      console.error('Error fetching merchant:', error);
      throw error;
    }
  }

  async updateMerchant(merchantId: string, request: UpdateMerchantRequest): Promise<MerchantResponse> {
    try {
      const response = await axios.put<MerchantResponse>(
        `${API_BASE_URL}/merchants/${merchantId}`,
        request
      );
      return response.data;
    } catch (error: any) {
      console.error('Error updating merchant:', error);
      throw error;
    }
  }

  async getAllMerchants(params: MerchantListParams = {}): Promise<MerchantListResponse> {
    try {
      const queryParams = new URLSearchParams();
      if (params.page !== undefined) queryParams.append('page', params.page.toString());
      if (params.size !== undefined) queryParams.append('size', params.size.toString());
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.sortDirection) queryParams.append('sortDirection', params.sortDirection);
      if (params.status) queryParams.append('status', params.status);

      const response = await axios.get<MerchantListResponse>(
        `${API_BASE_URL}/merchants?${queryParams.toString()}`
      );
      return response.data;
    } catch (error: any) {
      console.error('Error fetching merchants:', error);
      throw error;
    }
  }

  async deleteMerchant(merchantId: string): Promise<void> {
    try {
      await axios.delete(`${API_BASE_URL}/merchants/${merchantId}`);
    } catch (error: any) {
      console.error('Error deleting merchant:', error);
      throw error;
    }
  }

  async regenerateCredentials(merchantId: string): Promise<MerchantResponse> {
    try {
      const response = await axios.post<MerchantResponse>(
        `${API_BASE_URL}/merchants/${merchantId}/regenerate-credentials`
      );
      return response.data;
    } catch (error: any) {
      console.error('Error regenerating credentials:', error);
      throw error;
    }
  }

  async getBusinessTypes(): Promise<string[]> {
    try {
      const response = await axios.get<string[]>(
        `${API_BASE_URL}/merchants/business-types`
      );
      return response.data;
    } catch (error: any) {
      console.error('Error fetching business types:', error);
      throw error;
    }
  }

  // Alias for getMerchant to match the component usage
  async getMerchantById(merchantId: string): Promise<MerchantResponse> {
    return this.getMerchant(merchantId);
  }

  async getMerchantStats(merchantId: string): Promise<any> {
    try {
      const response = await axios.get(`${API_BASE_URL}/merchants/${merchantId}/stats`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching merchant stats:', error);
      throw error;
    }
  }
}

export default new MerchantService();