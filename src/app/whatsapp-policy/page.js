import styles from './page.module.css';

export const metadata = {
  title: 'WhatsApp & Call Policy | Dr. Bharat Baishya',
  description: 'Professional communication policy for contacting Dr. Bharat Baishya via WhatsApp and phone calls.',
};

export default function WhatsappPolicyPage() {
  const policyPoints = [
    'This is a professional communication number.',
    'Please send your prescription and recent investigation for any meaningful discussion.',
    'Response may take time as the team or doctor might be busy delivering medical care to another patient.',
    'Sick patients should immediately visit the nearest hospital or come to Sparsh Hospital Emergency Response Ward for care. Not all care can be delivered through WhatsApp.',
    'Please do not send greetings like good morning, good night, asking personal wellbeing of doctor, no festival or special occasion greetings. Please reduce electronic clutter.',
    'Do not expect us to recognise you immediately and don’t mind to introduce yourself professionally.',
  ];

  return (
    <div className="container section">
      <div className={styles.wrapper}>
        <header className={styles.header}>
          <div className={styles.icon}>
            <i className="fa-brands fa-whatsapp"></i>
          </div>
          <h1>WhatsApp & Call Policy</h1>
          <p className={styles.subtitle}>Professional Communication Guidelines</p>
        </header>

        <div className={styles.content}>
          <div className={styles.card}>
            <div className={styles.cardBody}>
              {policyPoints.map((point, index) => (
                <div key={index} className={styles.policyItem}>
                  <div className={styles.pointNumber}>{index + 1}</div>
                  <p>{point}</p>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.importantNote}>
            <i className="fa-solid fa-circle-info"></i>
            <p>
              Following these guidelines helps us prioritize critical patient care and 
              respond more efficiently to medical queries.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
