'use client';

import { useState, useEffect, useRef } from 'react';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import StatusBadge from './StatusBadge';

const STATUS_OPTIONS = ['pending', 'confirmed', 'completed', 'cancelled'];

/**
 * Slide-in drawer showing full appointment details with inline status management.
 *
 * @param {{
 *   appointment: object | null,
 *   onClose: () => void,
 *   onToast: (msg: string, type: 'success' | 'error') => void,
 * }} props
 */
export default function AppointmentDetailModal({ appointment, onClose, onToast }) {
  const [selectedStatus, setSelectedStatus] = useState('');
  const [saving, setSaving] = useState(false);
  const [closing, setClosing] = useState(false);
  const overlayRef = useRef(null);

  useEffect(() => {
    if (appointment) {
      setSelectedStatus(appointment.status || 'pending');
      setClosing(false);
    }
  }, [appointment]);

  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') handleClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  });

  if (!appointment) return null;

  const handleClose = () => {
    setClosing(true);
    setTimeout(onClose, 250);
  };

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) handleClose();
  };

  const handleStatusSave = async () => {
    if (selectedStatus === appointment.status) {
      onToast('Status is already ' + selectedStatus, 'error');
      return;
    }
    setSaving(true);
    try {
      await updateDoc(doc(db, 'appointments', appointment.id), {
        status: selectedStatus,
        updatedAt: serverTimestamp(),
      });
      onToast(`Status updated to ${selectedStatus}`, 'success');
      handleClose();
    } catch (err) {
      console.error('Status update failed:', err);
      onToast('Failed to update status. Please try again.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    try {
      return new Date(dateStr).toLocaleDateString('en-IN', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
      });
    } catch { return dateStr; }
  };

  const formatTimestamp = (ts) => {
    if (!ts?.toDate) return '—';
    return ts.toDate().toLocaleString('en-IN', {
      day: 'numeric', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  return (
    <div
      ref={overlayRef}
      className={`mgmt-modal-overlay ${closing ? 'closing' : ''}`}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-label="Appointment details"
    >
      <div className="mgmt-drawer">
        {/* Header */}
        <div className="mgmt-drawer__header">
          <div>
            <div className="mgmt-drawer__title">Appointment Details</div>
            <div className="mgmt-drawer__subtitle">ID: {appointment.id}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <StatusBadge status={appointment.status || 'pending'} />
            <button
              className="mgmt-icon-btn"
              onClick={handleClose}
              aria-label="Close drawer"
            >
              <i className="fa-solid fa-xmark" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="mgmt-drawer__body">
          {/* Patient Info */}
          <div className="mgmt-detail-section">
            <div className="mgmt-detail-section__title">
              <i className="fa-solid fa-user" style={{ marginRight: 6 }} />
              Patient Information
            </div>
            <div className="mgmt-detail-grid">
              <div className="mgmt-detail-field">
                <span className="mgmt-detail-label">Full Name</span>
                <span className="mgmt-detail-value">{appointment.name || '—'}</span>
              </div>
              <div className="mgmt-detail-field">
                <span className="mgmt-detail-label">Phone</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span className="mgmt-detail-value" style={{ fontFamily: 'monospace' }}>
                    {appointment.phone || '—'}
                  </span>
                  {appointment.phone && (
                    <div style={{ display: 'flex', gap: 6 }}>
                      <a
                        href={`tel:${appointment.phone}`}
                        className="mgmt-icon-btn mgmt-icon-btn--sm"
                        title="Call Patient"
                      >
                        <i className="fa-solid fa-phone" style={{ fontSize: 11 }} />
                      </a>
                      <a
                        href={`https://wa.me/${appointment.phone.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mgmt-icon-btn mgmt-icon-btn--sm"
                        style={{ color: '#25D366' }}
                        title="WhatsApp Patient"
                      >
                        <i className="fa-brands fa-whatsapp" style={{ fontSize: 13 }} />
                      </a>
                    </div>
                  )}
                </div>
              </div>
              <div className="mgmt-detail-field full-width">
                <span className="mgmt-detail-label">Email</span>
                <span className={`mgmt-detail-value ${!appointment.email ? 'empty' : ''}`}>
                  {appointment.email || 'Not provided'}
                </span>
              </div>
            </div>
          </div>

          {/* Appointment Details */}
          <div className="mgmt-detail-section">
            <div className="mgmt-detail-section__title">
              <i className="fa-solid fa-calendar-days" style={{ marginRight: 6 }} />
              Appointment Details
            </div>
            <div className="mgmt-detail-grid">
              <div className="mgmt-detail-field">
                <span className="mgmt-detail-label">Preferred Date</span>
                <span className="mgmt-detail-value">{formatDate(appointment.date)}</span>
              </div>
              <div className="mgmt-detail-field">
                <span className="mgmt-detail-label">Preferred Time</span>
                <span className={`mgmt-detail-value ${!appointment.time ? 'empty' : ''}`}>
                  {appointment.time || 'Not specified'}
                </span>
              </div>
              <div className="mgmt-detail-field full-width">
                <span className="mgmt-detail-label">Location</span>
                <span className="mgmt-detail-value">{appointment.location || '—'}</span>
              </div>
              <div className="mgmt-detail-field full-width">
                <span className="mgmt-detail-label">Reason for Visit</span>
                <span className={`mgmt-detail-value ${!appointment.reason ? 'empty' : ''}`}>
                  {appointment.reason || 'Not specified'}
                </span>
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div className="mgmt-detail-section">
            <div className="mgmt-detail-section__title">
              <i className="fa-solid fa-clock-rotate-left" style={{ marginRight: 6 }} />
              Timestamps
            </div>
            <div className="mgmt-detail-grid">
              <div className="mgmt-detail-field">
                <span className="mgmt-detail-label">Submitted On</span>
                <span className="mgmt-detail-value">{formatTimestamp(appointment.createdAt)}</span>
              </div>
              <div className="mgmt-detail-field">
                <span className="mgmt-detail-label">Last Updated</span>
                <span className={`mgmt-detail-value ${!appointment.updatedAt ? 'empty' : ''}`}>
                  {appointment.updatedAt ? formatTimestamp(appointment.updatedAt) : 'Not updated'}
                </span>
              </div>
            </div>
          </div>

          {/* Status Management */}
          <div className="mgmt-detail-section">
            <div className="mgmt-detail-section__title">
              <i className="fa-solid fa-sliders" style={{ marginRight: 6 }} />
              Update Status
            </div>
            <div className="mgmt-status-select">
              <select
                className="mgmt-select"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                disabled={saving}
                id="status-select"
                aria-label="Change appointment status"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s} style={{ textTransform: 'capitalize' }}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mgmt-drawer__footer">
          <button className="mgmt-btn mgmt-btn--secondary" onClick={handleClose} disabled={saving}>
            Cancel
          </button>
          <button
            className="mgmt-btn mgmt-btn--primary"
            onClick={handleStatusSave}
            disabled={saving || selectedStatus === (appointment.status || 'pending')}
            id="save-status-btn"
          >
            {saving ? (
              <>
                <span className="mgmt-btn__spinner" />
                Saving…
              </>
            ) : (
              <>
                <i className="fa-solid fa-floppy-disk" />
                Save Status
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
