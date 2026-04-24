'use client';

/**
 * Dashboard statistics cards.
 * @param {{ stats: { total: number, pending: number, confirmed: number, completed: number, cancelled: number } }} props
 */

const CARDS = [
  {
    key: 'patientsToday',
    label: 'Patients Today',
    icon: 'fa-user-doctor',
    color: '#0ea5e9',
    iconBg: 'rgba(14,165,233,0.12)',
  },
  {
    key: 'total',
    label: 'Total Bookings',
    icon: 'fa-calendar-days',
    color: '#14b8a6',
    iconBg: 'rgba(20,184,166,0.12)',
  },
  {
    key: 'pending',
    label: 'Pending',
    icon: 'fa-clock',
    color: '#f59e0b',
    iconBg: 'rgba(245,158,11,0.12)',
  },
  {
    key: 'confirmed',
    label: 'Confirmed',
    icon: 'fa-circle-check',
    color: '#10b981',
    iconBg: 'rgba(16,185,129,0.12)',
  },
];

export default function StatsCards({ stats }) {
  return (
    <div className="mgmt-stats-grid">
      {CARDS.map(({ key, label, icon, color, iconBg }) => (
        <div
          key={key}
          className="mgmt-stat-card"
          style={{ '--mgmt-stat-color': color, '--mgmt-stat-icon-bg': iconBg }}
        >
          <div className="mgmt-stat-icon">
            <i className={`fa-solid ${icon}`} />
          </div>
          <div>
            <div className="mgmt-stat-value">{stats?.[key] ?? 0}</div>
            <div className="mgmt-stat-label">{label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
