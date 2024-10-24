'use client'
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';


const Notfound = () => {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/');
    }, 1300);

    // Cleanup the timer on component unmount
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4">
    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 md:mb-8">
      404 - Page Not Found
    </h1>
    <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl mb-6 md:mb-8 text-center">
      Oops! The page you&apos;re looking for doesn&apos;t exist.
    </p>
    <p className="text-base sm:text-lg md:text-xl">
      Redirecting...
    </p>
  </div>
  
  );
};

export default Notfound;
