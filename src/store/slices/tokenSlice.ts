import { createSlice } from '@reduxjs/toolkit';

interface TokenState {
  tokens: any[];
  loading: boolean;
  error: string | null;
}

const initialState: TokenState = {
  tokens: [],
  loading: false,
  error: null,
};

const tokenSlice = createSlice({
  name: 'token',
  initialState,
  reducers: {},
});

export default tokenSlice.reducer;