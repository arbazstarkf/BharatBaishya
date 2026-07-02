import ManagementThemeProvider from '@/components/management/ManagementThemeProvider';
import ManagementShell from '@/components/management/ManagementShell';
import PrescriptionForm from '@/components/management/PrescriptionForm';

export const metadata = {
  title: 'Prescriptions | Management',
  robots: { index: false, follow: false },
};

export default function PrescriptionsPage() {
  return (
    <ManagementThemeProvider>
      <ManagementShell pageTitle="Create Prescription" pageLabel="Clinical Tool">


        <PrescriptionForm />
      </ManagementShell>
    </ManagementThemeProvider>
  );
}
