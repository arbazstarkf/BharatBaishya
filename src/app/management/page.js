import ManagementThemeProvider from '@/components/management/ManagementThemeProvider';
import ManagementShell from '@/components/management/ManagementShell';
import DashboardClient from '@/components/management/DashboardClient';

export const metadata = {
  title: 'Dashboard | Management',
  robots: { index: false, follow: false },
};

export default function ManagementPage() {
  return (
    <ManagementThemeProvider>
      <ManagementShell pageTitle="Management Overview" pageLabel="Dashboard">
        <DashboardClient />
      </ManagementShell>
    </ManagementThemeProvider>
  );
}
