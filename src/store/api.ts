import { createAsyncThunk } from '@reduxjs/toolkit';
import { postService } from '@services/api/post/post.services';
import { Utils } from '@services/utils/Utils.services';
import { AxiosError } from 'axios';

const getPosts = createAsyncThunk('post/getPosts', async (name, { dispatch }) => {
  try {
    const response: any = await postService.getAllPosts(1);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      Utils.addNotification(dispatch, { type: 'error', description: error.response?.data.message });
    }
  }
});

export { getPosts };
