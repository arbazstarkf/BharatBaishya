import ManagementThemeProvider from '@/components/management/ManagementThemeProvider';
import ManagementShell from '@/components/management/ManagementShell';
import PatientsClient from '@/components/management/PatientsClient';

export const metadata = {
  title: 'Patient Directory | Management',
  robots: { index: false, follow: false },
};

export default function PatientsPage() {
  return (
    <ManagementThemeProvider>
      <ManagementShell pageTitle="Patient Master Directory" pageLabel="Administration">
        <PatientsClient />
      </ManagementShell>
    </ManagementThemeProvider>
  );
}
