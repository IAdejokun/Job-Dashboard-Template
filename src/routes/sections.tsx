import axios from 'axios';
import { lazy, Suspense, useEffect } from 'react';
import { Outlet, Navigate, useRoutes, useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

import { varAlpha } from 'src/theme/styles';
import { AuthLayout } from 'src/layouts/auth';
import { DashboardLayout } from 'src/layouts/dashboard';

// ----------------------------------------------------------------------

// protect the dashboard routes

const ProtectedRoute = () => {

  const navigate = useNavigate();

  const isTokenExpired = (token: string) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const payload = JSON.parse(window.atob(base64))
      const currentTime = Math.floor(Date.now() / 1000)
      return payload.exp < currentTime;
    } catch (error) {
      console.log('Error decoding token:', error);
      return true;
    }
  };

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('authtoken');
    
      if (!token) {
        navigate('/sign-in');
        return
      }

      if (isTokenExpired(token)) {
        localStorage.removeItem('authtoken');
      }

      // set up axios interceptor
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    }
 
    checkAuth();

  }, [navigate]);

  return (
    <DashboardLayout>
      <Suspense fallback={renderFallback}>
        <Outlet/>
      </Suspense>
    </DashboardLayout>
  )

}

const renderFallback = (
  <Box display="flex" alignItems="center" justifyContent="center" flex="1 1 auto">
    <LinearProgress
      sx={{
        width: 1,
        maxWidth: 320,
        bgcolor: (theme) => varAlpha(theme.vars.palette.text.primaryChannel, 0.16),
        [`& .${linearProgressClasses.bar}`]: { bgcolor: 'text.primary' },
      }}
    />
  </Box>
);

// Lazy Load Components
export const HomePage = lazy(() => import('src/pages/home'));
export const BlogPage = lazy(() => import('src/pages/blog'));
export const UserPage = lazy(() => import('src/pages/user'));
export const SignInPage = lazy(() => import('src/pages/sign-in'));
export const SignUpPage = lazy(() => import('src/pages/sign-up'));
export const VerifyPage = lazy(() => import('src/pages/verify'))
export const ForgotPasswordPage = lazy(() => import('src/pages/forgot-password')); 
export const ForgotPasswordLinkPage = lazy(() => import('src/pages/password-link'));
export const ResetPasswordLinkPage = lazy(() => import('src/pages/reset-password'))
export const ProductsPage = lazy(() => import('src/pages/products'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));
export const ProfilePage = lazy(() => import('src/pages/profile') )


// ----------------------------------------------------------------------

export function Router() {
  return useRoutes([
  {
    path: '/',
    element: <Navigate to = 'sign-in' replace />
  }
    ,{
      element: <ProtectedRoute/>,
      children: [
        { path: 'dashboard', element: <HomePage /> },
        { path: 'user', element: <UserPage /> },
        { path: 'products', element: <ProductsPage /> },
        { path: 'blog', element: <BlogPage /> },
        {path: 'profile', element: <ProfilePage /> }
      ],
    },
    {
      path: 'sign-in',
      element: (
        <AuthLayout>
          <SignInPage />
         </AuthLayout>
      ),
    },
    {
      path: 'sign-up',
      element: (
        <AuthLayout>
        <SignUpPage />
        </AuthLayout>
      )
    },
    {
      path: 'verify',
      element: (
        <AuthLayout>
          <VerifyPage/>
        </AuthLayout>
      )
    },
    {
      path: 'forgot-password',
      element: (
        <AuthLayout>
          <ForgotPasswordPage/>
        </AuthLayout>
      )
    },
    {
      path: 'password-link',
      element: (
        <AuthLayout>
          <ForgotPasswordLinkPage/>
        </AuthLayout>
      )
    },
    {
      path: 'reset-password',
      element: (
        <AuthLayout>
          <ResetPasswordLinkPage/>
        </AuthLayout>
      )
    },
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);
}
