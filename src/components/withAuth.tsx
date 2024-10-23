'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import Spinner from './Spinner'; // Assuming you have a Spinner component for loading states

export function withAuth(Component: React.ComponentType) {
  return function AuthenticatedComponent(props: any) {
    const router = useRouter();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null); // Authentication state
    const searchParams = useSearchParams(); // To manage redirect query parameters
    const [error, setError] = useState<string | null>(null); // Error state

    useEffect(() => {
      const checkAuth = async () => {
        const token = localStorage.getItem('userToken');

        if (!token) {
          console.log('No token found. Redirecting to login.');
          handleRedirect();
          return;
        }

        try {
          // API call to verify the token
          const response = await axios.post(`${apiUrl}/api/user/verify`, { token });

          if (response.data.success) {
            setIsAuthenticated(true); // Authentication successful
          } else {
            setIsAuthenticated(false); // Invalid token
            handleRedirect();
          }
        } catch (error:any) {
          setIsAuthenticated(false); // API error or server error
          setError(error.response?.data?.message || 'Authentication failed. Please log in again.');
          handleRedirect();
        }
      };

      if (apiUrl) {
        checkAuth();
      } else {
        console.error('API URL is not defined. Please check your environment configuration.');
        setError('API URL is not configured.');
        setIsAuthenticated(false);
      }
    }, [apiUrl, router]);

    const handleRedirect = () => {
      // Get the current path and set the redirect URL
      const currentPath = window.location.pathname;
      const redirectPath = searchParams.get('redirect') || `/login?redirect=${encodeURIComponent(currentPath)}`;
      router.push(redirectPath);
    };

    if (isAuthenticated === null) {
      return <Spinner />; // Show loading spinner while verifying the token
    }

    if (isAuthenticated === false) {
      // If not authenticated, the component will redirect, and nothing will be rendered
      return null;
    }

    return <Component {...props} />; // Render the protected component if authenticated
  };
}
