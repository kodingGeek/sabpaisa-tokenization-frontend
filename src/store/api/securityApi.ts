import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const securityApi = createApi({
  reducerPath: 'securityApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api/v1',
  }),
  endpoints: (builder) => ({}),
});

export default securityApi;