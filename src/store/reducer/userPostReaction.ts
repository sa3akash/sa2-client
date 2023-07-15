import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  reactions: []
};

export const reactionSlice = createSlice({
  name: 'reactions',
  initialState,
  reducers: {
    addReactions: (state, action) => {
      state.reactions = action.payload;
    }
  }
});

// Action creators are generated for each case reducer function
export const { addReactions } = reactionSlice.actions;

export default reactionSlice.reducer;
