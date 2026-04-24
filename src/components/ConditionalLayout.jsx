'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

/**
 * Renders public Navbar + Footer only for non-management routes.
 * Management pages get a completely clean layout shell.
 */
export default function ConditionalLayout({ children }) {
  const pathname = usePathname();
  const isManagement = pathname?.startsWith('/management');

  if (isManagement) {
    // Management panel handles its own layout — no public chrome
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <main id="main-content">{children}</main>
      <Footer />
    </>
  );
}
