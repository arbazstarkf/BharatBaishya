'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { signInAdmin } from '@/lib/adminAuth';
import { onAuthChange } from '@/lib/adminAuth';
import {
  checkRateLimit,
  recordFailedAttempt,
  clearRateLimit,
  formatLockoutTime,
} from '@/lib/rateLimit';
import { useManagementTheme } from './ManagementThemeProvider';
import LoadingSpinner from './LoadingSpinner';

/**
 * Login page client component for the management panel.
 */
const MAX_ATTEMPTS = 5;

export default function LoginClient() {
  const router = useRouter();
  const { theme, toggleTheme } = useManagementTheme();

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Status
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rateLimitInfo, setRateLimitInfo] = useState({ allowed: true, attemptsLeft: MAX_ATTEMPTS });

  const [countdown, setCountdown] = useState(0);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const timerRef = useRef(null);

  // Redirect if already logged in
  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      if (user) {
        router.replace('/management');
      } else {
        setCheckingAuth(false);
      }
    });
    return () => unsubscribe();
  }, [router]);

  // Check rate limit on mount
  useEffect(() => {
    const rl = checkRateLimit();
    setRateLimitInfo(rl);
    if (!rl.allowed) {
      startCountdown(rl.remainingSec);
    }
    return () => clearInterval(timerRef.current);
  }, []);

  const startCountdown = useCallback((initialSec) => {
    setCountdown(initialSec);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          const rl = checkRateLimit();
          setRateLimitInfo(rl);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const getFirebaseErrorMessage = (code) => {
    switch (code) {
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'Invalid email or password.';
      default:
        return 'Sign-in failed. Please try again.';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const rl = checkRateLimit();
    if (!rl.allowed) {
      setRateLimitInfo(rl);
      startCountdown(rl.remainingSec);
      return;
    }

    if (!email.trim() || !password) {
      setError('Please enter your email and password.');
      return;
    }

    setLoading(true);
    try {
      await signInAdmin(email.trim(), password);
      clearRateLimit();
      router.replace('/management');
    } catch (err) {
      const result = recordFailedAttempt();
      setRateLimitInfo(checkRateLimit());

      if (result.locked) {
        startCountdown(result.remainingSec);
        setError(`Too many failed attempts. Locked for ${formatLockoutTime(result.remainingSec)}.`);
      } else {
        const msg = getFirebaseErrorMessage(err.code);
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return <LoadingSpinner fullPage size="lg" label="Initialising Secure Portal..." />;
  }

  const isLocked = !rateLimitInfo.allowed;

  return (
    <div className="mgmt-login-page">
      <div className="mgmt-login-bg" />

      <button
        className="mgmt-icon-btn"
        onClick={toggleTheme}
        style={{ position: 'absolute', top: 24, right: 24 }}
        title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        aria-label="Toggle theme"
      >
        <i className={`fa-solid ${theme === 'dark' ? 'fa-sun' : 'fa-moon'}`} />
      </button>

      <div className="mgmt-login-card">
        <div className="mgmt-login-header">
          <div className="mgmt-login-logo-plain">
            <img src="/images/logo.png" alt="Dr. Bharat Baishya" />
          </div>
          <h1 className="mgmt-login-title">Management Panel</h1>
          <p className="mgmt-login-subtitle">Dr. Bharat Baishya</p>
          <p className="mgmt-login-version">v1.0.0</p>
        </div>

        {isLocked && (
          <div className="mgmt-alert mgmt-alert--warning" style={{ marginBottom: 16 }}>
            <i className="fa-solid fa-lock mgmt-alert__icon" />
            <div>
              <strong>Account Locked</strong> — Try again in {formatLockoutTime(countdown)}.
            </div>
          </div>
        )}

        {error && !isLocked && (
          <div className="mgmt-alert mgmt-alert--error" style={{ marginBottom: 16 }}>
            <i className="fa-solid fa-circle-exclamation mgmt-alert__icon" />
            <span>{error}</span>
          </div>
        )}

        <form className="mgmt-login-form" onSubmit={handleSubmit}>
          <div className="mgmt-form-group">
            <label className="mgmt-form-label">Email Address</label>
            <div className="mgmt-input-wrapper">
              <i className="fa-solid fa-envelope mgmt-input-icon" />
              <input
                type="email"
                className="mgmt-input"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading || isLocked}
                required
              />
            </div>
          </div>

          <div className="mgmt-form-group">
            <label className="mgmt-form-label">Password</label>
            <div className="mgmt-input-wrapper">
              <i className="fa-solid fa-lock mgmt-input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                className="mgmt-input"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading || isLocked}
                style={{ paddingRight: 40 }}
                required
              />
              <button
                type="button"
                className="mgmt-input-toggle"
                onClick={() => setShowPassword((s) => !s)}
                tabIndex={-1}
              >
                <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} />
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="mgmt-btn mgmt-btn--primary mgmt-btn--full mgmt-btn--lg"
            disabled={loading || isLocked}
          >
            {loading ? 'Signing in…' : isLocked ? `Locked` : 'Sign In'}
          </button>
        </form>

        <p style={{ marginTop: 20, textAlign: 'center', fontSize: 11, color: 'var(--mgmt-text-muted)' }}>
          <i className="fa-solid fa-shield-halved" style={{ marginRight: 5 }} />
          Restricted access-Authorised personnel only
        </p>
      </div>

      {/* Easter Egg */}
      <div className="mgmt-login-easter-egg">
        <span className="ee-handle"> © Arbaz Khan | @Tonystark_f</span>
        <div className="ee-links">
          <a href="https://www.instagram.com/tonystark_f" target="_blank" rel="noopener noreferrer" className="instagram">
            <i className="fa-brands fa-instagram"></i>
          </a>
          <a href="https://www.linkedin.com/in/arbaztkhan" target="_blank" rel="noopener noreferrer" className="linkedin">
            <i className="fa-brands fa-linkedin"></i>
          </a>
          <a href="https://www.github.com/arbazstarkf" target="_blank" rel="noopener noreferrer" className="github">
            <i className="fa-brands fa-github"></i>
          </a>
        </div>
      </div>

      <style>{`
        .mgmt-login-logo-plain {
          width: 70px;
          height: 70px;
          margin: 0 auto 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .mgmt-login-logo-plain img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        .mgmt-login-version {
          font-size: 9px;
          font-weight: 800;
          color: var(--mgmt-accent);
          margin-top: 4px;
          background: var(--mgmt-accent-light);
          padding: 1px 8px;
          border-radius: 99px;
          display: inline-block;
          letter-spacing: 0.05em;
          opacity: 0.8;
        }
        .mgmt-login-easter-egg {
          position: fixed;
          bottom: 12px;
          right: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
          opacity: 0.3;
          transition: all 0.3s ease;
          user-select: none;
          z-index: 10;
        }
        .mgmt-login-easter-egg:hover {
          opacity: 0.8;
          transform: translateY(-2px);
        }
        .ee-handle {
          font-size: 10px;
          font-weight: 600;
          color: var(--mgmt-text-muted);
          letter-spacing: 0.02em;
        }
        .ee-links {
          display: flex;
          gap: 6px;
          border-left: 1px solid var(--mgmt-border);
          padding-left: 8px;
        }
        .ee-links a {
          font-size: 11px;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .ee-links a.instagram { color: #ff4d4d; }
        .ee-links a.linkedin { color: #0077b5; }
        .ee-links a.github { color: #8b949e; }
        
        .ee-links a:hover {
          transform: scale(1.25);
          filter: brightness(1.2);
        }
        
        .mgmt-login-header {
           border-bottom: none !important;
           padding-bottom: 0 !important;
        }
        .mgmt-login-logo { display: none !important; }
      `}</style>
    </div>
  );
}
