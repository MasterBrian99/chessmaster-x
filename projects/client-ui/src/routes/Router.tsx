import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MainLayout from '@/layout/main/main.layout';
import AuthLayout from '@/layout/auth/auth.layout';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: '/',
        lazy: async () => {
          const { HomePage } = await import('@/pages/home.page');
          return { Component: HomePage };
        },
      },
    ],
  },
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      {
        path: 'login',
        lazy: async () => {
          const { LoginPage } = await import('@/pages/auth/login.page');
          return { Component: LoginPage };
        },
      },
    ],
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
