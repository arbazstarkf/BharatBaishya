import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from './firebase';

/**
 * Sign in the admin with email and password.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<UserCredential>}
 */
export async function signInAdmin(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

/**
 * Sign out the currently authenticated admin.
 * @returns {Promise<void>}
 */
export async function signOutAdmin() {
  return firebaseSignOut(auth);
}

/**
 * Subscribe to auth state changes.
 * @param {(user: User | null) => void} callback
 * @returns {() => void} unsubscribe function
 */
export function onAuthChange(callback) {
  return onAuthStateChanged(auth, callback);
}

/**
 * Get the currently signed-in user synchronously.
 * Returns null if no user is signed in.
 * @returns {User | null}
 */
export function getCurrentUser() {
  return auth.currentUser;
}
