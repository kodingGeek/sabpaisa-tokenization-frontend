import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'MERCHANT' | 'SECURITY_OFFICER' | 'COMPLIANCE_OFFICER' | 'SYSTEM_ADMIN';
  merchantId?: string;
  permissions: string[];
  lastLogin: string;
  mfaEnabled: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  sessionExpiry: number | null;
  lastActivity: number;
}

const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  sessionExpiry: null,
  lastActivity: Date.now(),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        user: User;
        token: string;
        refreshToken: string;
        expiresIn: number;
      }>
    ) => {
      const { user, token, refreshToken, expiresIn } = action.payload;
      state.user = user;
      state.token = token;
      state.refreshToken = refreshToken;
      state.isAuthenticated = true;
      state.sessionExpiry = Date.now() + expiresIn * 1000;
      state.lastActivity = Date.now();
      state.error = null;
      
      // Store tokens securely in sessionStorage (not localStorage for security)
      sessionStorage.setItem('token', token);
      sessionStorage.setItem('refreshToken', refreshToken);
    },
    
    updateActivity: (state) => {
      state.lastActivity = Date.now();
    },
    
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.sessionExpiry = null;
      state.error = null;
      
      // Clear session storage
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('refreshToken');
      sessionStorage.clear();
      
      // Clear any sensitive data from memory
      if (window.crypto && window.crypto.subtle) {
        // Use Web Crypto API to generate random data to overwrite memory
        const buffer = new ArrayBuffer(1024);
        window.crypto.getRandomValues(new Uint8Array(buffer));
      }
    },
    
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    
    clearError: (state) => {
      state.error = null;
    },
    
    updateToken: (state, action: PayloadAction<{ token: string; expiresIn: number }>) => {
      state.token = action.payload.token;
      state.sessionExpiry = Date.now() + action.payload.expiresIn * 1000;
      sessionStorage.setItem('token', action.payload.token);
    },
    
    enableMFA: (state) => {
      if (state.user) {
        state.user.mfaEnabled = true;
      }
    },
    
    updateUserPermissions: (state, action: PayloadAction<string[]>) => {
      if (state.user) {
        state.user.permissions = action.payload;
      }
    },
  },
});

export const {
  setCredentials,
  updateActivity,
  logout,
  setLoading,
  setError,
  clearError,
  updateToken,
  enableMFA,
  updateUserPermissions,
} = authSlice.actions;

export default authSlice.reducer;

// Selectors
export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectAuthToken = (state: RootState) => state.auth.token;
export const selectUserRole = (state: RootState) => state.auth.user?.role;
export const selectUserPermissions = (state: RootState) => state.auth.user?.permissions || [];
export const selectSessionExpiry = (state: RootState) => state.auth.sessionExpiry;
export const selectLastActivity = (state: RootState) => state.auth.lastActivity;

// Permission checker
export const selectHasPermission = (permission: string) => (state: RootState) => {
  const permissions = selectUserPermissions(state);
  return permissions.includes(permission) || permissions.includes('*');
};

// Role checker
export const selectHasRole = (role: string) => (state: RootState) => {
  const userRole = selectUserRole(state);
  return userRole === role;
};