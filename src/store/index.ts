import { configureStore } from '@reduxjs/toolkit';
import userSlice from '@store/reducer/user.reducer';
import suggetionSlice from '@store/reducer/suggetions';
import notificatonSlice from '@store/reducer/notifications';
import modelSlice from '@store/reducer/model';
import postsSlice from '@store/reducer/posts';
import postSlice from '@store/reducer/post';
import reactionSlice from '@store/reducer/userPostReaction';
export const store = configureStore({
  reducer: {
    user: userSlice,
    suggetionFriends: suggetionSlice,
    notification: notificatonSlice,
    model: modelSlice,
    allPosts: postsSlice,
    post: postSlice,
    userReactions: reactionSlice
  }
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
