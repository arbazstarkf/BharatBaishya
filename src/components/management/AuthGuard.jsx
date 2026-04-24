'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthChange } from '@/lib/adminAuth';
import LoadingSpinner from './LoadingSpinner';

/**
 * Wraps protected management pages.
 * - While Firebase resolves the auth state, shows a full-screen spinner.
 * - If no user is authenticated, redirects to /management/login.
 * - If authenticated, renders children and passes the user object down.
 *
 * @param {{ children: React.ReactNode, redirectTo?: string }} props
 */
export default function AuthGuard({ children, redirectTo = '/management/login' }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthChange((firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
      } else {
        router.replace(redirectTo);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router, redirectTo]);

  if (loading) {
    return <LoadingSpinner fullPage size="lg" label="Authenticating Account..." />;
  }

  if (!user) return null;

  // Pass user through render props pattern for convenience
  return typeof children === 'function' ? children(user) : children;
}
