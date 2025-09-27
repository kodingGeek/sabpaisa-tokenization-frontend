import { createSlice } from '@reduxjs/toolkit';

interface SecurityState {
  alerts: any[];
  threats: any[];
  loading: boolean;
  error: string | null;
}

const initialState: SecurityState = {
  alerts: [],
  threats: [],
  loading: false,
  error: null,
};

const securitySlice = createSlice({
  name: 'security',
  initialState,
  reducers: {},
});

export default securitySlice.reducer;