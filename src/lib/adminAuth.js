import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

/**
 * Fetch the role of a user from the Firestore 'users' collection.
 * @param {string} uid The user's Firebase Auth UID.
 * @returns {Promise<string|null>} The role (e.g., 'admin', 'receptionist') or null if not found.
 */
export async function getUserRole(uid) {
  try {
    const userDocRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      return userDoc.data().role || null;
    }
    return null;
  } catch (error) {
    console.error("Error fetching user role:", error);
    return null;
  }
}

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
