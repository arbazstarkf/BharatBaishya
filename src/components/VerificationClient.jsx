'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';

export default function VerificationClient() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [loading, setLoading] = useState(true);
  const [prescription, setPrescription] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPrescription() {
      const nameParam = searchParams.get('name');
      const dateParam = searchParams.get('date');

      if (!id && !nameParam) {
        setLoading(false);
        return;
      }

      try {
        if (id) {
          const docRef = doc(db, 'prescriptions', id);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setPrescription(docSnap.data());
          } else {
            setError('Not Found');
          }
        } else if (nameParam) {
          setPrescription({
            name: nameParam,
            date: dateParam || 'Unknown'
          });
        }
      } catch (err) {
        setError('Error');
      } finally {
        setLoading(false);
      }
    }

    fetchPrescription();
  }, [id, searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-slate-900 flex flex-col items-center justify-center text-center p-4">
        <h1 className="text-sm font-bold text-white uppercase tracking-widest animate-pulse">Verifying...</h1>
      </div>
    );
  }

  if (error || !id) {
    return (
      <div className="min-h-screen w-full bg-red-600 flex flex-col items-center justify-center text-center p-4 py-12">
        <div className="text-white mb-4 drop-shadow-md">
          <i className="fa-solid fa-circle-xmark text-4xl"></i>
        </div>
        <h1 className="text-3xl font-black text-white tracking-tighter mb-2 leading-none">INVALID</h1>
        <p className="text-sm font-bold text-red-200 mt-1">Record Not Found</p>
        
        <div className="mt-12 w-full text-center">
          <Link href="/" className="inline-flex items-center gap-1.5 text-white hover:text-red-200 font-bold underline text-xs transition-colors">
            <i className="fa-solid fa-arrow-left"></i> Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-emerald-500 flex flex-col items-center justify-center text-center p-4 py-12 z-50">
      <div className="text-white mb-4 drop-shadow-md">
        <i className="fa-solid fa-circle-check text-4xl"></i>
      </div>
      
      <h1 className="text-3xl font-black text-white tracking-tighter mb-6 leading-none drop-shadow-sm">
        VERIFIED
      </h1>
      
      <div className="bg-emerald-600/50 p-6 rounded-2xl min-w-[240px] max-w-[320px] border border-emerald-400/30">
        <p className="text-[10px] font-bold text-emerald-200 uppercase tracking-widest mb-1.5">Patient</p>
        <p className="text-base font-black text-white mb-6 tracking-tight leading-snug break-words">{prescription.name}</p>
        
        <p className="text-[10px] font-bold text-emerald-200 uppercase tracking-widest mb-1.5">Date</p>
        <p className="text-sm font-black text-white tracking-tight leading-snug">{prescription.date}</p>
      </div>

      <div className="mt-12 w-full text-center">
        <Link href="/" className="inline-flex items-center gap-1.5 text-white hover:text-emerald-200 font-bold underline text-xs transition-colors drop-shadow-sm">
          <i className="fa-solid fa-arrow-left"></i> Return to Homepage
        </Link>
      </div>
    </div>
  );
}
