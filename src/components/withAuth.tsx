'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import Spinner from './Spinner';

export function withAuth(Component: React.ComponentType) {
  return function AuthenticatedComponent(props: any) {
    const router = useRouter();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const [ok, setOk] = useState<boolean | null>(null);
    const searchParams = useSearchParams();
    const redirectedRef = useRef(false); // Prevents multiple redirects

    useEffect(() => {
      const checkAuth = async () => {
        const token = localStorage.getItem('userToken');

        if (!token) {
          console.log('No token found. Redirecting to login.');
          setOk(false);
          return;
        }

        try {
          const response = await axios.post(`${apiUrl}/api/user/verify`, { token });

          if (response.data.success) {
            setOk(true);
          } else {
            setOk(false);
          }
        } catch (error) {
          setOk(false);
        }
      };

      checkAuth();
    }, [apiUrl]);

    useEffect(() => {
      if (ok === false && !redirectedRef.current) {
        redirectedRef.current = true; // Mark redirect as handled

        // Get the current path and append it to the redirect URL
        const currentPath = window.location.pathname;
        const redirectPath = searchParams.get('redirect') || `/login?redirect=${encodeURIComponent(currentPath)}`;

        router.replace(redirectPath); // Use replace instead of push to avoid history stacking
      }
    }, [ok, searchParams, router]);

    if (ok === null) {
      return <Spinner />;
    }

    if (ok === false) {
      return null; // Return null to stop rendering after the redirect
    }

    return <Component {...props} />;
  };
}
