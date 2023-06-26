import { configureStore } from '@reduxjs/toolkit';
import userSlice from '@store/reducer/user.reducer';
<<<<<<< HEAD

export const store = configureStore({
  reducer: {
    user: userSlice
=======
import suggetionSlice from '@store/reducer/suggetions';

export const store = configureStore({
  reducer: {
    user: userSlice,
    suggetionFriends: suggetionSlice
>>>>>>> feature/streams
  }
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
