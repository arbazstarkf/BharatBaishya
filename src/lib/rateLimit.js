/**
 * Client-side login rate limiter for the management panel.
 * Tracks failed attempts in localStorage and enforces a lockout window.
 *
 * Limits: 5 attempts per 15-minute window.
 * After 5 failures the user is locked out for 15 minutes.
 */

const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes
const STORAGE_KEY = 'mgmt_login_rl';

function getStore() {
  if (typeof window === 'undefined') return { attempts: [], lockedUntil: null };
  try {
    return JSON.parse(
      localStorage.getItem(STORAGE_KEY) ||
        '{"attempts":[],"lockedUntil":null}'
    );
  } catch {
    return { attempts: [], lockedUntil: null };
  }
}

function saveStore(data) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

/**
 * Check whether the current user is rate-limited.
 * @returns {{ allowed: boolean, remainingSec?: number, attemptsLeft?: number }}
 */
export function checkRateLimit() {
  const now = Date.now();
  const data = getStore();

  // Active lockout?
  if (data.lockedUntil && now < data.lockedUntil) {
    const remainingSec = Math.ceil((data.lockedUntil - now) / 1000);
    return { allowed: false, remainingSec, attemptsLeft: 0 };
  }

  // Prune attempts older than the lockout window & clear stale lockout
  data.attempts = (data.attempts || []).filter((t) => now - t < LOCKOUT_MS);
  data.lockedUntil = null;
  saveStore(data);

  const attemptsLeft = MAX_ATTEMPTS - data.attempts.length;
  return { allowed: true, attemptsLeft };
}

/**
 * Record a failed login attempt. Returns lock status.
 * @returns {{ locked: boolean, remainingSec: number | null, attemptsLeft: number }}
 */
export function recordFailedAttempt() {
  const now = Date.now();
  const data = getStore();

  data.attempts = [
    ...(data.attempts || []).filter((t) => now - t < LOCKOUT_MS),
    now,
  ];

  if (data.attempts.length >= MAX_ATTEMPTS) {
    data.lockedUntil = now + LOCKOUT_MS;
  }

  saveStore(data);

  const locked = !!data.lockedUntil;
  const remainingSec = locked
    ? Math.ceil((data.lockedUntil - now) / 1000)
    : null;
  const attemptsLeft = Math.max(0, MAX_ATTEMPTS - data.attempts.length);

  return { locked, remainingSec, attemptsLeft };
}

/**
 * Clear the rate-limit record on successful login.
 */
export function clearRateLimit() {
  if (typeof window !== 'undefined') localStorage.removeItem(STORAGE_KEY);
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
