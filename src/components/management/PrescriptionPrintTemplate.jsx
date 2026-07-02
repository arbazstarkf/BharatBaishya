import Image from 'next/image';

const PrescriptionPrintTemplate = ({ data, prescriptionId }) => {
  // Generate verification URL
  const verifyUrl = prescriptionId
    ? `https://drbharatassam.com/verify?id=${prescriptionId}`
    : `https://drbharatassam.com/verify?name=${encodeURIComponent(data.name)}&date=${data.date}`;

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(verifyUrl)}&bgcolor=ffffff`;

  return (
    <>
      <style type="text/css">
        {`
          @import url('https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@400;500;600;700;800&display=swap');
          .prescription-print-root {
            font-family: 'Josefin Sans', sans-serif !important;
          }
          .prescription-print-root * {
            font-family: inherit;
          }
        `}
      </style>
      <div className="prescription-print-root">
        {/* Premium Header */}
      <header className="prescription-header-modern">
        <div className="header-flex-row">
          <div className="hospital-side">
             <img src="/images/sparsh hospital logo.jpg" alt="Sparsh Hospital" className="h-logo" />
             <div className="hospital-text">
               <p className="h-name">Sparsh Hospital</p>
               <p className="h-loc">Rangia, Assam</p>
             </div>
          </div>
          
          <div className="doctor-center-info">
            <h1 className="doc-display-name">Dr. Bharat Baishya</h1>
            <p className="doc-creds">MBBS, MD, CCEBDM, MAACE, FICP</p>
            <p className="doc-tagline">Specialist in Medicine and Diabetes</p>
            <div className="doc-reg-badge">REG. NO : 16525 (AMC)</div>
          </div>

          <div className="doctor-logo-side">
             <img src="/images/logo.png" alt="Dr. Bharat Baishya" className="d-logo" />
          </div>
        </div>

        <div className="timings-strip-modern">
          <div className="timing-chip">
            <i className="fa-solid fa-hospital" /> Sparsh Hospital(Rangia Station Road): 9AM – 3PM
          </div>
          <div className="timing-chip">
            <i className="fa-solid fa-house-medical" /> Residency-Miranjali(Rangia Murara-Dharampur) : 5PM – 9PM
          </div>
        </div>
      </header >

  {/* Modern Patient Info Bar */ }
      <section className="patient-modern-bar">
        <div className="patient-info-grid">
          <div className="info-group span-2">
            <label>PATIENT NAME</label>
            <div className="val highlight">{data.name}</div>
          </div>
          <div className="info-group">
            <label>AGE / SEX</label>
            <div className="val">{data.age && data.sex ? `${data.age}Y / ${data.sex}` : data.age || data.sex || '—'}</div>
          </div>
          <div className="info-group">
            <label>WEIGHT</label>
            <div className="val">{data.weight ? `${data.weight} kg` : '—'}</div>
          </div>
          <div className="info-group">
            <label>DATE</label>
            <div className="val">{data.date}</div>
          </div>

          <div className="info-group span-2">
            <label>GUARDIAN'S NAME</label>
            <div className="val">{data.guardianName || '—'}</div>
          </div>
          <div className="info-group">
            <label>PHONE</label>
            <div className="val">{data.phone || '—'}</div>
          </div>
          <div className="info-group span-2">
            <label>ADDRESS / LOCATION</label>
            <div className="val">{data.address || '—'}</div>
          </div>
        </div>
      </section>

  {/* Modernized Body Area */ }
  < main className = "prescription-content-body" >
        <div className="rx-indicator-modern">Rx</div>
        <div className="writing-canvas">
          {/* Maximum white space for handwriting */}
        </div>

{/* Floating QR Corner */ }
<div className="qr-verification-corner">
  <div className="qr-wrapper">
    <img src={qrUrl} alt="QR Verify" />
  </div>
  <div className="qr-label">
    <span>Scan to Verify</span>
    <strong>ID: {prescriptionId?.substring(0, 8) || 'TEMP'}</strong>
  </div>
</div>
      </main >

  {/* Sleek Footer */ }
  < footer className = "footer-modern" >
        <div className="footer-links">
          <div className="f-link">
            <i className="fa-solid fa-phone" /> +91 9854004813
          </div>
          <div className="f-link">
            <i className="fa-solid fa-headset" /> 18008890165 (Toll-Free)
          </div>
          <div className="f-link">
            <i className="fa-solid fa-envelope" /> drbharat.baishya@gmail.com
          </div>
          <div className="f-link">
            <i className="fa-solid fa-globe" /> www.drbharatassam.com
          </div>
        </div>
        <div className="footer-note-modern">
          Please bring this prescription for follow-up consultation. (Available on Sundays with prior appointment only)
        </div>
      </footer >
    </div >
    </>
  );
};

export default PrescriptionPrintTemplate;
