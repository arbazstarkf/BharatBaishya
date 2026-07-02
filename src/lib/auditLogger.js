import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

/**
 * Logs an action to the audit_logs collection in Firestore.
 * 
 * @param {Object} params
 * @param {string} params.uid - The Firebase Auth UID of the user performing the action.
 * @param {string} params.role - The role of the user (e.g., 'admin', 'receptionist').
 * @param {string} params.email - The email of the user (for easier reading).
 * @param {string} params.action - The action performed (e.g., 'CREATE', 'UPDATE_STATUS', 'DELETE').
 * @param {string} params.resource - The type of resource modified (e.g., 'PRESCRIPTION', 'APPOINTMENT').
 * @param {string} params.resourceId - The ID of the specific document modified (optional).
 * @param {Object} params.details - Additional context or data payload (optional).
 */
export async function logAuditAction({ uid, role, email, action, resource, resourceId = null, details = {} }) {
  // Strip out any accidental undefined values from details to prevent Firestore crash
  const cleanDetails = { ...details };
  Object.keys(cleanDetails).forEach(key => {
    if (cleanDetails[key] === undefined) {
      cleanDetails[key] = null;
    }
  });

  await addDoc(collection(db, 'audit_logs'), {
    user: {
      uid: uid || 'UNKNOWN',
      role: role || 'UNKNOWN',
      email: email || 'UNKNOWN'
    },
    action,
    resource,
    resourceId,
    details: cleanDetails,
    timestamp: serverTimestamp()
  });
}
