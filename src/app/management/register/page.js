import ManagementThemeProvider from '@/components/management/ManagementThemeProvider';
import ManagementShell from '@/components/management/ManagementShell';
import PatientRegisterClient from '@/components/management/PatientRegisterClient';

export const metadata = {
  title: 'Patient Register | Management',
  robots: { index: false, follow: false },
};

export default function PatientRegisterPage() {
  return (
    <ManagementThemeProvider>
      <ManagementShell pageTitle="Patient Register" pageLabel="Daily Ledger" allowedRoles={['admin']}>
        <PatientRegisterClient />
      </ManagementShell>
    </ManagementThemeProvider>
  );
}
