import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface suggetionState {
  users: any[];
  isLoading: boolean;
}

const initialState: suggetionState = {
  users: [],
  isLoading: false
};

export const suggetionSlice = createSlice({
  name: 'suggetionFriends',
  initialState,
  reducers: {
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    addToSuggetion: (state, action: PayloadAction<suggetionState>) => {
      const { users } = action.payload;
      state.users = [...users];
    }
  }
});

// Action creators are generated for each case reducer function
export const { setIsLoading, addToSuggetion } = suggetionSlice.actions;

export default suggetionSlice.reducer;
