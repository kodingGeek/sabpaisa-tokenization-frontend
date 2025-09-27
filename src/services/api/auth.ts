import fetchClient from './fetchClient';

export interface LoginRequest {
  email: string;
  password: string;
  captchaToken?: string;
}

export interface LoginResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: 'MERCHANT' | 'SECURITY_OFFICER' | 'COMPLIANCE_OFFICER' | 'SYSTEM_ADMIN';
    merchantId?: string;
    permissions: string[];
    lastLogin: string;
    mfaEnabled: boolean;
  };
  token: string;
  refreshToken: string;
  expiresIn: number;
  mfaRequired?: boolean;
  mfaToken?: string;
}

export interface MFARequest {
  mfaToken: string;
  mfaCode: string;
  rememberDevice: boolean;
}

class AuthAPI {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    // Mock authentication for testing (remove when backend is ready)
    const mockUsers = [
      {
        email: 'merchant@sabpaisa.com',
        password: 'Merchant@123',
        role: 'MERCHANT' as const,
        name: 'Test Merchant',
        merchantId: 'MERCH001'
      },
      {
        email: 'admin@sabpaisa.com',
        password: 'Admin@123',
        role: 'SYSTEM_ADMIN' as const,
        name: 'System Admin'
      },
      {
        email: 'security@sabpaisa.com',
        password: 'Security@123',
        role: 'SECURITY_OFFICER' as const,
        name: 'Security Officer'
      },
      {
        email: 'compliance@sabpaisa.com',
        password: 'Compliance@123',
        role: 'COMPLIANCE_OFFICER' as const,
        name: 'Compliance Officer'
      }
    ];

    // Check credentials
    const user = mockUsers.find(u => u.email === credentials.email && u.password === credentials.password);
    
    if (user) {
      // Simulate successful login
      return {
        user: {
          id: `USR${Date.now()}`,
          email: user.email,
          name: user.name,
          role: user.role,
          merchantId: user.merchantId,
          permissions: ['READ', 'WRITE', 'DELETE'],
          lastLogin: new Date().toISOString(),
          mfaEnabled: false
        },
        token: `mock-jwt-token-${Date.now()}`,
        refreshToken: `mock-refresh-token-${Date.now()}`,
        expiresIn: 3600
      };
    }

    // If no match, try real API (will fail but shows proper error)
    return await fetchClient.post('/auth/login', credentials);
  }

  async verifyMFA(mfaData: MFARequest): Promise<LoginResponse> {
    return await fetchClient.post('/auth/mfa/verify', mfaData);
  }

  async refreshToken(refreshToken: string): Promise<{ token: string; expiresIn: number }> {
    return await fetchClient.post('/auth/refresh', { refreshToken });
  }

  async logout(token: string): Promise<void> {
    await fetchClient.post('/auth/logout', {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
}

export const authApi = new AuthAPI();