<<<<<<< HEAD
// import React from 'react';
import { useRoutes } from 'react-router-dom';
import { AuthTabs, ForgotPassword, ResetPassword } from '@pages/auth';
=======
import { lazy, Suspense } from 'react';
import { useRoutes } from 'react-router-dom';
import ProtectedRoute from '@pages/protectedRoutes';
import StreamsSkeleton from '@pages/social/streams/StreamsSkeleton';

const AuthTabs = lazy(() => import('@pages/auth').then((module) => ({ default: module.AuthTabs })));
const ForgotPassword = lazy(() => import('@pages/auth').then((module) => ({ default: module.ForgotPassword })));
const ResetPassword = lazy(() => import('@pages/auth').then((module) => ({ default: module.ResetPassword })));
const Social = lazy(() => import('@pages/social/Social'));
const Streams = lazy(() => import('@pages/social/streams/Streams'));
const People = lazy(() => import('@pages/social/people/People'));
const Chat = lazy(() => import('@pages/social/chat/Chat'));
const Following = lazy(() => import('@pages/social/following/Following'));
const Followers = lazy(() => import('@pages/social/followers/Followers'));
const Photos = lazy(() => import('@pages/social/photos/Photos'));
const Notifications = lazy(() => import('@pages/social/notifications/Notifications'));
const Profile = lazy(() => import('@pages/social/profile/Profile'));
const Error = lazy(() => import('@pages/social/error/Error'));
>>>>>>> feature/streams

export const AppRouter = () => {
  const element = useRoutes([
    // {
    //   path: '/',
    //   element: <Dashboard />,
    //   children: [
    //     {
    //       path: 'messages',
    //       element: <DashboardMessages />,
    //     },
    //     { path: 'tasks', element: <DashboardTasks /> },
    //   ],
    // },
<<<<<<< HEAD
    { path: '/', element: <AuthTabs /> },
    { path: '/forgot-password', element: <ForgotPassword /> },
    { path: '/reset-password', element: <ResetPassword /> }
=======
    {
      path: '/',
      element: (
        <Suspense>
          <AuthTabs />
        </Suspense>
      )
    },
    {
      path: '/forgot-password',
      element: (
        <Suspense>
          <ForgotPassword />
        </Suspense>
      )
    },
    {
      path: '/reset-password',
      element: (
        <Suspense>
          <ResetPassword />
        </Suspense>
      )
    },
    {
      path: '/social',
      element: (
        <ProtectedRoute>
          <Social />
        </ProtectedRoute>
      ),
      children: [
        {
          path: 'streams',
          element: (
            <Suspense fallback={<StreamsSkeleton />}>
              <Streams />
            </Suspense>
          )
        },
        {
          path: 'people',
          element: (
            <Suspense>
              <People />
            </Suspense>
          )
        },
        {
          path: 'chat/messages',
          element: (
            <Suspense>
              <Chat />
            </Suspense>
          )
        },
        {
          path: 'following',
          element: (
            <Suspense>
              <Following />
            </Suspense>
          )
        },
        {
          path: 'followers',
          element: (
            <Suspense>
              <Followers />
            </Suspense>
          )
        },
        {
          path: 'photos',
          element: (
            <Suspense>
              <Photos />
            </Suspense>
          )
        },
        {
          path: 'notifications',
          element: (
            <Suspense>
              <Notifications />
            </Suspense>
          )
        },
        {
          path: 'profile/:username',
          element: (
            <Suspense>
              <Profile />
            </Suspense>
          )
        }
      ]
    },
    {
      path: '*',
      element: (
        <Suspense>
          <Error />
        </Suspense>
      )
    }
>>>>>>> feature/streams
  ]);

  return element;
};
