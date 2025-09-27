import { createSlice } from '@reduxjs/toolkit';

interface MerchantState {
  merchantInfo: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: MerchantState = {
  merchantInfo: null,
  loading: false,
  error: null,
};

const merchantSlice = createSlice({
  name: 'merchant',
  initialState,
  reducers: {},
});

export default merchantSlice.reducer;