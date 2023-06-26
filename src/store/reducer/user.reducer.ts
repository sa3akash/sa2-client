import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
<<<<<<< HEAD

export interface UserState {
  token: string;
  profile: object | null;
=======
import { UserDoc } from './interfaces';

export interface UserState {
  token: string;
  profile: UserDoc | null;
>>>>>>> feature/streams
}

const initialState: UserState = {
  token: '',
  profile: null
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    addProfile: (state, action: PayloadAction<UserState>) => {
      const { token, profile } = action.payload;
      state.profile = profile;
      state.token = token;
    },
    updateUserProfile: (state, action: PayloadAction<UserState>) => {
      const { profile } = action.payload;
      state.profile = profile;
    },
    clearProfile: (state) => {
      state.profile = null;
      state.token = '';
    }
  }
});

// Action creators are generated for each case reducer function
export const { addProfile, updateUserProfile, clearProfile } = userSlice.actions;

export default userSlice.reducer;
