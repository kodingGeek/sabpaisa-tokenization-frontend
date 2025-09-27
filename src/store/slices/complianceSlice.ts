import { createSlice } from '@reduxjs/toolkit';

interface ComplianceState {
  reports: any[];
  status: any;
  loading: boolean;
  error: string | null;
}

const initialState: ComplianceState = {
  reports: [],
  status: null,
  loading: false,
  error: null,
};

const complianceSlice = createSlice({
  name: 'compliance',
  initialState,
  reducers: {},
});

export default complianceSlice.reducer;