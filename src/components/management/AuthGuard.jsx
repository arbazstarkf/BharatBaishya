'use client';

import { useEffect, useState, createContext, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthChange, getUserRole, signOutAdmin } from '@/lib/adminAuth';
import LoadingSpinner from './LoadingSpinner';

const AuthContext = createContext({ user: null });

export function useManagementAuth() {
  return useContext(AuthContext);
}

/**
 * Wraps protected management pages.
 * - While Firebase resolves the auth state and fetches role, shows a spinner.
 * - If no user is authenticated, redirects to /management/login.
 * - If authenticated but no role, shows unauthorized message.
 * - If authenticated and has role, renders children and passes the user object down.
 *
 * @param {{ children: React.ReactNode, redirectTo?: string }} props
 */
export default function AuthGuard({ children, redirectTo = '/management/login' }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Inactivity Timeout (15 minutes)
  useEffect(() => {
    if (!user) return; // Only track inactivity if logged in

    const TIMEOUT_MS = 15 * 60 * 1000;
    let timeoutId;

    const resetTimer = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(async () => {
        console.log("Session expired due to inactivity. Logging out.");
        await signOutAdmin();
        // The onAuthChange listener will handle the redirect
      }, TIMEOUT_MS);
    };

    // Initialize timer
    resetTimer();

    // Listeners for user activity
    const events = ['mousemove', 'keydown', 'scroll', 'click', 'touchstart'];
    events.forEach(event => window.addEventListener(event, resetTimer));

    return () => {
      clearTimeout(timeoutId);
      events.forEach(event => window.removeEventListener(event, resetTimer));
    };
  }, [user]);

  useEffect(() => {
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch role from Firestore
        const role = await getUserRole(firebaseUser.uid);
        if (role) {
          setUser({ ...firebaseUser, role });
        } else {
          // If no role found, log them out or just set user with no role.
          // We will set user with no role and handle it in the render block.
          setUser({ ...firebaseUser, role: null });
        }
      } else {
        setUser(null);
        router.replace(redirectTo);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router, redirectTo]);

  if (loading) {
    return <LoadingSpinner fullPage size="lg" label="Loading..." />;
  }

  if (!user) return null;

  if (!user.role) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#f8f9fa' }}>
        <div style={{ padding: '2rem', background: '#fff', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', textAlign: 'center' }}>
          <i className="fa-solid fa-lock" style={{ fontSize: '3rem', color: '#dc3545', marginBottom: '1rem' }}></i>
          <h2 style={{ margin: '0 0 1rem 0', color: '#333' }}>Access Denied</h2>
          <p style={{ margin: '0 0 1.5rem 0', color: '#666' }}>Your account does not have an assigned role.<br/>Please contact the system administrator.</p>
          <button 
            onClick={() => signOutAdmin()}
            style={{ padding: '0.5rem 1rem', background: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  // Pass user through render props pattern for convenience
  return (
    <AuthContext.Provider value={{ user }}>
      {typeof children === 'function' ? children(user) : children}
    </AuthContext.Provider>
  );
}

