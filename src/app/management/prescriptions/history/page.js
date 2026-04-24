import ManagementThemeProvider from '@/components/management/ManagementThemeProvider';
import ManagementShell from '@/components/management/ManagementShell';
import PrescriptionHistoryClient from '@/components/management/PrescriptionHistoryClient';

export const metadata = {
  title: 'Prescription History | Management',
  robots: { index: false, follow: false },
};

export default function PrescriptionHistoryPage() {
  return (
    <ManagementThemeProvider>
      <ManagementShell pageTitle="Prescription Archive" pageLabel="Clinical Records">
        <PrescriptionHistoryClient />
      </ManagementShell>
    </ManagementThemeProvider>
  );
}
