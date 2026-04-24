'use client';

import { useState, useCallback, useEffect } from 'react';
import styles from './MathCaptcha.module.css';

function generateQuestion() {
  const ops = ['+', '-'];
  const op = ops[Math.floor(Math.random() * ops.length)];
  let a, b;
  if (op === '+') {
    a = Math.floor(Math.random() * 20) + 1;
    b = Math.floor(Math.random() * 20) + 1;
  } else {
    a = Math.floor(Math.random() * 20) + 10;
    b = Math.floor(Math.random() * a) + 1;
  }
  const answer = op === '+' ? a + b : a - b;
  return { question: `${a} ${op} ${b}`, answer };
}

export default function MathCaptcha({ onVerified }) {
  const [captcha, setCaptcha] = useState({ question: '...', answer: 0 });
  const [userAnswer, setUserAnswer] = useState('');
  const [error, setError] = useState('');
  const [verified, setVerified] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setCaptcha(generateQuestion());
    setMounted(true);
  }, []);

  const refresh = useCallback(() => {
    setCaptcha(generateQuestion());
    setUserAnswer('');
    setError('');
    setVerified(false);
    onVerified(false);
  }, [onVerified]);

  const handleCheck = () => {
    const parsed = parseInt(userAnswer, 10);
    if (isNaN(parsed)) {
      setError('Please enter a number.');
      return;
    }
    if (parsed === captcha.answer) {
      setVerified(true);
      setError('');
      onVerified(true);
    } else {
      setError('Incorrect. Try again!');
      setCaptcha(generateQuestion());
      setUserAnswer('');
      onVerified(false);
    }
  };

  return (
    <div className={styles.captcha}>
      <label className={styles.label}>
        <i className="fa-solid fa-shield-halved"></i>
        Security Check
      </label>
      <div className={styles.row}>
        <div className={styles.question}>
          What is <strong>{mounted ? captcha.question : '...'}</strong> ?
        </div>
        <input
          type="number"
          className={`form-input ${styles.input}`}
          value={userAnswer}
          onChange={(e) => {
            setUserAnswer(e.target.value);
            setError('');
            if (verified) {
              setVerified(false);
              onVerified(false);
            }
          }}
          placeholder="Answer"
          disabled={verified}
        />
        <button
          type="button"
          className={`btn btn-primary btn-sm ${styles.verifyBtn}`}
          onClick={handleCheck}
          disabled={verified || !userAnswer}
        >
          {verified ? (
            <><i className="fa-solid fa-check"></i> Verified</>
          ) : (
            'Verify'
          )}
        </button>
        <button
          type="button"
          className={styles.refreshBtn}
          onClick={refresh}
          aria-label="Refresh captcha"
          title="New question"
        >
          <i className="fa-solid fa-rotate-right"></i>
        </button>
      </div>
      {error && <p className={styles.error}>{error}</p>}
      {verified && <p className={styles.success}><i className="fa-solid fa-circle-check"></i> Verified successfully</p>}
    </div>
  );
}
