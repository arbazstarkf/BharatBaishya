'use client';

import { useState, useEffect, useMemo } from 'react';
import { collection, onSnapshot, query, orderBy, limit, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import PrescriptionPrintTemplate from './PrescriptionPrintTemplate';

export default function PatientsClient() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [clinicalNotes, setClinicalNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activePatient, setActivePatient] = useState(null);
  const [isPrinting, setIsPrinting] = useState(false);
  const [selectedForPrint, setSelectedForPrint] = useState(null);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [hasMore, setHasMore] = useState(true);
  
  // Note Form State
  const [noteText, setNoteText] = useState('');
  const [isSavingNote, setIsSavingNote] = useState(false);

  useEffect(() => {
    const qP = query(collection(db, 'prescriptions'), orderBy('createdAt', 'desc'), limit(itemsPerPage));
    const qN = query(collection(db, 'clinical_notes'), orderBy('createdAt', 'desc'));
    
    setLoading(true);
    const unsubP = onSnapshot(qP, snap => {
      setPrescriptions(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    const unsubN = onSnapshot(qN, snap => {
      setClinicalNotes(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    
    setTimeout(() => setLoading(false), 600);
    return () => { unsubP(); unsubN(); };
  }, [itemsPerPage]);

  const loadMore = () => {
    setItemsPerPage(prev => prev + 10);
    setHasMore(true);
  };

  const handleReprint = (rx) => {
    setSelectedForPrint(rx);
    setIsPrinting(true);
    setTimeout(() => { window.print(); setIsPrinting(false); }, 500);
  };

  const handleSaveNote = async () => {
    if (!noteText.trim() || !activePatient) return;
    setIsSavingNote(true);
    try {
      await addDoc(collection(db, 'clinical_notes'), {
        patientName: activePatient.name,
        note: noteText,
        date: new Date().toISOString().split('T')[0],
        createdAt: serverTimestamp(),
      });
      setNoteText('');
      alert('Clinical note saved to patient record.');
    } catch (err) {
      console.error(err);
      alert('Failed to save note.');
    } finally {
      setIsSavingNote(false);
    }
  };

  // Aggregate patients by name
  const patients = useMemo(() => {
    const map = new Map();
    
    const getPatient = (name, data) => {
      const k = name?.toLowerCase().trim();
      if (!k) return null;
      if (!map.has(k)) {
        map.set(k, { 
          name: name, 
          phone: data.phone || '—', 
          email: data.email || '—', 
          address: data.address || '', 
          guardianName: data.guardianName || '',
          entries: [] 
        });
      }
      return map.get(k);
    };

    prescriptions.forEach(r => {
      const p = getPatient(r.name, r);
      if (p) {
        p.entries.push({...r, type: 'RX'});
        if (!p.address && r.address) p.address = r.address;
        if (!p.guardianName && r.guardianName) p.guardianName = r.guardianName;
        if (!p.clinicalNote && r.clinicalNote) p.clinicalNote = r.clinicalNote;
        if (p.phone === '—' && r.phone) p.phone = r.phone;
      }
    });

    clinicalNotes.forEach(n => {
      const p = getPatient(n.patientName, {});
      if (p) {
        p.entries.push({...n, type: 'NOTE'});
      }
    });

    return Array.from(map.values()).map(p => {
      p.entries.sort((a,b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0) || b.date.localeCompare(a.date));
      p.lastSeen = p.entries[0]?.date;
      return p;
    }).sort((a,b) => b.lastSeen?.localeCompare(a.lastSeen || ''));
  }, [prescriptions, clinicalNotes]);

  const filtered = patients.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.phone.includes(searchTerm) || 
    p.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.guardianName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTime = (ts) => ts?.toDate ? ts.toDate().toLocaleString() : new Date(ts).toLocaleString();

  return (
    <div className="mgmt-clinical-hub-v2">
      {/* 1. Search Box Component - Inlined to fix focus issue */}
      <div className={`mgmt-search-v2 ${activePatient ? 'minimized' : ''}`}>
         <div className="search-box">
            <i className="fa-solid fa-magnifying-glass"></i>
            <input 
              type="text" 
              placeholder="Search clinical archives by name, phone, or address..." 
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setActivePatient(null); }}
            />
         </div>
      </div>
      
      {!activePatient ? (
        /* 2. Patient Result Cards - Inlined */
        <div className="mgmt-results-v2">
           {filtered.map(p => (
             <div key={p.name} className="patient-summary-card" onClick={() => setActivePatient(p)}>
                <div className="patient-avatar">{p.name[0]}</div>
                <div className="patient-info">
                   <h3>{p.name}</h3>
                   <p><i className="fa-solid fa-location-dot"></i> {p.address || 'No address recorded'}</p>
                </div>
                <div className="patient-stats">
                   <div className="stat-pill">{p.entries.length} Records</div>
                   <div className="stat-date">{p.lastSeen}</div>
                </div>
                <i className="fa-solid fa-chevron-right arrow"></i>
             </div>
           ))}
           {filtered.length === 0 && !loading && <div className="no-results">No patient matching your search.</div>}
           
           {hasMore && filtered.length > 0 && (
             <div className="pagination-area">
                <button onClick={loadMore} className="load-more-btn" disabled={loading}>
                   {loading ? 'Loading...' : 'Load More Records'}
                </button>
             </div>
           )}
        </div>
      ) : (
        /* 3. FULL PATIENT FILE VIEW - Inlined */
        <div className="mgmt-patient-file">
           <button className="back-btn" onClick={() => setActivePatient(null)}>
              <i className="fa-solid fa-arrow-left"></i> Back to Archive
           </button>
           
           <header className="file-header">
              <div className="file-avatar">{activePatient.name[0]}</div>
              <div className="file-bio">
                 <h1>{activePatient.name}</h1>
                 {activePatient.guardianName && <div style={{ fontSize: '14px', color: 'var(--mgmt-accent)', fontWeight: 600, marginBottom: '8px' }}>G: {activePatient.guardianName}</div>}
                 <div className="meta">
                    <span><i className="fa-solid fa-phone"></i> {activePatient.phone}</span>
                    <span><i className="fa-solid fa-location-dot"></i> {activePatient.address || 'N/A'}</span>
                    <span><i className="fa-solid fa-id-badge"></i> REG-{activePatient.name.length}42</span>
                 </div>
              </div>
              <div className="file-quick-stats">
                 <div className="qs-item"><strong>{activePatient.entries.filter(e => e.type === 'RX').length}</strong><span>Prescriptions</span></div>
                 <div className="qs-item"><strong>{activePatient.entries.filter(e => e.type === 'NOTE').length}</strong><span>Clinical Notes</span></div>
              </div>
           </header>

           <div className="file-content">
              <div className="timeline-v2">
                 {/* Add Note Section */}
                 <div className="mgmt-card add-note-card">
                    <div className="section-label" style={{ marginBottom: '10px' }}>Add Clinical Note (Diagnosis / History)</div>
                    <textarea 
                      className="mgmt-input" 
                      rows="3" 
                      placeholder="Enter diagnosis, medical history, or clinical observations for this patient..."
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                    ></textarea>
                    <button 
                      className="save-note-btn" 
                      onClick={handleSaveNote}
                      disabled={isSavingNote || !noteText.trim()}
                    >
                      {isSavingNote ? 'Saving...' : <><i className="fa-solid fa-save"></i> Save to Records</>}
                    </button>
                  </div>

                  <div className="section-label">Medical Records History</div>
                 {activePatient.entries.map((item, idx) => (
                   <div key={idx} className={`timeline-card ${item.type}`}>
                      <div className="type-icon">
                         <i className={
                            item.type === 'RX' ? 'fa-solid fa-prescription-bottle-medical' : 
                            'fa-solid fa-clipboard-user'
                         }></i>
                      </div>
                      <div className="card-body">
                         <header>
                            <div className="type-label">
                               {item.type === 'RX' ? 'Digital Prescription' : 
                                'Clinical Note'}
                            </div>
                            <div className="date">{item.date} {item.time ? `• ${item.time}` : ''}</div>
                         </header>
                         
                         <div className="data-content">
                            {item.type === 'RX' && (
                              <div className="rx-details">
                                 <div style={{ display: 'flex', gap: '15px', marginBottom: '8px' }}>
                                    {item.guardianName && <div style={{ fontSize: '12px', color: 'var(--mgmt-accent)', fontWeight: 600 }}>Guardian: {item.guardianName}</div>}
                                    {item.phone && <div style={{ fontSize: '12px', color: 'var(--mgmt-text-secondary)', fontWeight: 600 }}><i className="fa-solid fa-phone" style={{ fontSize: '10px', marginRight: '4px' }}></i> {item.phone}</div>}
                                 </div>
                                 <div className="diagnosis">Clinical Note: <strong>{item.clinicalNote || item.diagnosis}</strong></div>
                                 <div className="meds">
                                    {item.medications?.map((m, i) => <span key={i} className="med-tag">{m.name} ({m.dosage})</span>)}
                                 </div>
                                 {item.advice && <div className="advice">"{item.advice}"</div>}
                              </div>
                            )}
                            {item.type === 'NOTE' && (
                               <div className="note-details">
                                  <div className="note-text" style={{ fontSize: '14px', color: 'var(--mgmt-text)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                                     {item.note}
                                  </div>
                               </div>
                            )}
                            <footer className="item-footer">
                               Saved: {formatTime(item.createdAt)} • Ref: {item.id?.substring(0,8)}
                            </footer>
                         </div>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      )}

      {selectedForPrint && (
        <div className={isPrinting ? 'print-only' : 'hidden'}>
          <PrescriptionPrintTemplate data={selectedForPrint} prescriptionId={selectedForPrint.id} />
        </div>
      )}

      <style>{`
        .mgmt-clinical-hub-v2 { max-width: 1200px; margin: 0 auto; min-height: 80vh; }
        .hidden { display: none !important; }
        @media print { .no-print { display: none !important; } .print-only { display: block !important; } }

        /* Search Section */
        .mgmt-search-v2 { margin-bottom: 20px; transition: all 0.4s ease; padding: 10px 0; }
        .mgmt-search-v2.minimized { margin-bottom: 10px; padding: 0; opacity: 0.5; transform: scale(0.9); pointer-events: none; }
        .search-box { 
          background: var(--mgmt-surface); border-radius: 12px; padding: 10px 20px; 
          display: flex; align-items: center; gap: 15px; 
          box-shadow: var(--mgmt-shadow-xs); border: 1px solid var(--mgmt-border);
        }
        .search-box i { font-size: 16px; color: var(--mgmt-accent); }
        .search-box input { border: none; outline: none; background: transparent; flex: 1; font-size: 14px; font-weight: 500; color: var(--mgmt-text); }
        .search-box input::placeholder { color: var(--mgmt-text-muted); }

        /* Results Grid */
        .mgmt-results-v2 { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 12px; }
        .patient-summary-card { 
          background: var(--mgmt-surface); border-radius: 12px; padding: 12px 16px; display: flex; align-items: center; gap: 12px;
          cursor: pointer; transition: all 0.2s ease; border: 1px solid var(--mgmt-border); box-shadow: var(--mgmt-shadow-xs);
        }
        .patient-summary-card:hover { transform: translateY(-2px); border-color: var(--mgmt-accent); box-shadow: var(--mgmt-shadow-sm); }
        .patient-avatar { 
           width: 40px; height: 40px; border-radius: 10px; background: var(--mgmt-accent-light); 
           color: var(--mgmt-accent); display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 800;
        }
        .patient-info h3 { font-size: 14px; color: var(--mgmt-text); margin-bottom: 2px; }
        .patient-info p { font-size: 12px; color: var(--mgmt-text-secondary); }
        .patient-stats { margin-left: auto; text-align: right; }
        .stat-pill { font-size: 9px; font-weight: 800; text-transform: uppercase; color: var(--mgmt-accent); background: var(--mgmt-accent-light); padding: 2px 8px; border-radius: 99px; }
        .stat-date { font-size: 10px; color: var(--mgmt-text-muted); margin-top: 3px; }
        .no-results { grid-column: 1/-1; text-align: center; padding: 40px; color: var(--mgmt-text-muted); font-size: 15px; }

        /* Patient File View */
        .back-btn { margin-bottom: 20px; font-weight: 700; font-size: 13px; color: var(--mgmt-text-muted); transition: color 0.2s; cursor: pointer; border:none; background:none; }
        .back-btn:hover { color: var(--mgmt-accent); }
        
        .file-header { 
          display: flex; align-items: center; gap: 20px; margin-bottom: 25px; 
          background: var(--mgmt-surface); padding: 20px 30px; border-radius: 16px; box-shadow: var(--mgmt-shadow-xs); border: 1px solid var(--mgmt-border);
        }
        .file-avatar { width: 60px; height: 60px; border-radius: 16px; background: var(--mgmt-sidebar-logo-bg); color: white; display:flex; align-items:center; justify-content:center; font-size: 24px; font-weight: 900; }
        .file-bio h1 { font-size: 22px; color: var(--mgmt-text); margin-bottom: 6px; letter-spacing: -0.02em; }
        .file-bio .meta { display: flex; gap: 15px; font-size: 12px; color: var(--mgmt-text-secondary); }
        .file-bio i { margin-right: 4px; }

        .file-quick-stats { margin-left: auto; display: flex; gap: 25px; }
        .qs-item { text-align: center; }
        .qs-item strong { display: block; font-size: 20px; color: var(--mgmt-accent); }
        .qs-item span { font-size: 10px; font-weight: 700; text-transform: uppercase; color: var(--mgmt-text-muted); letter-spacing: 0.05em; }

        .timeline-v2 { max-width: 800px; margin: 0 auto; }
        .section-label { font-size: 11px; font-weight: 800; text-transform: uppercase; color: var(--mgmt-text-muted); letter-spacing: 0.1em; margin-bottom: 20px; display: block; }
        
        .add-note-card { margin-bottom: 30px; padding: 20px; border-radius: 16px; border: 1px dashed var(--mgmt-accent); background: var(--mgmt-surface-2); }
        
        .save-note-btn { 
          margin-top: 12px; 
          background: #0d9488 !important; 
          color: #ffffff !important; 
          border: none; 
          padding: 12px 24px; 
          border-radius: 10px; 
          font-weight: 700; 
          font-size: 14px; 
          cursor: pointer; 
          transition: 0.2s; 
          display: inline-flex; 
          align-items: center; 
          gap: 8px;
          box-shadow: 0 4px 12px rgba(13, 148, 136, 0.3);
          z-index: 10;
        }
        .save-note-btn:hover:not(:disabled) { 
          background: #0f766e !important; 
          transform: translateY(-2px); 
          box-shadow: 0 6px 16px rgba(13, 148, 136, 0.4); 
        }
        .save-note-btn:disabled { 
          background: #94a3b8 !important; 
          color: #f1f5f9 !important;
          cursor: not-allowed; 
          box-shadow: none;
          opacity: 0.7;
        }

        .timeline-card { background: var(--mgmt-surface); border-radius: 16px; padding: 18px 22px; margin-bottom: 15px; display: flex; gap: 15px; position: relative; border: 1px solid var(--mgmt-border); }
        .timeline-card::after { content: ''; position: absolute; left: 30px; top: 100%; height: 15px; width: 2px; background: var(--mgmt-border); }
        .timeline-card:last-child::after { display: none; }
        
        .type-icon { 
           width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; 
           font-size: 10px; color: white; flex-shrink: 0; margin-top: 3px;
        }
        .APT .type-icon { background: #3b82f6; box-shadow: 0 2px 6px rgba(59, 130, 246, 0.2); }
        .RX .type-icon { background: #10b981; box-shadow: 0 2px 6px rgba(16, 185, 129, 0.2); }
        .NOTE .type-icon { background: #8b5cf6; box-shadow: 0 2px 6px rgba(139, 92, 246, 0.2); }

        .card-body { flex: 1; min-width: 0; }
        .card-body header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; }
        .type-label { font-weight: 800; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: var(--mgmt-text); }
        .date { font-size: 11px; color: var(--mgmt-text-muted); font-weight: 500; }
        
        .reason { font-size: 15px; color: var(--mgmt-text); font-weight: 700; margin-bottom: 4px; }
        .diagnosis { font-size: 14px; color: var(--mgmt-text); line-height: 1.4; margin-bottom: 12px; }
        .med-tag { display: inline-block; background: var(--mgmt-confirmed-bg); color: var(--mgmt-confirmed-text); padding: 2px 8px; border-radius: 6px; font-size: 11px; font-weight: 700; margin: 0 6px 6px 0; }
        .advice { font-style: italic; color: var(--mgmt-text-secondary); font-size: 13px; background: var(--mgmt-surface-2); padding: 10px 15px; border-radius: 8px; border-left: 3px solid var(--mgmt-accent); margin-top: 10px; }
        
        .item-footer { margin-top: 15px; padding-top: 10px; border-top: 1px solid var(--mgmt-border-2); font-size: 9px; color: var(--mgmt-text-muted); text-transform: uppercase; letter-spacing: 0.05em; }

        .pagination-area { display: flex; justify-content: center; margin-top: 30px; margin-bottom: 20px; }
        .load-more-btn { 
          padding: 10px 24px; border-radius: 12px; background: var(--mgmt-surface); border: 1px solid var(--mgmt-accent); 
          color: var(--mgmt-accent); font-weight: 700; font-size: 14px; cursor: pointer; transition: all 0.2s;
        }
        .load-more-btn:hover { background: var(--mgmt-accent); color: white; box-shadow: var(--mgmt-shadow-sm); }
        .load-more-btn:disabled { opacity: 0.5; cursor: not-allowed; }
      `}</style>
    </div>
  );
}
