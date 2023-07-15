import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { emptyPostData } from '@services/utils/Static.data';

export interface SinglePostDoc {
  _id?: string;
  post?: string;
  bgColor?: string;
  privacy?: string;
  feelings?: string;
  gifUrl?: string;
  profilePicture?: string;
  image?: string;
  userId?: string;
  username?: string;
  email?: string;
  avatarColor?: string;
  commentsCount?: number;
  reactions?: any[];
  imgVersion?: string;
  imgId?: string;
  createdAt?: string;
}

const initialState: SinglePostDoc = emptyPostData;

const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    updatePostItem: (state, action: PayloadAction<SinglePostDoc>) => {
      for (const [key, value] of Object.entries(action.payload)) {
        state[key as keyof SinglePostDoc] = value;
      }
    },
    clearPost: () => {
      return emptyPostData;
    }
  }
});

export const { updatePostItem, clearPost } = postSlice.actions;
export default postSlice.reducer;
