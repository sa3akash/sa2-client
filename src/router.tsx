import { useRoutes } from 'react-router-dom';
import { AuthTabs, ForgotPassword, ResetPassword } from './pages/auth';
import React from 'react';


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
    { path: '/', element: <AuthTabs /> },
    { path: '/forgot-password', element: <ForgotPassword /> },
    { path: '/reset-password', element: <ResetPassword /> }
  ]);

  return element;
};
