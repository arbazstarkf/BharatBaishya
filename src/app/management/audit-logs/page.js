import ManagementThemeProvider from '@/components/management/ManagementThemeProvider';
import ManagementShell from '@/components/management/ManagementShell';
import AuditLogsClient from '@/components/management/AuditLogsClient';
import RoleGuard from '@/components/management/RoleGuard';

export const metadata = {
  title: 'Audit Logs | Management',
  robots: { index: false, follow: false },
};

export default function AuditLogsPage() {
  return (
    <ManagementThemeProvider>
      <ManagementShell pageTitle="Audit Logs" pageLabel="System Records">
        <RoleGuard allowedRoles={['admin']}>
          <AuditLogsClient />
        </RoleGuard>
      </ManagementShell>
    </ManagementThemeProvider>
  );
}
