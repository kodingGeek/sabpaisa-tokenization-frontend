import { createSlice } from '@reduxjs/toolkit';

interface NotificationState {
  notifications: any[];
  unreadCount: number;
}

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {},
});

export default notificationSlice.reducer;