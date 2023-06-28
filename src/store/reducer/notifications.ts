import { ToastDoc } from '@components/toast/Toast';
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

const initialState: ToastDoc[] = [];

export const notificatonSlice = createSlice({
  name: 'notificaton',
  initialState,
  reducers: {
    setNotification: (state, action: PayloadAction<ToastDoc>) => {
      state = [...state, action.payload];
      return state;
    },
    clearNotification: (state) => {
      state = [];
      return state;
    }
  }
});

// Action creators are generated for each case reducer function
export const { setNotification, clearNotification } = notificatonSlice.actions;

export default notificatonSlice.reducer;
