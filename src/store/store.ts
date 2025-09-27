import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import tokenReducer from './slices/tokenSlice';
import merchantReducer from './slices/merchantSlice';
import securityReducer from './slices/securitySlice';
import complianceReducer from './slices/complianceSlice';
import notificationReducer from './slices/notificationSlice';
import { authApi } from './api/authApi';
import { tokenApi } from './api/tokenApi';
import { merchantApi } from './api/merchantApi';
import { securityApi } from './api/securityApi';
import { complianceApi } from './api/complianceApi';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    token: tokenReducer,
    merchant: merchantReducer,
    security: securityReducer,
    compliance: complianceReducer,
    notification: notificationReducer,
    // RTK Query API reducers
    [authApi.reducerPath]: authApi.reducer,
    [tokenApi.reducerPath]: tokenApi.reducer,
    [merchantApi.reducerPath]: merchantApi.reducer,
    [securityApi.reducerPath]: securityApi.reducer,
    [complianceApi.reducerPath]: complianceApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore paths that might contain non-serializable values
        ignoredActions: ['auth/setCredentials'],
        ignoredPaths: ['auth.token'],
      },
    }).concat(
      authApi.middleware,
      tokenApi.middleware,
      merchantApi.middleware,
      securityApi.middleware,
      complianceApi.middleware
    ),
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;