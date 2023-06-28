import { configureStore } from '@reduxjs/toolkit';
import userSlice from '@store/reducer/user.reducer';
import suggetionSlice from './reducer/suggetions';
import notificatonSlice from './reducer/notifications';
export const store = configureStore({
  reducer: {
    user: userSlice,
    suggetionFriends: suggetionSlice,
    notification: notificatonSlice
  }
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
