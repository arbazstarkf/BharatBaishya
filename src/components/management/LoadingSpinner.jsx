'use client';

/**
 * Reusable loading spinner component.
 * @param {{ size?: 'sm' | 'md' | 'lg', label?: string, fullPage?: boolean }} props
 */
export default function LoadingSpinner({ size = 'md', label, fullPage = false }) {
  const content = (
    <div className="mgmt-spinner-overlay">
      <div className={`mgmt-spinner mgmt-spinner--${size}`} role="status" aria-label="Loading" />
      {label && <p className="mgmt-spinner-label">{label}</p>}
    </div>
  );

  if (fullPage) {
    return (
      <div className="mgmt-full-page-loader">
        {content}
      </div>
    );
  }

  return content;
}
