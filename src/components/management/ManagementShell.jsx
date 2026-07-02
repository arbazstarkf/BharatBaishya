'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOutAdmin } from '@/lib/adminAuth';
import { useManagementTheme } from './ManagementThemeProvider';
import AuthGuard from './AuthGuard';

const NAV_ITEMS = [
  {
    group: 'Overview',
    items: [
      { href: '/management', label: 'Dashboard', icon: 'fa-gauge-high', exact: true },
    ],
  },
  {
    group: 'Clinical',
    items: [
      { href: '/management/prescriptions', label: 'Prescriptions', icon: 'fa-file-prescription' },
    ],
  },
];

/**
 * Full management shell — sidebar + topbar + content area.
 * Wraps all protected management pages.
 * @param {{ children: React.ReactNode, pageTitle?: string, pageLabel?: string, allowedRoles?: string[] }} props
 */
export default function ManagementShell({ children, pageTitle = 'Dashboard', pageLabel = 'Management Panel', allowedRoles }) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme } = useManagementTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  // Updated navigation items
  const navGroups = [
    {
      group: 'Overview',
      items: [
        { href: '/management', label: 'Dashboard', icon: 'fa-gauge-high', exact: true },
      ],
    },
    {
      group: 'Appointments',
      items: [
        { href: '/management/appointments', label: 'Online Bookings', icon: 'fa-calendar-check' },
      ],
    },
    {
      group: 'Clinical',
      items: [
        { href: '/management/prescriptions', label: 'New Prescription', icon: 'fa-plus-circle' },
      ],
    },
    {
      group: 'Records',
      items: [
        { href: '/management/patients', label: 'Clinical Logs', icon: 'fa-folder-open' },
        { href: '/management/register', label: 'Patient  Register', icon: 'fa-address-book' },
      ],
    },
    {
      group: 'System',
      items: [
        { href: '/management/audit-logs', label: 'Audit Logs', icon: 'fa-clipboard-list' },
      ],
    },
  ];

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await signOutAdmin();
      router.replace('/management/login');
    } catch (err) {
      console.error('Sign-out error:', err);
      setSigningOut(false);
    }
  };

  const isActive = (href, exact) =>
    exact ? pathname === href : pathname.startsWith(href);

  const getUserInitials = (email) =>
    email ? email.slice(0, 2).toUpperCase() : 'AD';

  return (
    <AuthGuard>
      {(user) => {
        // Filter navigation based on role
        const filteredNavGroups = navGroups.filter(group => {
          if (user?.role === 'admin') return true;
          // Receptionist only sees Overview, Appointments, and Clinical
          return ['Overview', 'Appointments', 'Clinical'].includes(group.group);
        });

        return (
          <>
            {/* Mobile sidebar backdrop */}
            {sidebarOpen && (
              <div
                onClick={() => setSidebarOpen(false)}
                style={{
                  position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
                  zIndex: 190, display: 'none',
                }}
                id="sidebar-backdrop"
              />
            )}

            {/* Sidebar */}
            <aside className={`mgmt-sidebar ${sidebarOpen ? 'open' : ''} ${isCollapsed ? 'collapsed' : ''}`}>
              {/* Brand */}
              <div className="mgmt-sidebar__brand">
                <div className="mgmt-sidebar__logo-container">
                  <img src="/images/logo.png" alt="Dr. Bharat Baishya" className="mgmt-sidebar__logo-img" />
                </div>
                <div className="mgmt-sidebar__brand-name">
                  <div className="mgmt-sidebar__brand-title">Dr. B. Baishya</div>
                  <div className="mgmt-sidebar__brand-sub">Management Panel</div>
                </div>
              </div>

              {/* Navigation */}
              <nav className="mgmt-sidebar__nav" aria-label="Management navigation">
                {filteredNavGroups.map(({ group, items }) => (
                  <div key={group}>
                    <div className="mgmt-nav-label">{group}</div>
                    {items.map(({ href, label, icon, exact, badge, disabled }) => {
                      const content = (
                        <>
                          <span className="mgmt-nav-icon">
                            <i className={`fa-solid ${icon}`} />
                          </span>
                          <span className="mgmt-nav-text">{label}</span>
                          {badge != null && (
                            <span className="mgmt-nav-badge">{badge}</span>
                          )}
                          {disabled && (
                            <i className="fa-solid fa-lock" style={{ marginLeft: 'auto', fontSize: '10px', opacity: 0.5 }} />
                          )}
                        </>
                      );

                      if (disabled) {
                        return (
                          <div
                            key={href + label}
                            className="mgmt-nav-item disabled"
                            title={`${label} (Coming Soon)`}
                          >
                            {content}
                          </div>
                        );
                      }

                      return (
                        <Link
                          key={href + label}
                          href={href}
                          className={`mgmt-nav-item ${isActive(href, exact) ? 'active' : ''}`}
                          onClick={() => setSidebarOpen(false)}
                          title={isCollapsed ? label : ''}
                        >
                          {content}
                        </Link>
                      );
                    })}
                  </div>
                ))}
              </nav>

              {/* User footer */}
              <div className="mgmt-sidebar__footer">
                <div className="mgmt-user-card">
                  <div className="mgmt-user-avatar">
                    <i className="fa-solid fa-user" />
                  </div>
                  <div className="mgmt-user-info">
                    <div className="mgmt-user-name" title={user?.email}>{user?.email}</div>
                    <div className="mgmt-user-role">
                      {user?.role === 'admin' ? 'Administrator' : 'Receptionist'}
                    </div>
                  </div>
                </div>
              </div>
            </aside>

          {/* Main area */}
          <div className={`mgmt-main ${isCollapsed ? 'collapsed' : ''}`}>
            {/* Topbar */}
            <header className="mgmt-topbar">
              {/* Mobile menu toggle */}
              <button
                className="mgmt-icon-btn"
                onClick={() => setSidebarOpen((o) => !o)}
                aria-label="Toggle menu"
                style={{ display: 'none' }}
                id="sidebar-toggle"
              >
                <i className="fa-solid fa-bars" />
              </button>

              {/* Desktop Collapse Toggle */}
              <button
                className="mgmt-icon-btn desktop-only"
                onClick={() => setIsCollapsed(!isCollapsed)}
                title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                aria-label="Toggle Sidebar"
              >
                <i className={`fa-solid ${isCollapsed ? 'fa-indent' : 'fa-outdent'}`} />
              </button>

              {/* Page title */}
              <div className="mgmt-topbar__title">
                <div className="mgmt-topbar__page-name">{pageTitle}</div>
              </div>

              {/* Actions */}
              <div className="mgmt-topbar__actions">
                {/* Theme toggle */}
                <button
                  className="mgmt-icon-btn"
                  onClick={toggleTheme}
                  title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                  id="mgmt-theme-toggle"
                  aria-label="Toggle theme"
                >
                  <i className={`fa-solid ${theme === 'dark' ? 'fa-sun' : 'fa-moon'}`} />
                </button>

                <div className="mgmt-topbar__divider" />

                {/* User avatar */}
                <div
                  className="mgmt-user-avatar"
                  title={user?.email}
                  style={{ width: 34, height: 34, fontSize: 14, cursor: 'default' }}
                >
                  <i className="fa-solid fa-user" />
                </div>

                {/* Logout */}
                <button
                  className="mgmt-btn mgmt-btn--secondary mgmt-btn--sm"
                  onClick={handleSignOut}
                  disabled={signingOut}
                  id="sign-out-btn"
                  aria-label="Sign out"
                >
                  {signingOut ? (
                    <span className="mgmt-spinner mgmt-spinner--sm" />
                  ) : (
                    <i className="fa-solid fa-arrow-right-from-bracket" />
                  )}
                  {signingOut ? 'Signing out…' : 'Sign Out'}
                </button>
              </div>
            </header>

            {/* Page content */}
            <main id="mgmt-main-content" className="mgmt-content">
              {allowedRoles && !allowedRoles.includes(user?.role) ? (
                <div style={{ padding: '2rem', textAlign: 'center', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', marginTop: '2rem' }}>
                  <i className="fa-solid fa-ban" style={{ fontSize: '3rem', color: '#dc3545', marginBottom: '1rem' }}></i>
                  <h3 style={{ margin: '0 0 1rem 0', color: '#333' }}>Access Restricted</h3>
                  <p style={{ margin: 0, color: '#666' }}>You do not have permission to view this page.</p>
                </div>
              ) : (
                children
              )}
            </main>
          </div>

          {/* Inline responsive sidebar styles */}
          <style>{`
            @media (max-width: 1024px) {
              #sidebar-toggle { display: flex !important; }
              #sidebar-backdrop { display: block !important; }
              .desktop-only { display: none !important; }
            }
          `}</style>
        </>
      );
    }}
    </AuthGuard>
  );
}
