'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import StatsCards from './StatsCards';
import FilterBar from './FilterBar';
import AppointmentsTable from './AppointmentsTable';
import AppointmentDetailModal from './AppointmentDetailModal';
import TrendChart from './TrendChart';

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
/*  Compute stats from appointments array                              */
/* ------------------------------------------------------------------ */
function computeStats(appointments, prescriptions = []) {
  const stats = appointments.reduce(
    (acc, apt) => {
      acc.total += 1;
      const s = apt.status || 'pending';
      if (acc[s] != null) acc[s] += 1;
      return acc;
    },
    { total: 0, pending: 0, confirmed: 0, completed: 0, cancelled: 0 }
  );

  // Compute Prescription Stats
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  let patientsToday = 0;
  const uniquePatientsThisMonth = new Set();

  prescriptions.forEach(rx => {
    const createdDate = rx.createdAt?.toDate ? rx.createdAt.toDate() : new Date(rx.createdAt);
    
    if (createdDate >= startOfToday) {
      patientsToday++;
    }

    if (createdDate >= startOfMonth) {
      // Use phone or name+age as a unique identifier if ID isn't patient-specific
      const identifier = rx.phone || `${rx.name}-${rx.age}`;
      uniquePatientsThisMonth.add(identifier);
    }
  });

  stats.patientsToday = patientsToday;
  stats.uniquePatientsMonth = uniquePatientsThisMonth.size;

  // Compute 7-day trend
  const trend = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
    const dayStr = d.toLocaleDateString([], { weekday: 'short' });
    const count = prescriptions.filter(rx => {
      const rd = rx.createdAt?.toDate ? rx.createdAt.toDate() : new Date(rx.createdAt);
      return rd.toDateString() === d.toDateString();
    }).length;
    trend.push({ label: dayStr, value: count });
  }
  stats.trend = trend;

  return stats;
}

/* ------------------------------------------------------------------ */
/*  Filter appointments by current criteria                           */
/* ------------------------------------------------------------------ */
function applyFilters(appointments, { search, statusFilter, locationFilter, dateFilter }) {
  const q = search.toLowerCase().trim();
  return appointments.filter((apt) => {
    if (statusFilter !== 'all' && (apt.status || 'pending') !== statusFilter) return false;
    if (locationFilter !== 'All Locations' && apt.location !== locationFilter) return false;
    if (dateFilter && apt.date !== dateFilter) return false;
    if (q) {
      const haystack = [apt.name, apt.phone, apt.email, apt.reason]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });
}

/* ------------------------------------------------------------------ */
/*  Dashboard Client                                                   */
/* ------------------------------------------------------------------ */
export default function DashboardClient() {
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [firestoreError, setFirestoreError] = useState('');

  useEffect(() => {
    const qAppts = query(collection(db, 'appointments'), orderBy('createdAt', 'desc'));
    const qRx = query(collection(db, 'prescriptions'), orderBy('createdAt', 'desc'));

    const unsubscribeAppts = onSnapshot(qAppts, (snapshot) => {
      setAppointments(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (err) => console.error("Appts Error:", err));

    const unsubscribeRx = onSnapshot(qRx, (snapshot) => {
      setPrescriptions(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoadingData(false);
    }, (err) => {
      console.error("Rx Error:", err);
      setLoadingData(false);
    });

    return () => {
      unsubscribeAppts();
      unsubscribeRx();
    };
  }, []);

  const stats = computeStats(appointments, prescriptions);
  const recentAppointments = appointments.slice(0, 5);

  return (
    <div className="mgmt-dashboard-overview">

      {/* Primary Stats */}
      <StatsCards stats={stats} />

      <div className="mgmt-dashboard-main-grid">
        {/* Left Column: Recent Activity */}
        <div className="mgmt-dashboard-activity-col">
          <div className="mgmt-section-label">Recent Bookings</div>
          <div className="mgmt-card">
            <div className="mgmt-card__header">
              <div className="mgmt-card__title">Latest Appointments</div>
              <Link href="/management/appointments" className="mgmt-link-btn">View Full List</Link>
            </div>
            <div className="mgmt-card__body">
              {loadingData ? (
                <div className="p-24 text-center"><div className="mgmt-spinner mx-auto"></div></div>
              ) : recentAppointments.length > 0 ? (
                <ul className="mgmt-mini-list">
                  {recentAppointments.map((apt) => (
                    <li key={apt.id} className="mgmt-mini-list-item">
                      <div className="item-avatar">{apt.name?.[0].toUpperCase() || 'P'}</div>
                      <div className="item-info">
                        <strong>{apt.name}</strong>
                        <span>{apt.date} • {apt.location}</span>
                      </div>
                      <div className={`mgmt-badge mgmt-badge--${apt.status || 'pending'}`}>
                        {apt.status || 'pending'}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-24 text-center text-slate-500">No recent appointments.</div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Quick Actions */}
        <div className="mgmt-dashboard-actions-col">
          <div className="mgmt-section-label">Quick Operations</div>
          <div className="mgmt-quick-actions-list">
            <Link href="/management/prescriptions" className="mgmt-action-card-v2">
              <div className="mgmt-action-icon-v2" style={{ background: 'var(--mgmt-accent-light)', color: 'var(--mgmt-accent)' }}>
                <i className="fa-solid fa-file-prescription"></i>
              </div>
              <div className="mgmt-action-info-v2">
                <h3>New Prescription</h3>
                <p>Start a digital session</p>
              </div>
              <i className="fa-solid fa-plus mgmt-action-plus"></i>
            </Link>

            <Link href="/management/appointments" className="mgmt-action-card-v2">
              <div className="mgmt-action-icon-v2" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
                <i className="fa-solid fa-calendar-check"></i>
              </div>
              <div className="mgmt-action-info-v2">
                <h3>Manage Bookings</h3>
                <p>Update patient schedules</p>
              </div>
              <i className="fa-solid fa-arrow-right mgmt-action-arrow-v2"></i>
            </Link>

            <Link href="/management/patients" className="mgmt-action-card-v2">
              <div className="mgmt-action-icon-v2" style={{ background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' }}>
                <i className="fa-solid fa-folder-open"></i>
              </div>
              <div className="mgmt-action-info-v2">
                <h3>Clinical Records</h3>
                <p>Access history & archives</p>
              </div>
              <i className="fa-solid fa-arrow-right mgmt-action-arrow-v2"></i>
            </Link>
          </div>
        </div>
      </div>

      {/* Patient Trend Chart */}
      <TrendChart data={stats.trend || []} />
    </div>
  );
}
