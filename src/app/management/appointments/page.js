import ManagementThemeProvider from '@/components/management/ManagementThemeProvider';
import ManagementShell from '@/components/management/ManagementShell';
import AppointmentsClient from '@/components/management/AppointmentsClient';

export const metadata = {
  title: 'Appointments | Management',
  robots: { index: false, follow: false },
};

export default function AppointmentsPage() {
  return (
    <ManagementThemeProvider>
      <ManagementShell pageTitle="Appointments Management" pageLabel="Clinical Operations">
        <AppointmentsClient />
      </ManagementShell>
    </ManagementThemeProvider>
  );
}
