'use client';

import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy, deleteDoc, doc, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import PrescriptionPrintTemplate from './PrescriptionPrintTemplate';
import Link from 'next/link';

export default function PrescriptionHistoryClient() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedForPrint, setSelectedForPrint] = useState(null);
  const [isPrinting, setIsPrinting] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'prescriptions'), 
      orderBy('createdAt', 'desc'),
      limit(itemsPerPage)
    );
    
    setLoading(true);
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setPrescriptions(docs);
      setLoading(false);
      if (snapshot.docs.length < itemsPerPage) setHasMore(false);
    });
    return () => unsubscribe();
  }, [itemsPerPage]);

  const loadMore = () => {
    setItemsPerPage(prev => prev + 15);
    setHasMore(true);
  };

  const handlePrint = (rx) => {
    setSelectedForPrint(rx);
    setIsPrinting(true);
    // Give state time to update the template before printing
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 500);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this clinical record? This action cannot be undone.')) return;
    try {
      await deleteDoc(doc(db, 'prescriptions', id));
    } catch (err) {
      alert('Error deleting record.');
      console.error(err);
    }
  };

  const filtered = prescriptions.filter(rx => 
    rx.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rx.guardianName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rx.phone?.includes(searchTerm) ||
    rx.id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mgmt-history-container">
      <div className="mgmt-page-header no-print">
        <div></div>
        <Link href="/management/prescriptions" className="mgmt-btn mgmt-btn--primary">
           <i className="fa-solid fa-plus"></i> New Prescription
        </Link>
      </div>

      <div className="mgmt-card no-print">
        <div className="mgmt-card__header">
          <div className="mgmt-filter-bar__search" style={{ flex: 1 }}>
            <i className="fa-solid fa-magnifying-glass mgmt-search-icon"></i>
            <input 
              type="text" 
              className="mgmt-input" 
              placeholder="Search by patient name or ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="mgmt-table-wrapper">
          <table className="mgmt-table">
            <thead>
              <tr>
                <th>Patient Name</th>
                <th>Date</th>
                <th>Prescription ID</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="text-center p-48">
                    <div className="mgmt-spinner mx-auto"></div>
                  </td>
                </tr>
              ) : filtered.length > 0 ? (
                filtered.map((rx) => (
                  <tr key={rx.id}>
                    <td>
                      <div className="mgmt-table__name">
                        {rx.name}
                        {rx.isEdited && <span className="edited-badge-small ml-2">Edited</span>}
                      </div>
                      <div className="text-xs text-slate-400">
                        {rx.age}Y • {rx.sex}
                        {rx.guardianName && ` • G: ${rx.guardianName}`}
                        {rx.phone && ` • P: ${rx.phone}`}
                      </div>
                    </td>
                    <td>{rx.date}</td>
                    <td><code className="text-xs text-teal-600 font-mono bg-teal-50 px-2 py-1 rounded">{rx.id.substring(0, 8)}</code></td>
                    <td>
                      <div className="flex gap-2">
                        <button 
                          className="mgmt-icon-btn" 
                          onClick={() => handlePrint(rx)}
                          title="Reprint Prescription"
                          style={{ color: 'var(--mgmt-accent)' }}
                        >
                          <i className="fa-solid fa-print"></i>
                        </button>
                        <button 
                          className="mgmt-icon-btn" 
                          onClick={() => handleDelete(rx.id)}
                          title="Delete Record"
                          style={{ color: 'var(--mgmt-cancelled-text)' }}
                        >
                          <i className="fa-solid fa-trash-can"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center p-48 text-slate-400">
                    No records found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {hasMore && filtered.length > 0 && !searchTerm && (
          <div className="p-16 flex justify-center border-t border-slate-100">
            <button 
              onClick={loadMore} 
              className="mgmt-btn mgmt-btn--secondary mgmt-btn--sm"
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Load More Records'}
            </button>
          </div>
        )}
      </div>

      {/* Hidden print template */}
      {selectedForPrint && (
        <div className={isPrinting ? 'print-only' : 'hidden'}>
          <PrescriptionPrintTemplate data={selectedForPrint} prescriptionId={selectedForPrint.id} />
        </div>
      )}

      <style>{`
        .hidden { display: none !important; }
        .edited-badge-small {
          font-size: 9px; font-weight: 700; background: #fffbeb; color: #b45309;
          padding: 2px 6px; border-radius: 4px; border: 1px solid #fde68a;
          text-transform: uppercase; letter-spacing: 0.02em;
        }
        @media print {
            .no-print { display: none !important; }
            .print-only { display: block !important; }
        }
      `}</style>
    </div>
  );
}
