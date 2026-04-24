import { Suspense } from 'react';
import VerificationClient from '@/components/VerificationClient';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Verify Prescription | Dr. Bharat Baishya',
  description: 'Verify the authenticity of digital prescriptions issued by Dr. Bharat Baishya.',
};

export default function VerifyPage() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navbar />
      <div className="pt-24 pb-12 px-4">
        <Suspense fallback={<div className="max-w-2xl mx-auto p-8 text-center">Loading verification system...</div>}>
          <VerificationClient />
        </Suspense>
      </div>
      <Footer />
    </main>
  );
}
