'use client';

import { useState } from 'react';
import StatusBadge from './StatusBadge';

const PAGE_SIZE = 10;

/**
 * Appointments data table with pagination and sorting.
 *
 * @param {{
 *   appointments: Array<object>,
 *   onRowClick: (appointment: object) => void,
 * }} props
 */
export default function AppointmentsTable({ appointments, onRowClick }) {
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState('createdAt');
  const [sortDir, setSortDir] = useState('desc');

  // Sorting
  const sorted = [...appointments].sort((a, b) => {
    let av = a[sortKey];
    let bv = b[sortKey];

    if (sortKey === 'createdAt') {
      av = a.createdAt?.toMillis?.() ?? 0;
      bv = b.createdAt?.toMillis?.() ?? 0;
    } else if (sortKey === 'date') {
      av = av ?? '';
      bv = bv ?? '';
    }

    if (av < bv) return sortDir === 'asc' ? -1 : 1;
    if (av > bv) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination
  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paged = sorted.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
    setPage(1);
  };

  const sortIcon = (key) => {
    if (sortKey !== key) return <i className="fa-solid fa-sort" style={{ opacity: 0.3, fontSize: 10 }} />;
    return sortDir === 'asc'
      ? <i className="fa-solid fa-sort-up" style={{ color: 'var(--mgmt-accent)', fontSize: 11 }} />
      : <i className="fa-solid fa-sort-down" style={{ color: 'var(--mgmt-accent)', fontSize: 11 }} />;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    try {
      return new Date(dateStr).toLocaleDateString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric',
      });
    } catch { return dateStr; }
  };

  const isRecent = (ts) => {
    if (!ts?.toMillis) return false;
    const tenMinutesAgo = Date.now() - 10 * 60 * 1000;
    return ts.toMillis() > tenMinutesAgo;
  };

  if (appointments.length === 0) {
    return (
      <div className="mgmt-empty">
        <div className="mgmt-empty__icon"><i className="fa-regular fa-calendar-xmark" /></div>
        <div className="mgmt-empty__title">No appointments found</div>
        <div className="mgmt-empty__subtitle">
          No bookings match your current filters. Try adjusting the search or status.
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mgmt-table-wrapper">
        <table className="mgmt-table">
          <thead>
            <tr>
              <th className="sortable" onClick={() => handleSort('name')}>
                Patient {sortIcon('name')}
              </th>
              <th>Phone</th>
              <th className="sortable" onClick={() => handleSort('location')}>
                Location {sortIcon('location')}
              </th>
              <th className="sortable" onClick={() => handleSort('status')}>
                Status {sortIcon('status')}
              </th>
              <th className="sortable" onClick={() => handleSort('createdAt')}>
                Submitted {sortIcon('createdAt')}
              </th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((apt) => (
              <tr key={apt.id} onClick={() => onRowClick(apt)} title="Click to view details">
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div className="mgmt-table__name">{apt.name}</div>
                    {isRecent(apt.createdAt) && (
                      <span
                        style={{
                          fontSize: 9,
                          fontWeight: 800,
                          background: 'var(--mgmt-accent)',
                          color: '#fff',
                          padding: '1px 4px',
                          borderRadius: 4,
                          textTransform: 'uppercase',
                        }}
                      >
                        New
                      </span>
                    )}
                  </div>
                  {apt.email && (
                    <div style={{ fontSize: 11, color: 'var(--mgmt-text-muted)', marginTop: 2 }}>
                      {apt.email}
                    </div>
                  )}
                </td>
                <td>
                  <span className="mgmt-table__phone">{apt.phone}</span>
                </td>
                <td>
                  <span className="mgmt-table__location">{apt.location || '—'}</span>
                </td>
                <td>
                  <StatusBadge status={apt.status || 'pending'} />
                </td>
                <td>
                  <span className="mgmt-table__date">
                    {apt.createdAt?.toDate
                      ? apt.createdAt.toDate().toLocaleString('en-IN', {
                          day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
                        })
                      : '—'}
                  </span>
                </td>
                <td onClick={(e) => e.stopPropagation()}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6 }}>
                    <a
                      href={`tel:${apt.phone}`}
                      className="mgmt-icon-btn mgmt-icon-btn--sm"
                      title="Call Patient"
                    >
                      <i className="fa-solid fa-phone" style={{ fontSize: 12 }} />
                    </a>
                    <a
                      href={`https://wa.me/${apt.phone?.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mgmt-icon-btn mgmt-icon-btn--sm"
                      style={{ color: '#25D366' }}
                      title="WhatsApp Patient"
                    >
                      <i className="fa-brands fa-whatsapp" style={{ fontSize: 14 }} />
                    </a>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mgmt-pagination">
          <span className="mgmt-pagination__info">
            Showing {(currentPage - 1) * PAGE_SIZE + 1}–
            {Math.min(currentPage * PAGE_SIZE, sorted.length)} of {sorted.length} appointments
          </span>
          <div className="mgmt-pagination__controls">
            <button
              className="mgmt-page-btn"
              onClick={() => setPage(1)}
              disabled={currentPage === 1}
              aria-label="First page"
            >
              <i className="fa-solid fa-angles-left" />
            </button>
            <button
              className="mgmt-page-btn"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              aria-label="Previous page"
            >
              <i className="fa-solid fa-angle-left" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
              .reduce((acc, p, idx, arr) => {
                if (idx > 0 && p - arr[idx - 1] > 1) acc.push('…');
                acc.push(p);
                return acc;
              }, [])
              .map((item, idx) =>
                item === '…' ? (
                  <span key={`ellipsis-${idx}`} style={{ padding: '0 4px', color: 'var(--mgmt-text-muted)' }}>…</span>
                ) : (
                  <button
                    key={item}
                    className={`mgmt-page-btn ${currentPage === item ? 'active' : ''}`}
                    onClick={() => setPage(item)}
                  >
                    {item}
                  </button>
                )
            )}

            <button
              className="mgmt-page-btn"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              aria-label="Next page"
            >
              <i className="fa-solid fa-angle-right" />
            </button>
            <button
              className="mgmt-page-btn"
              onClick={() => setPage(totalPages)}
              disabled={currentPage === totalPages}
              aria-label="Last page"
            >
              <i className="fa-solid fa-angles-right" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
