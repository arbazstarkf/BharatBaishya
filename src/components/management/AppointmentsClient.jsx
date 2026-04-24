'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import FilterBar from './FilterBar';
import AppointmentsTable from './AppointmentsTable';
import AppointmentDetailModal from './AppointmentDetailModal';

/* ------------------------------------------------------------------ */
/*  Toast hook (self-contained so it can be extracted later)           */
/* ------------------------------------------------------------------ */
function useToast() {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, removing: true } : t)));
      setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 300);
    }, 3500);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, removing: true } : t)));
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 300);
  }, []);

  return { toasts, addToast, removeToast };
}

/* ------------------------------------------------------------------ */
/*  Filter appointments by current criteria                           */
/* ------------------------------------------------------------------ */
function applyFilters(appointments, { search, dateFilter, customStart, customEnd }) {
  const q = search.toLowerCase().trim();
  
  return appointments.filter((apt) => {
    // Search filter (Global)
    if (q) {
      const haystack = [apt.name, apt.phone, apt.email, apt.reason]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      if (!haystack.includes(q)) return false;
      return true; // Search overrides timeline
    }

    // Timeline Filter
    if (dateFilter !== 'all') {
      const now = new Date();
      let start;
      const aptDate = new Date(apt.date); // Assuming apt.date is 'YYYY-MM-DD'
      
      if (dateFilter === 'today') {
        const todayStr = now.toISOString().split('T')[0];
        if (apt.date !== todayStr) return false;
      } else if (dateFilter === 'week') {
        start = new Date(now.setDate(now.getDate() - 7));
        if (aptDate < start) return false;
      } else if (dateFilter === 'month') {
        start = new Date(now.setMonth(now.getMonth() - 1));
        if (aptDate < start) return false;
      } else if (dateFilter === 'custom') {
        if (customStart) {
          const cStart = new Date(customStart);
          if (aptDate < cStart) return false;
        }
        if (customEnd) {
          const cEnd = new Date(customEnd);
          if (aptDate > cEnd) return false;
        }
      }
    }

    return true;
  });
}

/* ------------------------------------------------------------------ */
/*  Appointments Client                                                */
/* ------------------------------------------------------------------ */
export default function AppointmentsClient() {
  const [appointments, setAppointments] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [firestoreError, setFirestoreError] = useState('');
  const prevCountRef = useRef(0);

  // Filters
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState('today');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');

  // Modal
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // Toast
  const { toasts, addToast, removeToast } = useToast();

  // Real-time Firestore listener
  useEffect(() => {
    const q = query(collection(db, 'appointments'), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const docs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        
        // Detect new appointments for notification
        if (docs.length > prevCountRef.current && !loadingData) {
          const newApt = docs[0];
          addToast(`New appointment from ${newApt.name || 'a patient'}!`, 'success');
        }
        prevCountRef.current = docs.length;

        setAppointments(docs);
        setLoadingData(false);
        setFirestoreError('');
      },
      (err) => {
        setFirestoreError(
          err.code === 'permission-denied'
            ? 'Access Denied: You do not have permission to view this data.'
            : 'Error loading data. Please check your connection.'
        );
        setLoadingData(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Derived
  const filtered = applyFilters(appointments, { search, dateFilter, customStart, customEnd });

  return (
    <>
      {/* Filter bar */}
      <FilterBar
        search={search}
        onSearchChange={setSearch}
        dateFilter={dateFilter}
        onDateChange={setDateFilter}
        customStart={customStart}
        onCustomStartChange={setCustomStart}
        customEnd={customEnd}
        onCustomEndChange={setCustomEnd}
      />

      {/* Appointments table card */}
      <div className="mgmt-card">
        <div className="mgmt-card__header">
          <div style={{ flex: 1 }}>
            <div className="mgmt-card__title">
              <i className="fa-solid fa-calendar-check" style={{ marginRight: 8, color: 'var(--mgmt-accent)' }} />
              Online Appointment Bookings
            </div>
            <div className="mgmt-card__subtitle">
              {loadingData
                ? 'Loading…'
                : `${filtered.length} of ${appointments.length} appointment${appointments.length !== 1 ? 's' : ''}`}
            </div>
          </div>
        </div>

        {/* Error state */}
        {firestoreError && (
          <div className="mgmt-alert mgmt-alert--error" style={{ margin: '16px 22px', borderRadius: 8 }}>
            <i className="fa-solid fa-triangle-exclamation mgmt-alert__icon" />
            <span>{firestoreError}</span>
          </div>
        )}

        {/* Loading state */}
        {loadingData ? (
          <div style={{ padding: '48px 0', display: 'flex', justifyContent: 'center' }}>
            <div className="mgmt-spinner" />
          </div>
        ) : (
          <AppointmentsTable
            appointments={filtered}
            onRowClick={setSelectedAppointment}
          />
        )}
      </div>

      {/* Detail modal */}
      {selectedAppointment && (
        <AppointmentDetailModal
          appointment={selectedAppointment}
          onClose={() => setSelectedAppointment(null)}
          onToast={addToast}
        />
      )}

      {/* Toast container */}
      <div className="mgmt-toast-container" aria-live="polite">
        {toasts.map(({ id, message, type, removing }) => (
          <div key={id} className={`mgmt-toast mgmt-toast--${type} ${removing ? 'removing' : ''}`} role="alert">
            <span className="mgmt-toast__icon">
              {type === 'success'
                ? <i className="fa-solid fa-circle-check" style={{ color: '#10b981' }} />
                : <i className="fa-solid fa-circle-exclamation" style={{ color: '#ef4444' }} />}
            </span>
            <span className="mgmt-toast__msg">{message}</span>
            <button className="mgmt-toast__close" onClick={() => removeToast(id)} aria-label="Dismiss">
              <i className="fa-solid fa-xmark" />
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
