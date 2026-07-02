'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useManagementAuth } from './AuthGuard';

/**
 * A wrapper component that restricts access based on user role.
 * To be used inside components that are already wrapped by AuthGuard.
 * 
 * @param {{ user: Object, allowedRoles: string[], children: React.ReactNode, fallbackRedirect?: string }} props
 */
export default function RoleGuard({ allowedRoles, children, fallbackRedirect = '/management' }) {
  const router = useRouter();
  const { user } = useManagementAuth();

  useEffect(() => {
    if (user && user.role && !allowedRoles.includes(user.role)) {
      router.replace(fallbackRedirect);
    }
  }, [user, allowedRoles, router, fallbackRedirect]);

  if (!user || !user.role || !allowedRoles.includes(user.role)) {
    return null; // Don't render anything while redirecting
  }

  return <>{children}</>;
}
