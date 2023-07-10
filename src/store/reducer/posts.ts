import { createSlice } from '@reduxjs/toolkit';
import { SinglePostDoc } from './post';
import { getPosts } from '@store/api';

interface postInterface {
  posts: SinglePostDoc[];
  totalPostsCount: number;
  isLoading: boolean;
}

const initialState: postInterface = {
  posts: [],
  totalPostsCount: 0,
  isLoading: false
};

const postsSlice = createSlice({
  name: 'allPosts',
  initialState,
  reducers: {
    addToPosts: (state, action) => {
      state.posts = [...action.payload];
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getPosts.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getPosts.fulfilled, (state, action) => {
      state.isLoading = false;
      const { posts, totalPosts } = action.payload;
      state.posts = [...posts];
      state.totalPostsCount = totalPosts;
    });
    builder.addCase(getPosts.rejected, (state) => {
      state.isLoading = false;
    });
  }
});

export const { addToPosts } = postsSlice.actions;
export default postsSlice.reducer;
