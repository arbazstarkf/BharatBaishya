/**
 * Client-side login rate limiter for the management panel.
 * Tracks failed attempts in localStorage and enforces a lockout window.
 *
 * Limits: 5 attempts per 15-minute window.
 * After 5 failures the user is locked out for 15 minutes.
 */

const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes
const STORAGE_PREFIX = 'mgmt_login_rl_';

function getStoreKey(email) {
  return `${STORAGE_PREFIX}${email.toLowerCase()}`;
}

function getStore(email) {
  if (typeof window === 'undefined' || !email) return { attempts: [], lockedUntil: null };
  try {
    return JSON.parse(
      localStorage.getItem(getStoreKey(email)) ||
        '{"attempts":[],"lockedUntil":null}'
    );
  } catch {
    return { attempts: [], lockedUntil: null };
  }
}

function saveStore(email, data) {
  if (typeof window === 'undefined' || !email) return;
  localStorage.setItem(getStoreKey(email), JSON.stringify(data));
}

/**
 * Check whether the current user is rate-limited.
 * @param {string} email
 * @returns {{ allowed: boolean, remainingSec?: number, attemptsLeft?: number }}
 */
export function checkRateLimit(email) {
  if (!email) return { allowed: true, attemptsLeft: MAX_ATTEMPTS };
  const now = Date.now();
  const data = getStore(email);

  // Active lockout?
  if (data.lockedUntil && now < data.lockedUntil) {
    const remainingSec = Math.ceil((data.lockedUntil - now) / 1000);
    return { allowed: false, remainingSec, attemptsLeft: 0 };
  }

  // Prune attempts older than the lockout window & clear stale lockout
  data.attempts = (data.attempts || []).filter((t) => now - t < LOCKOUT_MS);
  data.lockedUntil = null;
  saveStore(email, data);

  const attemptsLeft = MAX_ATTEMPTS - data.attempts.length;
  return { allowed: true, attemptsLeft };
}

/**
 * Record a failed login attempt. Returns lock status.
 * @param {string} email
 * @returns {{ locked: boolean, remainingSec: number | null, attemptsLeft: number }}
 */
export function recordFailedAttempt(email) {
  if (!email) return { locked: false, remainingSec: null, attemptsLeft: MAX_ATTEMPTS };
  const now = Date.now();
  const data = getStore(email);

  data.attempts = [
    ...(data.attempts || []).filter((t) => now - t < LOCKOUT_MS),
    now,
  ];

  if (data.attempts.length >= MAX_ATTEMPTS) {
    data.lockedUntil = now + LOCKOUT_MS;
  }

  saveStore(email, data);

  const locked = !!data.lockedUntil;
  const remainingSec = locked
    ? Math.ceil((data.lockedUntil - now) / 1000)
    : null;
  const attemptsLeft = Math.max(0, MAX_ATTEMPTS - data.attempts.length);

  return { locked, remainingSec, attemptsLeft };
}

/**
 * Clear the rate-limit record on successful login.
 * @param {string} email
 */
export function clearRateLimit(email) {
  if (typeof window !== 'undefined' && email) localStorage.removeItem(getStoreKey(email));
}

/**
 * Format remaining lockout seconds as "Xm Ys".
 * @param {number} sec
 * @returns {string}
 */
export function formatLockoutTime(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}
