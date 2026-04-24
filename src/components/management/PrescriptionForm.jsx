'use client';

import { useState } from 'react';
import { collection, addDoc, serverTimestamp, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import PrescriptionPrintTemplate from './PrescriptionPrintTemplate';

export default function PrescriptionForm() {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    age: '',
    sex: '',
    weight: '',
    guardianName: '',
    phone: '',
    clinicalNote: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [lastSavedId, setLastSavedId] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  
  // Modal for multiple patients
  const [foundPatients, setFoundPatients] = useState([]);

  const handlePrint = async () => {
    setIsSaving(true);
    try {
      const docRef = await addDoc(collection(db, 'prescriptions'), {
        ...formData,
        metadata: {
          partialName: formData.name.substring(0, 3) + '...',
          partialAddress: formData.address ? formData.address.substring(0, 3) + '...' : '',
        },
        createdAt: serverTimestamp(),
      });
      setLastSavedId(docRef.id);
      setTimeout(() => {
        window.print();
        setIsSaving(false);
      }, 500);
    } catch (err) {
      console.error('Error saving prescription:', err);
      setIsSaving(false);
      alert('Failed to save prescription data.');
    }
  };

  const findPatientByPhone = async () => {
    if (!formData.phone || formData.phone.length < 5) {
      alert('Please enter a phone number first.');
      return;
    }
    
    setIsSearching(true);
    setFoundPatients([]);
    try {
      const q = query(
        collection(db, 'prescriptions'), 
        where('phone', '==', formData.phone),
        orderBy('createdAt', 'desc'),
        limit(20)
      );
      const snap = await getDocs(q);
      
      if (!snap.empty) {
        const uniquePatients = [];
        const seenNames = new Set();
        
        snap.docs.forEach(doc => {
          const data = doc.data();
          const nameKey = data.name?.toLowerCase().trim();
          if (nameKey && !seenNames.has(nameKey)) {
            seenNames.add(nameKey);
            uniquePatients.push({ id: doc.id, ...data });
          }
        });

        if (uniquePatients.length === 1) {
          selectPatient(uniquePatients[0]);
        } else {
          setFoundPatients(uniquePatients);
        }
      } else {
        alert('No previous records found for this number.');
      }
    } catch (err) {
      console.error(err);
      alert('Search failed. Ensure phone number matches exactly.');
    } finally {
      setIsSearching(false);
    }
  };

  const selectPatient = (p) => {
    setFormData(prev => ({
      ...prev,
      name: p.name || '',
      address: p.address || '',
      sex: p.sex || '',
      guardianName: p.guardianName || '',
      // Age and Weight are skipped as they change over time
    }));
    setFoundPatients([]);
  };

  const handlePrintBlank = () => {
    handleClear();
    setTimeout(() => window.print(), 300);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleClear = () => {
    setFormData({
      name: '', address: '', age: '', sex: '', weight: '', guardianName: '', phone: '', clinicalNote: '',
      date: new Date().toISOString().split('T')[0],
    });
    setLastSavedId(null);
    setFoundPatients([]);
  };

  return (
    <div className="mgmt-prescription-container">
      {/* Patient Selection Modal Overlay */}
      {foundPatients.length > 1 && (
        <div className="mgmt-modal-overlay" onClick={() => setFoundPatients([])}>
          <div className="mgmt-modal-card" onClick={e => e.stopPropagation()}>
            <div className="mgmt-modal-header">
              <div>
                <h3 className="mgmt-modal-title">Family Records Found</h3>
                <p className="mgmt-modal-subtitle">Multiple patients share this phone number. Please select one:</p>
              </div>
              <button className="mgmt-modal-close-icon" onClick={() => setFoundPatients([])}>&times;</button>
            </div>
            
            <div className="mgmt-modal-body">
              {foundPatients.map(p => (
                <div key={p.id} className="patient-select-item" onClick={() => selectPatient(p)}>
                  <div className="psi-icon">
                    <i className="fa-solid fa-user-medical"></i>
                  </div>
                  <div className="psi-content">
                    <div className="psi-name">{p.name}</div>
                    <div className="psi-meta">{p.sex} • {p.address || 'No address recorded'}</div>
                  </div>
                  <i className="fa-solid fa-chevron-right psi-arrow"></i>
                </div>
              ))}
            </div>
            
            <div className="mgmt-modal-footer">
              <button className="mgmt-btn mgmt-btn--secondary w-full" onClick={() => setFoundPatients([])}>
                Cancel & Enter Manually
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Prescription Preview Modal */}
      {isPreviewOpen && (
        <div className="mgmt-modal-overlay preview-overlay" onClick={() => setIsPreviewOpen(false)}>
          <div className="mgmt-preview-container" onClick={e => e.stopPropagation()}>
            <div className="mgmt-preview-header no-print">
              <div className="flex items-center gap-3">
                <div className="preview-badge">PREVIEW MODE</div>
                <h3 className="mgmt-modal-title">Prescription Preview</h3>
              </div>
              <div className="flex gap-2">
                <button className="mgmt-btn mgmt-btn--secondary" onClick={() => setIsPreviewOpen(false)}>
                  <i className="fa-solid fa-pen-to-square" /> Edit Details
                </button>
                <button className="mgmt-btn mgmt-btn--primary save-print-btn" onClick={() => { setIsPreviewOpen(false); handlePrint(); }}>
                  <i className="fa-solid fa-print" /> Save & Print
                </button>
                <button className="mgmt-modal-close-icon" onClick={() => setIsPreviewOpen(false)}>&times;</button>
              </div>
            </div>
            
            <div className="mgmt-preview-body">
              <div className="preview-scale-wrapper">
                <PrescriptionPrintTemplate data={formData} prescriptionId={lastSavedId} />
              </div>
            </div>

            <div className="mgmt-preview-footer no-print">
              <i className="fa-solid fa-circle-info" /> This is a visual preview. The final print will be automatically formatted for A4 paper.
            </div>
          </div>
        </div>
      )}

      <div className="mgmt-card mgmt-prescription-form-card no-print">
        <div className="mgmt-card__header">
          <div className="mgmt-card__title">
            <i className="fa-solid fa-file-medical" style={{ marginRight: 8, color: 'var(--mgmt-accent)' }} />
            New Prescription Details
          </div>
          <div className="flex gap-2">
            <button className="mgmt-btn mgmt-btn--secondary mgmt-btn--sm" onClick={handlePrintBlank}>
               <i className="fa-solid fa-file" /> Print Blank Rx
            </button>
            <button className="mgmt-btn mgmt-btn--secondary mgmt-btn--sm" onClick={handleClear} disabled={isSaving}>
               <i className="fa-solid fa-eraser" /> Clear
            </button>
          </div>
        </div>
        
        <div className="mgmt-card__body p-24">
          <form className="mgmt-form-grid" onSubmit={(e) => e.preventDefault()}>
            <div className="mgmt-form-group span-2">
              <label className="mgmt-label"><i className="fa-solid fa-phone" style={{ color: 'var(--mgmt-accent)', marginRight: '6px' }}></i> Contact Number</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="phone"
                  className="mgmt-input"
                  placeholder="Enter phone number..."
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={isSaving}
                  style={{ flex: 1 }}
                />
                <button 
                  type="button"
                  className="mgmt-btn mgmt-btn--secondary" 
                  onClick={findPatientByPhone}
                  disabled={isSearching || isSaving}
                >
                  {isSearching ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-search"></i>}
                </button>
              </div>
            </div>

            <div className="mgmt-form-group span-2">
              <label className="mgmt-label"><i className="fa-solid fa-user" style={{ color: 'var(--mgmt-accent)', marginRight: '6px' }}></i> Patient Name</label>
              <input
                type="text"
                name="name"
                className="mgmt-input"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                disabled={isSaving}
              />
            </div>

            <div className="mgmt-form-group span-2">
              <label className="mgmt-label"><i className="fa-solid fa-user-shield" style={{ color: 'var(--mgmt-accent)', marginRight: '6px' }}></i> Guardian's Name (S/O, D/O, C/O)</label>
              <input
                type="text"
                name="guardianName"
                className="mgmt-input"
                placeholder="Guardian's Name"
                value={formData.guardianName}
                onChange={handleChange}
                disabled={isSaving}
              />
            </div>

            <div className="mgmt-form-group span-2">
              <label className="mgmt-label"><i className="fa-solid fa-location-dot" style={{ color: 'var(--mgmt-accent)', marginRight: '6px' }}></i> Address</label>
              <input
                type="text"
                name="address"
                className="mgmt-input"
                placeholder="City / Village"
                value={formData.address}
                onChange={handleChange}
                disabled={isSaving}
              />
            </div>

            <div className="mgmt-form-group">
              <label className="mgmt-label"><i className="fa-solid fa-cake-candles" style={{ color: 'var(--mgmt-accent)', marginRight: '6px' }}></i> Age</label>
              <input
                type="number"
                name="age"
                className="mgmt-input"
                placeholder="Current Age"
                value={formData.age}
                onChange={handleChange}
                disabled={isSaving}
              />
            </div>

            <div className="mgmt-form-group">
              <label className="mgmt-label"><i className="fa-solid fa-venus-mars" style={{ color: 'var(--mgmt-accent)', marginRight: '6px' }}></i> Sex</label>
              <select name="sex" className="mgmt-select" value={formData.sex} onChange={handleChange} disabled={isSaving}>
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="mgmt-form-group">
              <label className="mgmt-label"><i className="fa-solid fa-weight-scale" style={{ color: 'var(--mgmt-accent)', marginRight: '6px' }}></i> Weight (kg)</label>
              <input
                type="text"
                name="weight"
                className="mgmt-input"
                placeholder="Current Weight"
                value={formData.weight}
                onChange={handleChange}
                disabled={isSaving}
              />
            </div>

            <div className="mgmt-form-group">
              <label className="mgmt-label"><i className="fa-solid fa-calendar-day" style={{ color: 'var(--mgmt-accent)', marginRight: '6px' }}></i> Date</label>
              <input
                type="date"
                name="date"
                className="mgmt-input"
                value={formData.date}
                onChange={handleChange}
                disabled={isSaving}
              />
            </div>

            <div className="mgmt-form-group span-4">
              <label className="mgmt-label"><i className="fa-solid fa-notes-medical" style={{ color: 'var(--mgmt-accent)', marginRight: '6px' }}></i> Clinical Note</label>
              <textarea
                name="clinicalNote"
                className="mgmt-input"
                rows="2"
                placeholder="Enter patient diagnosis or medical history..."
                value={formData.clinicalNote}
                onChange={handleChange}
                disabled={isSaving}
              ></textarea>
            </div>
          </form>

          <div className="mgmt-form-actions mt-24 flex gap-4">
            <button 
              type="button"
              className="mgmt-btn mgmt-btn--secondary mgmt-btn--lg flex-1"
              onClick={() => setIsPreviewOpen(true)}
              disabled={!formData.name || isSaving}
            >
              <i className="fa-solid fa-eye" /> Preview Rx
            </button>
            <button 
              className="mgmt-btn mgmt-btn--primary mgmt-btn--lg flex-1 save-print-btn"
              onClick={handlePrint}
              disabled={!formData.name || isSaving}
            >
              {isSaving ? (
                <><span className="mgmt-spinner mgmt-spinner--sm" /> Saving & Preparing...</>
              ) : (
                <><i className="fa-solid fa-print" /> Save & Print Prescription</>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="prescription-print-wrapper">
        <PrescriptionPrintTemplate data={formData} prescriptionId={lastSavedId} />
      </div>

      <style>{`
        .save-print-btn { 
          background: #0d9488 !important; color: #ffffff !important; border: none !important; font-weight: 700;
          box-shadow: 0 4px 12px rgba(13, 148, 136, 0.3) !important; transition: 0.2s !important;
        }
        .save-print-btn:hover:not(:disabled) { background: #0f766e !important; transform: translateY(-2px); }
        .save-print-btn:disabled { background: #94a3b8 !important; opacity: 0.7 !important; cursor: not-allowed; }

        /* Modal Overlay */
        .mgmt-modal-overlay {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0, 0, 0, 0.5); backdrop-filter: blur(4px);
          display: flex; align-items: center; justify-content: center;
          z-index: 10000; animation: fadeIn 0.2s ease;
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

        .mgmt-modal-card {
          background: var(--mgmt-surface); width: 100%; max-width: 500px;
          border-radius: 20px; box-shadow: var(--mgmt-shadow-xl);
          border: 1px solid var(--mgmt-border); overflow: hidden;
          animation: modalSlide 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        @keyframes modalSlide { from { transform: scale(0.9) translateY(20px); opacity: 0; } to { transform: scale(1) translateY(0); opacity: 1; } }

        .mgmt-modal-header { padding: 20px 24px; border-bottom: 1px solid var(--mgmt-border-2); display: flex; justify-content: space-between; align-items: flex-start; }
        .mgmt-modal-title { font-size: 18px; font-weight: 800; color: var(--mgmt-text); margin-bottom: 4px; }
        .mgmt-modal-subtitle { font-size: 13px; color: var(--mgmt-text-secondary); }
        .mgmt-modal-close-icon { font-size: 24px; background: none; border: none; color: var(--mgmt-text-muted); cursor: pointer; line-height: 1; }

        .mgmt-modal-body { padding: 16px; max-height: 400px; overflow-y: auto; }
        .patient-select-item {
          display: flex; align-items: center; gap: 15px; padding: 14px 18px;
          border-radius: 14px; background: var(--mgmt-surface-2); border: 1px solid var(--mgmt-border-2);
          margin-bottom: 10px; cursor: pointer; transition: 0.2s;
        }
        .patient-select-item:hover { background: var(--mgmt-accent-light); border-color: var(--mgmt-accent); transform: translateX(5px); }
        .psi-icon { width: 36px; height: 36px; background: var(--mgmt-accent); color: white; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 16px; }
        .psi-content { flex: 1; }
        .psi-name { font-weight: 700; color: var(--mgmt-text); font-size: 16px; margin-bottom: 2px; }
        .psi-meta { font-size: 12px; color: var(--mgmt-text-secondary); }
        .psi-arrow { color: var(--mgmt-accent); opacity: 0.5; font-size: 12px; }

        .mgmt-modal-footer { padding: 16px 24px; border-top: 1px solid var(--mgmt-border-2); background: var(--mgmt-surface-2); }

        /* Preview Modal Specifics */
        .preview-overlay { background: rgba(15, 23, 42, 0.9); }
        .mgmt-preview-container {
          background: #f1f5f9; width: 95vw; max-width: 1000px; height: 90vh;
          border-radius: 24px; display: flex; flex-direction: column; overflow: hidden;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }
        .mgmt-preview-header {
          padding: 16px 24px; background: white; border-bottom: 1px solid #e2e8f0;
          display: flex; justify-content: space-between; align-items: center;
        }
        .preview-badge {
          background: #0d9488; color: white; font-size: 10px; font-weight: 800;
          padding: 4px 10px; border-radius: 6px; letter-spacing: 0.05em;
        }
        .mgmt-preview-body {
          flex: 1; overflow-y: auto; padding: 40px; display: flex; justify-content: center;
          background: #cbd5e1;
        }
        .preview-scale-wrapper {
          transform-origin: top center;
          transform: scale(0.85);
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        @media (max-width: 1024px) {
          .preview-scale-wrapper { transform: scale(0.6); }
        }
        @media (max-width: 768px) {
          .preview-scale-wrapper { transform: scale(0.45); }
          .mgmt-preview-body { padding: 10px; }
        }
        .mgmt-preview-footer {
          padding: 12px 24px; background: #f8fafc; border-top: 1px solid #e2e8f0;
          font-size: 12px; color: #64748b; text-align: center;
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
      `}</style>
    </div>
  );
}
