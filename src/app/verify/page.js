import { Suspense } from 'react';
import VerificationClient from '@/components/VerificationClient';

export const metadata = {
  title: 'Verify Prescription | Dr. Bharat Baishya',
  description: 'Verify the authenticity of digital prescriptions issued by Dr. Bharat Baishya.',
};

export default function VerifyPage() {
  return (
    <main className="min-h-screen bg-slate-900 flex flex-col justify-center">
      <Suspense fallback={<div className="p-8 text-center text-white">Loading verification system...</div>}>
        <VerificationClient />
      </Suspense>
    </main>
  );
}
