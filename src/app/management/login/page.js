import ManagementThemeProvider from '@/components/management/ManagementThemeProvider';
import LoginClient from '@/components/management/LoginClient';

export const metadata = {
  title: 'Sign In | Management',
  robots: { index: false, follow: false },
};

export default function ManagementLoginPage() {
  return (
    <ManagementThemeProvider>
      <LoginClient />
    </ManagementThemeProvider>
  );
}
