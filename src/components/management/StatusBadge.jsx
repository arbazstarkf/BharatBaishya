'use client';

/**
 * Reusable appointment status badge.
 * @param {{ status: 'pending'|'confirmed'|'completed'|'cancelled', size?: 'sm'|'md' }} props
 */

const STATUS_CONFIG = {
  pending: {
    label: 'Pending',
    icon: 'fa-clock',
    cls: 'mgmt-badge--pending',
  },
  confirmed: {
    label: 'Confirmed',
    icon: 'fa-circle-check',
    cls: 'mgmt-badge--confirmed',
  },
  completed: {
    label: 'Completed',
    icon: 'fa-check-double',
    cls: 'mgmt-badge--completed',
  },
  cancelled: {
    label: 'Cancelled',
    icon: 'fa-ban',
    cls: 'mgmt-badge--cancelled',
  },
};

export default function StatusBadge({ status, showDot = true }) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;

  return (
    <span className={`mgmt-badge ${config.cls}`}>
      {showDot && <span className="mgmt-badge__dot" />}
      {config.label}
    </span>
  );
}

export { STATUS_CONFIG };
