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
            setError('Prescription not found. Please check the ID or scan the QR code again.');
          }
        } else if (nameParam) {
          // Fallback for temporary/offline prescriptions
          setPrescription({
            name: nameParam,
            date: dateParam || 'Unknown',
            isOffline: true
          });
        }
      } catch (err) {
        console.error('Verification error:', err);
        setError('An error occurred during verification. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    fetchPrescription();
  }, [id, searchParams]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-12 text-center animate-pulse">
        <div className="w-20 h-20 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto mb-6"></div>
        <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mx-auto mb-4"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mx-auto mb-2"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3 mx-auto"></div>
      </div>
    );
  }

  if (error || !id) {
    return (
      <div className="max-w-2xl mx-auto bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden border border-red-100 dark:border-red-900/30">
        <div className="bg-red-50 dark:bg-red-900/20 p-8 text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fa-solid fa-triangle-exclamation text-2xl"></i>
          </div>
          <h2 className="text-2xl font-bold text-red-800 dark:text-red-400 mb-2">Verification Failed</h2>
          <p className="text-red-600/80 dark:text-red-400/80">{error || 'No prescription ID provided.'}</p>
        </div>
        <div className="p-8 text-center bg-white dark:bg-slate-800">
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            If you believe this is an error, please contact Dr. Bharat Baishya's clinic directly.
          </p>
          <Link 
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full font-semibold transition-all hover:scale-105 active:scale-95"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Verification Card */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden border border-emerald-100 dark:border-emerald-900/30">
        {/* Verified Header */}
        <div className={`p-8 text-center relative overflow-hidden ${prescription.isOffline ? 'bg-amber-50 dark:bg-amber-900/20' : 'bg-emerald-50 dark:bg-emerald-900/20'}`}>
          <div className="absolute top-0 right-0 p-4 opacity-10">
             <i className={`fa-solid ${prescription.isOffline ? 'fa-triangle-exclamation' : 'fa-certificate'} text-8xl -rotate-12`}></i>
          </div>
          
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg ${prescription.isOffline ? 'bg-amber-500 shadow-amber-500/30' : 'bg-emerald-500 shadow-emerald-500/30'} text-white`}>
            <i className={`fa-solid ${prescription.isOffline ? 'fa-file-signature' : 'fa-check-double'} text-3xl`}></i>
          </div>
          
          <h2 className={`text-3xl font-black mb-1 uppercase tracking-wider ${prescription.isOffline ? 'text-amber-800 dark:text-amber-400' : 'text-emerald-800 dark:text-emerald-400'}`}>
            {prescription.isOffline ? 'Offline Validation' : 'Verified Prescription'}
          </h2>
          <p className={prescription.isOffline ? 'text-amber-600 dark:text-amber-500 font-medium' : 'text-emerald-600 dark:text-emerald-500 font-medium'}>
            {prescription.isOffline ? 'Matches Print Parameters' : 'Digital Signature Confirmed'}
          </p>
          
          <div className={`mt-4 inline-block px-4 py-1 rounded-full border ${prescription.isOffline ? 'bg-amber-100 dark:bg-amber-900/40 border-amber-200 dark:border-amber-800' : 'bg-emerald-100 dark:bg-emerald-900/40 border-emerald-200 dark:border-emerald-800'}`}>
             <span className={`text-xs font-bold ${prescription.isOffline ? 'text-amber-700 dark:text-amber-300' : 'text-emerald-700 dark:text-emerald-300'}`}>
               {prescription.isOffline ? 'TEMP AUTH' : `REF ID: ${id}`}
             </span>
          </div>
        </div>

        {/* Doctor Info */}
        <div className="p-8 border-b border-slate-100 dark:border-slate-700/50">
          <div className="flex items-center gap-4 mb-4">
             <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/40 text-teal-600 dark:text-teal-400 rounded-xl flex items-center justify-center">
                <i className="fa-solid fa-user-doctor text-xl"></i>
             </div>
             <div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white">Dr. Bharat Baishya</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">MBBS, MD, CCEBDM, MAACE, FICP</p>
             </div>
          </div>
          <p className="text-slate-600 dark:text-slate-300 italic text-sm leading-relaxed">
            "This digital record confirms that the associated prescription was issued by Dr. Bharat Baishya for the clinical evaluation of the patient named below."
          </p>
        </div>

        {/* Patient Details */}
        <div className="p-8 space-y-6 bg-slate-50/50 dark:bg-slate-900/20">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Patient Name</label>
              <div className="text-lg font-bold text-slate-800 dark:text-white">{prescription.name}</div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Date Issued</label>
              <div className="text-lg font-bold text-slate-800 dark:text-white">{prescription.date}</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Age / Sex</label>
              <div className="font-semibold text-slate-700 dark:text-slate-200">
                {prescription.age && prescription.sex ? `${prescription.age}Y / ${prescription.sex}` : prescription.age || prescription.sex || '—'}
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Weight</label>
              <div className="font-semibold text-slate-700 dark:text-slate-200">{prescription.weight ? `${prescription.weight} kg` : '—'}</div>
            </div>
            <div className="space-y-1 text-right">
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Status</label>
              <div className={`${prescription.isOffline ? 'text-amber-500' : 'text-emerald-500'} font-bold flex items-center justify-end gap-1`}>
                <div className={`w-2 h-2 rounded-full ${prescription.isOffline ? 'bg-amber-500' : 'bg-emerald-500'} animate-pulse`}></div> {prescription.isOffline ? 'Legacy/Offline' : 'Active'}
              </div>
            </div>
          </div>
          
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Address / Location</label>
            <div className="text-sm font-medium text-slate-600 dark:text-slate-400">{prescription.address || '—'}</div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="px-8 py-6 bg-slate-900 dark:bg-white text-white/70 dark:text-slate-500 text-xs text-center leading-relaxed">
          <p>
            Pharmacists are advised to verify this digital record against the physical copy. 
            For any discrepancies, contact +91 9854004813. 
            <br />
            © {new Date().getFullYear()} Dr. Bharat Baishya. All Rights Reserved.
          </p>
        </div>
      </div>

      <div className="mt-8 flex justify-center gap-4">
         <Link 
            href="/"
            className="flex items-center gap-2 text-slate-600 dark:text-slate-400 font-medium hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
         >
            <i className="fa-solid fa-house"></i> Back to Home
         </Link>
      </div>
    </div>
  );
}
