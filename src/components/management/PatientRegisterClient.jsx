'use client';

import { useState, useEffect, useMemo } from 'react';
import { collection, onSnapshot, query, orderBy, limit, where, Timestamp, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import PrescriptionPrintTemplate from './PrescriptionPrintTemplate';
import { useManagementAuth } from '@/components/management/AuthGuard';
import { logAuditAction } from '@/lib/auditLogger';

export default function PatientRegisterClient() {
  const { user } = useManagementAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isViewing, setIsViewing] = useState(false);
  const [limitCount, setLimitCount] = useState(50);
  const [hasMore, setHasMore] = useState(true);
  
  const [dateFilter, setDateFilter] = useState('today'); 
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(null);
  const [saving, setSaving] = useState(false);

  const [selectedForPrint, setSelectedForPrint] = useState(null);
  const [isPrinting, setIsPrinting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    const finalLimit = debouncedSearch ? 200 : limitCount;
    let q = query(collection(db, 'prescriptions'), orderBy('createdAt', 'desc'), limit(finalLimit));

    if (!debouncedSearch && dateFilter !== 'all') {
      const now = new Date();
      let start;
      if (dateFilter === 'today') start = new Date(now.setHours(0, 0, 0, 0));
      else if (dateFilter === 'week') start = new Date(now.setDate(now.getDate() - 7));
      else if (dateFilter === 'month') start = new Date(now.setMonth(now.getMonth() - 1));
      else if (dateFilter === 'custom' && customStart) {
        start = new Date(customStart);
        start.setHours(0, 0, 0, 0);
      }

      if (start) {
        const startTimestamp = Timestamp.fromDate(start);
        if (dateFilter === 'custom' && customEnd) {
          const end = new Date(customEnd);
          end.setHours(23, 59, 59, 999);
          const endTimestamp = Timestamp.fromDate(end);
          q = query(collection(db, 'prescriptions'), 
            where('createdAt', '>=', startTimestamp),
            where('createdAt', '<=', endTimestamp),
            orderBy('createdAt', 'desc'),
            limit(finalLimit)
          );
        } else {
          q = query(collection(db, 'prescriptions'), 
            where('createdAt', '>=', startTimestamp),
            orderBy('createdAt', 'desc'),
            limit(finalLimit)
          );
        }
      }
    }

    setLoading(true);
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setRecords(docs);
      setLoading(false);
      setHasMore(snapshot.docs.length >= finalLimit);
    }, (error) => {
      console.error("Firestore Query Error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [limitCount, dateFilter, customStart, customEnd, debouncedSearch]);

  const filtered = records.filter(rx => 
    !debouncedSearch || 
    rx.name?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    rx.id?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    rx.phone?.includes(debouncedSearch) ||
    rx.address?.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  const formatTime = (createdAt) => {
    if (!createdAt) return '--:--';
    const date = createdAt.toDate ? createdAt.toDate() : new Date(createdAt);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const handleExportPDF = () => {
    if (filtered.length === 0) return;
    
    const doc = new jsPDF();
    
    // Add Header
    doc.setFontSize(20);
    doc.setTextColor(20, 184, 166); // Teal color
    doc.text("Dr. Bharat Baishya", 105, 15, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text("Patient Register Ledger", 105, 22, { align: 'center' });
    
    const filterText = debouncedSearch ? `Search results for: "${debouncedSearch}"` : `Timeline: ${dateFilter.toUpperCase()}`;
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()} | ${filterText}`, 105, 28, { align: 'center' });
    
    // Add Table
    const tableData = filtered.map(r => [
      r.id.slice(0, 8).toUpperCase(),
      r.name + (r.isEdited ? ' (Edited)' : ''),
      r.phone || 'N/A',
      r.date,
      formatTime(r.createdAt)
    ]);

    autoTable(doc, {
      startY: 35,
      head: [['ID', 'Patient Name', 'Phone', 'Date', 'Time']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [20, 184, 166] },
      styles: { fontSize: 9 },
      columnStyles: {
        0: { cellWidth: 30 },
        1: { cellWidth: 50 },
        2: { cellWidth: 40 },
        3: { cellWidth: 35 },
        4: { cellWidth: 35 }
      }
    });

    doc.save(`patient-register-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const startEditing = () => {
    setEditForm({ ...selectedRecord });
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    if (!editForm.name) return;
    setSaving(true);
    try {
      const docRef = doc(db, 'prescriptions', selectedRecord.id);
      const updateData = {
        name: editForm.name,
        age: editForm.age,
        sex: editForm.sex,
        weight: editForm.weight || '',
        phone: editForm.phone || '',
        guardianName: editForm.guardianName || '',
        address: editForm.address || '',
        clinicalNote: editForm.clinicalNote || '',
        isEdited: true,
        lastEditedAt: serverTimestamp()
      };

      // Calculate what actually changed
      const changes = {};
      ['name', 'age', 'sex', 'weight', 'phone', 'guardianName', 'address', 'clinicalNote'].forEach(key => {
        const oldVal = selectedRecord[key] || '';
        const newVal = updateData[key] || '';
        if (oldVal !== newVal) {
          changes[key] = { from: oldVal, to: newVal };
        }
      });

      await updateDoc(docRef, updateData);
      
      // Write to audit log only if something changed
      if (Object.keys(changes).length > 0) {
        await logAuditAction({
          uid: user?.uid,
          role: user?.role,
          email: user?.email,
          action: 'UPDATE_PATIENT_RECORD',
          resource: 'PRESCRIPTION',
          resourceId: selectedRecord.id,
          details: { changes }
        });
      }

      // Update local state if needed (onSnapshot should catch it, but for immediate feedback)
      setSelectedRecord({ ...selectedRecord, ...updateData });
      setIsEditing(false);
    } catch (error) {
      console.error("Update Error:", error);
      alert("Failed to update record.");
    } finally {
      setSaving(false);
    }
  };

  const handlePrint = (rx) => {
    setSelectedForPrint(rx);
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 500);
  };

  return (
    <>
      <div className="ledger-v2-container">
      {/* Header - Minimalist Action Area */}
      <div className="ledger-page-header">
        <div className="title-stats-group">
          {/* Titles removed per request */}
        </div>
        <button className="btn-export-pdf-minimal" onClick={handleExportPDF}>
          <i className="fa-solid fa-file-pdf"></i>
          <span>Export PDF</span>
        </button>
      </div>

      {/* Toolbar - Optimized Spacing */}
      <div className="ledger-filter-toolbar">
        <div className="search-box-container">
          <i className="fa-solid fa-magnifying-glass search-icon"></i>
          <input 
            type="text" 
            placeholder="Quick search by name, phone or ID..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="toolbar-actions">
          {!debouncedSearch ? (
            <div className="filter-modes-group">
              {['today', 'week', 'month', 'custom'].map(p => (
                <button 
                  key={p} 
                  className={`mode-btn ${dateFilter === p ? 'active' : ''}`} 
                  onClick={() => setDateFilter(p)}
                >
                  {p === 'week' ? '1 Week' : p === 'month' ? '1 Month' : p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>
          ) : (
            <div className="search-active-badge">
              <i className="fa-solid fa-bolt-lightning"></i>
              Searching Global Database
            </div>
          )}

          {dateFilter === 'custom' && !debouncedSearch && (
            <div className="custom-range-inputs animate-slideIn">
              <input type="date" value={customStart} onChange={e => setCustomStart(e.target.value)} />
              <span className="arrow-sep">→</span>
              <input type="date" value={customEnd} onChange={e => setCustomEnd(e.target.value)} />
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="ledger-main-view">
        {loading && records.length === 0 ? (
          <div className="ledger-feedback-state">
            <div className="spinner-loader"></div>
            <p>Syncing clinical records...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="ledger-feedback-state">
            <i className="fa-solid fa-magnifying-glass-chart text-slate-200 text-5xl mb-6"></i>
            <p className="text-xl font-bold text-slate-400">No matching visits found</p>
            <p className="text-sm text-slate-300 mt-2">Adjust your search or timeline filters</p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="table-responsive-desktop">
              <table className="ledger-data-table">
                <thead>
                  <tr>
                    <th className="col-id">Serial ID</th>
                    <th className="col-patient">Patient Information</th>
                    <th className="col-visit">Visit Summary</th>
                    <th className="col-action">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(row => (
                    <tr key={row.id} onClick={() => { setSelectedRecord(row); setIsViewing(true); }}>
                      <td className="col-id">
                        <code className="id-monofont">#{row.id.slice(0, 6).toUpperCase()}</code>
                      </td>
                      <td className="col-patient">
                        <div className="patient-meta-cell">
                          <div className="avatar-box">{row.name[0]}</div>
                          <div className="text-box">
                            <span className="full-name">
                              {row.name}
                              {row.isEdited && <span className="edited-indicator-mini">Edited</span>}
                            </span>
                            <span className="phone-num">{row.phone || 'No Phone Recorded'}</span>
                          </div>
                        </div>
                      </td>
                      <td className="col-visit">
                        <div className="visit-meta-cell">
                          <span className="visit-date-str">{row.date}</span>
                          <span className="visit-time-str">{formatTime(row.createdAt)}</span>
                        </div>
                      </td>
                      <td className="col-action">
                        <button className="btn-view-circle">
                          <i className="fa-solid fa-chevron-right"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="cards-responsive-mobile">
              {filtered.map(row => (
                <div key={row.id} className="ledger-record-card" onClick={() => { setSelectedRecord(row); setIsViewing(true); }}>
                  <div className="card-top">
                    <code className="card-id">#{row.id.slice(0, 6).toUpperCase()}</code>
                    <span className="card-time">{formatTime(row.createdAt)}</span>
                  </div>
                  <div className="card-main">
                    <div className="card-avatar">{row.name[0]}</div>
                    <div className="card-info">
                      <h4 className="card-name">
                        {row.name}
                        {row.isEdited && <span className="edited-indicator-mini">Edited</span>}
                      </h4>
                      <p className="card-subtext">{row.phone || 'No Phone'}</p>
                    </div>
                    <i className="fa-solid fa-chevron-right card-arrow"></i>
                  </div>
                  <div className="card-footer">
                    <div className="card-visit-info">
                      <i className="fa-regular fa-calendar-check"></i>
                      <span>{row.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
        
        {hasMore && !debouncedSearch && (
          <div className="pagination-footer">
            <button className="btn-load-more-records" onClick={() => setLimitCount(prev => prev + 50)}>
              <i className="fa-solid fa-circle-arrow-down mr-2"></i>
              Load Older Records
            </button>
          </div>
        )}
      </div>

      {/* Modal View - Responsive Center Card */}
      {isViewing && selectedRecord && (
        <div className="ledger-modal-overlay" onClick={() => { setIsViewing(false); setIsEditing(false); }}>
          <div className="ledger-modal-card animate-slideUp" onClick={e => e.stopPropagation()}>
            <div className="modal-top-bar">
              <div className="modal-id-label">
                Archive Ref: {selectedRecord.id.toUpperCase()}
                {selectedRecord.isEdited && <span className="edited-badge-modal ml-3">EDITED RECORD</span>}
              </div>
              <button className="btn-modal-close-x" onClick={() => { setIsViewing(false); setIsEditing(false); }}>&times;</button>
            </div>

            <div className="modal-main-content">
              {isEditing ? (
                <div className="edit-mode-container">
                  <div className="edit-section-title">Edit Patient Particulars</div>
                  <div className="edit-grid">
                    <div className="edit-input-group">
                      <label>Patient Name</label>
                      <input 
                        type="text" 
                        value={editForm.name} 
                        onChange={e => setEditForm({...editForm, name: e.target.value})}
                      />
                    </div>
                    <div className="edit-input-group">
                      <label>Age</label>
                      <input 
                        type="text" 
                        value={editForm.age} 
                        onChange={e => setEditForm({...editForm, age: e.target.value})}
                      />
                    </div>
                    <div className="edit-input-group">
                      <label>Sex</label>
                      <select 
                        value={editForm.sex} 
                        onChange={e => setEditForm({...editForm, sex: e.target.value})}
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="edit-input-group">
                      <label>Weight (kg)</label>
                      <input 
                        type="text" 
                        value={editForm.weight} 
                        onChange={e => setEditForm({...editForm, weight: e.target.value})}
                      />
                    </div>
                    <div className="edit-input-group">
                      <label>Phone Number</label>
                      <input 
                        type="text" 
                        value={editForm.phone} 
                        onChange={e => setEditForm({...editForm, phone: e.target.value})}
                      />
                    </div>
                    <div className="edit-input-group">
                      <label>Guardian Name</label>
                      <input 
                        type="text" 
                        value={editForm.guardianName} 
                        onChange={e => setEditForm({...editForm, guardianName: e.target.value})}
                      />
                    </div>
                    <div className="edit-input-group span-full">
                      <label>Address</label>
                      <input 
                        type="text" 
                        value={editForm.address} 
                        onChange={e => setEditForm({...editForm, address: e.target.value})}
                      />
                    </div>
                    <div className="edit-input-group span-full">
                      <label>Clinical Note</label>
                      <textarea 
                        rows="4"
                        value={editForm.clinicalNote} 
                        onChange={e => setEditForm({...editForm, clinicalNote: e.target.value})}
                      ></textarea>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="modal-identity-section">
                    <div className="modal-avatar-large">{selectedRecord.name[0]}</div>
                    <div className="modal-identity-info">
                      <h3>{selectedRecord.name}</h3>
                      <div className="modal-pills">
                        <span className="modal-pill">{selectedRecord.age} Years</span>
                        <span className="modal-pill">{selectedRecord.sex}</span>
                        {selectedRecord.weight && <span className="modal-pill">{selectedRecord.weight} kg</span>}
                      </div>
                    </div>
                  </div>

                  <div className="modal-data-grid">
                    <div className="grid-cell">
                      <label>Contact Number</label>
                      <p>{selectedRecord.phone || 'N/A'}</p>
                    </div>
                    <div className="grid-cell">
                      <label>Guardian Name</label>
                      <p>{selectedRecord.guardianName || 'N/A'}</p>
                    </div>
                    <div className="grid-cell span-full">
                      <label>Registered Address</label>
                      <p>{selectedRecord.address || 'No address on file'}</p>
                    </div>
                    <div className="grid-cell span-full">
                       <div className="clinical-narrative-container">
                          <div className="narrative-header">
                            <i className="fa-solid fa-file-signature"></i>
                            <span>Clinical Note • {selectedRecord.date}</span>
                          </div>
                          <div className="narrative-body">
                            {selectedRecord.clinicalNote || 'No detailed clinical observations recorded.'}
                          </div>
                       </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="modal-action-footer">
              {isEditing ? (
                <div className="edit-actions">
                  <button className="btn-cancel-edit" onClick={() => setIsEditing(false)}>Cancel</button>
                  <button className="btn-save-edit" onClick={handleSaveEdit} disabled={saving}>
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              ) : (
                <div className="view-actions">
                  <button className="btn-reprint-trigger" onClick={() => handlePrint(selectedRecord)}>
                    <i className="fa-solid fa-print mr-2"></i>
                    Reprint
                  </button>
                  <button className="btn-edit-trigger" onClick={startEditing}>
                    <i className="fa-solid fa-pen-to-square mr-2"></i>
                    Edit Record
                  </button>
                  <button className="btn-dismiss-modal" onClick={() => setIsViewing(false)}>Close Clinical Archive</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .ledger-v2-container {
          padding: 24px;
          max-width: 1300px;
          margin: 0 auto;
          animation: fadeIn 0.3s ease-out;
        }

        /* Adaptive Header */
        .ledger-page-header {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          margin-bottom: 24px;
        }
        
        .btn-export-pdf-minimal {
          background: var(--mgmt-surface-2);
          border: 1px solid var(--mgmt-border-2);
          padding: 8px 16px;
          border-radius: 10px;
          font-size: 12px;
          font-weight: 700;
          color: var(--mgmt-text-secondary);
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s;
        }
        .btn-export-pdf-minimal:hover {
          background: var(--mgmt-border-2);
          color: var(--mgmt-text);
          border-color: var(--mgmt-border);
        }
        .btn-export-pdf-minimal i { color: #ef4444; }

        /* Optimized Toolbar */
        .ledger-filter-toolbar {
          background: var(--mgmt-surface);
          border: 1px solid var(--mgmt-border);
          border-radius: 20px;
          padding: 12px;
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 24px;
          box-shadow: var(--mgmt-shadow-sm);
        }
        .search-box-container { flex: 1; display: flex; align-items: center; gap: 12px; padding: 0 16px; min-width: 200px; }
        .search-icon { color: var(--mgmt-text-muted); font-size: 16px; }
        .search-box-container input {
          background: transparent; border: none; color: var(--mgmt-text); font-size: 15px; font-weight: 500;
          width: 100%; outline: none;
        }
        .toolbar-actions { display: flex; align-items: center; gap: 12px; }
        .filter-modes-group { display: flex; gap: 6px; background: var(--mgmt-surface-2); padding: 5px; border-radius: 12px; }
        .mode-btn {
          background: transparent; border: none; color: var(--mgmt-text-muted); padding: 8px 16px;
          border-radius: 10px; font-size: 11px; font-weight: 800; text-transform: uppercase; transition: all 0.2s;
        }
        .mode-btn.active { background: var(--mgmt-surface); color: var(--mgmt-accent); box-shadow: var(--mgmt-shadow-sm); }
        .search-active-badge {
          background: var(--mgmt-accent-light); color: var(--mgmt-accent); padding: 8px 16px; border-radius: 12px;
          font-size: 11px; font-weight: 800; text-transform: uppercase; display: flex; align-items: center; gap: 8px;
        }
        .custom-range-inputs { display: flex; align-items: center; gap: 10px; padding-right: 8px; }
        .custom-range-inputs input {
          background: var(--mgmt-surface-2); border: 1px solid var(--mgmt-border-2); padding: 8px 12px;
          border-radius: 10px; font-size: 12px; color: var(--mgmt-text); outline: none;
        }
        .arrow-sep { color: var(--mgmt-border); font-weight: 900; }

        /* Content Area & Responsive Table/Cards */
        .ledger-main-view {
          background: var(--mgmt-surface);
          border: 1px solid var(--mgmt-border);
          border-radius: 24px;
          overflow: hidden;
          box-shadow: var(--mgmt-shadow-sm);
        }
        .table-responsive-desktop { display: block; }
        .cards-responsive-mobile { display: none; }

        .ledger-data-table { width: 100%; border-collapse: collapse; }
        .ledger-data-table th {
          background: var(--mgmt-surface-2); padding: 18px 24px; text-align: left;
          font-size: 11px; font-weight: 900; color: var(--mgmt-text-muted); text-transform: uppercase; letter-spacing: 0.1em;
        }
        .ledger-data-table td { padding: 16px 24px; border-bottom: 1px solid var(--mgmt-border-2); transition: all 0.2s; cursor: pointer; }
        .ledger-data-table tr:last-child td { border-bottom: none; }
        .ledger-data-table tr:hover td { background: var(--mgmt-surface-hover); }

        .col-id { width: 120px; }
        .id-monofont { font-family: ui-monospace, monospace; font-weight: 800; color: var(--mgmt-accent); font-size: 13px; opacity: 0.8; }

        .patient-meta-cell { display: flex; align-items: center; gap: 16px; }
        .avatar-box {
          width: 40px; height: 40px; border-radius: 12px; background: linear-gradient(135deg, var(--mgmt-accent), #0d9488);
          color: white; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 16px;
        }
        .full-name { display: block; font-weight: 800; color: var(--mgmt-text); font-size: 15px; margin-bottom: 4px; }
        .phone-num { display: block; font-size: 12px; color: var(--mgmt-text-muted); font-weight: 600; }

        .visit-meta-cell { display: flex; flex-direction: column; gap: 4px; }
        .visit-date-str { font-weight: 700; color: var(--mgmt-text-secondary); font-size: 14px; }
        .visit-time-str { font-size: 11px; color: var(--mgmt-text-muted); font-weight: 800; text-transform: uppercase; }

        .col-action { width: 80px; text-align: right; }
        .btn-view-circle {
          width: 36px; height: 36px; border-radius: 50%; border: 1px solid var(--mgmt-border-2);
          background: var(--mgmt-surface-2); color: var(--mgmt-text-muted); transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: inline-flex; align-items: center; justify-content: center;
        }
        .ledger-data-table tr:hover .btn-view-circle { color: white; background: var(--mgmt-accent); border-color: var(--mgmt-accent); transform: scale(1.1); }

        /* Mobile Cards Styling */
        .ledger-record-card {
          padding: 20px; border-bottom: 1px solid var(--mgmt-border-2);
          animation: slideIn 0.3s ease-out;
        }
        .card-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
        .card-id { font-size: 11px; font-weight: 800; color: var(--mgmt-accent); background: var(--mgmt-accent-light); padding: 4px 10px; border-radius: 6px; }
        .card-time { font-size: 11px; font-weight: 800; color: var(--mgmt-text-muted); text-transform: uppercase; }
        .card-main { display: flex; align-items: center; gap: 16px; margin-bottom: 16px; }
        .card-avatar {
          width: 44px; height: 44px; border-radius: 12px; background: linear-gradient(135deg, var(--mgmt-accent), #0d9488);
          color: white; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 18px;
        }
        .card-info { flex: 1; }
        .card-name { margin: 0 0 4px 0; font-size: 16px; font-weight: 800; color: var(--mgmt-text); }
        .card-subtext { margin: 0; font-size: 12px; color: var(--mgmt-text-muted); font-weight: 600; }
        .card-arrow { color: var(--mgmt-border); font-size: 14px; }
        .card-footer { border-top: 1px solid var(--mgmt-border-2); padding-top: 12px; }
        .card-visit-info { display: flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 700; color: var(--mgmt-text-secondary); }

        /* Pagination Footer */
        .pagination-footer { padding: 16px; background: var(--mgmt-surface-2); display: flex; justify-content: center; }
        .btn-load-more-records {
          background: var(--mgmt-surface); border: 1px solid var(--mgmt-border-2);
          color: var(--mgmt-text-secondary); font-size: 11px; font-weight: 800; text-transform: uppercase;
          padding: 10px 24px; border-radius: 12px; transition: all 0.2s; cursor: pointer;
        }
        .btn-load-more-records:hover { border-color: var(--mgmt-accent); color: var(--mgmt-accent); }

        /* Modal Sleek Centered Design */
        .ledger-modal-overlay {
          position: fixed; top: 0; left: 0; width: 100%; height: 100%;
          background: rgba(0,0,0,0.5); backdrop-filter: blur(6px);
          display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px;
        }
        .ledger-modal-card {
          background: var(--mgmt-surface); width: 100%; max-width: 600px;
          border-radius: 28px; box-shadow: var(--mgmt-shadow-modal);
          overflow: hidden; display: flex; flex-direction: column; max-height: 90vh;
        }
        .modal-top-bar {
          padding: 16px 24px; border-bottom: 1px solid var(--mgmt-border-2);
          display: flex; justify-content: space-between; align-items: center; background: var(--mgmt-surface-2);
        }
        .modal-id-label { font-size: 10px; font-weight: 800; color: var(--mgmt-accent); text-transform: uppercase; letter-spacing: 0.1em; }
        .btn-modal-close-x { background: transparent; border: none; font-size: 32px; color: var(--mgmt-text-muted); cursor: pointer; line-height: 1; }

        .modal-main-content { padding: 32px; overflow-y: auto; }
        .modal-identity-section { display: flex; align-items: center; gap: 24px; margin-bottom: 32px; }
        .modal-avatar-large {
          width: 72px; height: 72px; border-radius: 22px;
          background: linear-gradient(135deg, var(--mgmt-accent), #0d9488); color: white;
          display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 32px;
          box-shadow: 0 10px 25px rgba(20, 184, 166, 0.3);
        }
        .modal-identity-info h3 { margin: 0 0 10px 0; font-size: 24px; font-weight: 900; color: var(--mgmt-text); }
        .modal-pills { display: flex; gap: 8px; flex-wrap: wrap; }
        .modal-pill { font-size: 11px; font-weight: 800; color: var(--mgmt-text-muted); background: var(--mgmt-surface-2); padding: 4px 12px; border-radius: 8px; }

        .modal-data-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        .grid-cell label { display: block; font-size: 10px; font-weight: 900; color: var(--mgmt-text-muted); text-transform: uppercase; margin-bottom: 6px; letter-spacing: 0.05em; }
        .grid-cell p { margin: 0; font-size: 15px; font-weight: 600; color: var(--mgmt-text); }
        .grid-cell.span-full { grid-column: span 2; }

        .clinical-narrative-container {
          margin-top: 12px; background: var(--mgmt-surface-2); border: 1px solid var(--mgmt-border-2); border-radius: 20px; overflow: hidden;
        }
        .narrative-header {
          padding: 12px 20px; background: var(--mgmt-surface-hover); border-bottom: 1px solid var(--mgmt-border-2);
          display: flex; align-items: center; gap: 10px; font-size: 11px; font-weight: 900; color: var(--mgmt-accent); text-transform: uppercase;
        }
        .narrative-body { padding: 24px; font-size: 15px; color: var(--mgmt-text); line-height: 1.7; font-style: italic; white-space: pre-wrap; }

        .modal-action-footer { padding: 20px 32px; background: var(--mgmt-surface-2); border-top: 1px solid var(--mgmt-border-2); }
        .btn-dismiss-modal {
          padding: 10px 20px; border: none; border-radius: 12px;
          background: var(--mgmt-accent); color: white; font-weight: 700; font-size: 13px;
          transition: all 0.2s; box-shadow: 0 4px 10px rgba(20, 184, 166, 0.15);
          white-space: nowrap; cursor: pointer;
        }
        .btn-dismiss-modal:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(20, 184, 166, 0.4); }

        /* Edited Badge */
        .edited-indicator-mini {
          font-size: 9px; font-weight: 900; background: #fef3c7; color: #d97706;
          padding: 2px 6px; border-radius: 4px; margin-left: 8px; text-transform: uppercase;
          vertical-align: middle; border: 1px solid #fcd34d;
        }
        .edited-badge-modal {
          font-size: 9px; font-weight: 900; background: #d97706; color: white;
          padding: 2px 8px; border-radius: 4px; letter-spacing: 0.05em;
        }

        /* Edit Mode Styles */
        .edit-mode-container { animation: fadeIn 0.3s ease-out; }
        .edit-section-title { font-size: 11px; font-weight: 900; color: var(--mgmt-accent); text-transform: uppercase; margin-bottom: 20px; letter-spacing: 0.1em; }
        .edit-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .edit-input-group { display: flex; flex-direction: column; gap: 6px; }
        .edit-input-group.span-full { grid-column: span 2; }
        .edit-input-group label { font-size: 10px; font-weight: 800; color: var(--mgmt-text-muted); text-transform: uppercase; }
        .edit-input-group input, .edit-input-group select, .edit-input-group textarea {
          background: var(--mgmt-surface-2); border: 1px solid var(--mgmt-border-2);
          padding: 10px 14px; border-radius: 12px; font-size: 14px; color: var(--mgmt-text);
          outline: none; transition: border-color 0.2s;
        }
        .edit-input-group input:focus, .edit-input-group select:focus, .edit-input-group textarea:focus { border-color: var(--mgmt-accent); }
        
        .modal-action-footer .view-actions { display: flex; gap: 10px; justify-content: flex-end; }
        .modal-action-footer .edit-actions { display: flex; gap: 10px; justify-content: flex-end; }
        
        .btn-edit-trigger {
          padding: 10px 18px; border: 1px solid var(--mgmt-accent); border-radius: 12px;
          background: transparent; color: var(--mgmt-accent); font-weight: 700; font-size: 13px;
          transition: all 0.2s; cursor: pointer; white-space: nowrap;
        }
        .btn-edit-trigger:hover { background: var(--mgmt-accent-light); }
        
        .btn-save-edit {
          padding: 10px 20px; border: none; border-radius: 12px;
          background: var(--mgmt-accent); color: white; font-weight: 700; font-size: 13px;
          transition: all 0.2s; cursor: pointer;
        }
        .btn-save-edit:disabled { opacity: 0.5; cursor: not-allowed; }
        
        .btn-cancel-edit {
          padding: 10px 20px; border: 1px solid var(--mgmt-border-2); border-radius: 12px;
          background: var(--mgmt-surface); color: var(--mgmt-text-secondary); font-weight: 700; font-size: 13px;
          transition: all 0.2s; cursor: pointer;
        }

        .ledger-feedback-state { padding: 80px 0; text-align: center; }
        .spinner-loader { width: 40px; height: 40px; border: 4px solid var(--mgmt-border-2); border-top-color: var(--mgmt-accent); border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 20px; }

        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(15px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }

        @media (max-width: 900px) {
          .ledger-filter-toolbar { flex-direction: column; align-items: stretch; gap: 16px; padding: 16px; }
          .search-box-container { padding: 0 8px; border-bottom: 1px solid var(--mgmt-border-2); padding-bottom: 16px; }
          .toolbar-actions { flex-direction: column; align-items: stretch; }
          .filter-modes-group { justify-content: space-between; }
        }

        @media (max-width: 768px) {
          .ledger-v2-container { padding: 16px; }
          .ledger-page-header { flex-direction: column; align-items: flex-start; gap: 16px; }
          .btn-export-pdf { width: 100%; justify-content: center; }
          .table-responsive-desktop { display: none; }
          .cards-responsive-mobile { display: block; }
          .modal-main-content { padding: 24px; }
          .modal-data-grid { grid-template-columns: 1fr; gap: 20px; }
        }

        .btn-reprint-trigger {
          padding: 10px 18px; border: 1px solid var(--mgmt-border-2); border-radius: 12px;
          background: var(--mgmt-surface-2); color: var(--mgmt-text-secondary); font-weight: 700; font-size: 13px;
          transition: all 0.2s; cursor: pointer; display: flex; align-items: center; gap: 8px; white-space: nowrap;
        }
        .btn-reprint-trigger:hover { background: var(--mgmt-border-2); color: var(--mgmt-text); }

        .hidden { display: none !important; }
        @media print {
            .no-print, .ledger-v2-container, .ledger-modal-overlay { display: none !important; }
            .print-only { display: block !important; position: absolute; top: 0; left: 0; width: 100%; }
        }
      `}</style>
    </div>

    {/* Hidden print template */}
      {selectedForPrint && (
        <div className={isPrinting ? 'print-only' : 'hidden'}>
          <PrescriptionPrintTemplate data={selectedForPrint} prescriptionId={selectedForPrint.id} />
        </div>
      )}
    </>
  );
}
