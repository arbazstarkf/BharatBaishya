import './management.css';
import './dashboard-redesign.css';

export const metadata = {
  title: {
    default: 'Management Panel',
    template: '%s | Management',
  },
  robots: { index: false, follow: false },
};

/**
 * Nested layout for all /management/* routes.
 * - Imports the management design system CSS.
 * - Does NOT include html/body — those come from the root layout.
 * - No public Navbar/Footer — ConditionalLayout in root handles that.
 * - ManagementThemeProvider is applied per-page inside client components
 *   so theme state is isolated from the public site.
 */
export default function ManagementLayout({ children }) {
  return <>{children}</>;
}
