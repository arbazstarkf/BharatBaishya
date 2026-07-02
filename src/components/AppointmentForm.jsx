'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import Link from 'next/link';
import flatpickr from 'flatpickr';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import MathCaptcha from './MathCaptcha';
import styles from './AppointmentForm.module.css';

const locations = [
  {
    id: 'sparsh',
    name: 'Sparsh Hospital, Rangia',
    hours: 'Mon–Sat: 11:00 AM – 5:00 PM',
  },
  {
    id: 'residence',
    name: 'Residency, Rangia',
    hours: 'Mon–Sat: 6:00 PM – 8:00 PM',
  },
  {
    id: 'tamulpur',
    name: 'Tamulpur, Baksa',
    hours: 'Saturday Only, Timings May Vary (Call before Booking)',
  },
];

const initialForm = {
  name: '',
  phone: '',
  email: '',
  date: '',
  time: '',
  location: '',
  reason: '',
  consent: false,
};

export default function AppointmentForm({ compact = false }) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const dateRef = useRef(null);
  const timeRef = useRef(null);

  useEffect(() => {
    let datePicker = null;
    let timePicker = null;

    if (dateRef.current) {
      datePicker = flatpickr(dateRef.current, {
        dateFormat: 'Y-m-d',
        minDate: 'today',
        onChange: (selectedDates, dateStr) => {
          setForm((prev) => ({ ...prev, date: dateStr }));
          if (errors.date) setErrors((prev) => ({ ...prev, date: '' }));
        },
      });
    }

    if (timeRef.current) {
      timePicker = flatpickr(timeRef.current, {
        enableTime: true,
        noCalendar: true,
        dateFormat: 'h:i K',
        time_24hr: false,
        onChange: (selectedDates, timeStr) => {
          setForm((prev) => ({ ...prev, time: timeStr }));
        },
      });
    }

    return () => {
      if (datePicker) datePicker.destroy();
      if (timePicker) timePicker.destroy();
    };
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.phone.trim()) errs.phone = 'Phone number is required';
    else if (!/^[+]?\d{10,13}$/.test(form.phone.replace(/\s/g, '')))
      errs.phone = 'Enter a valid phone number';
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = 'Enter a valid email';
    if (!form.date) errs.date = 'Please select a date';
    if (!form.location) errs.location = 'Please select a location';
    if (!form.consent) errs.consent = 'You must agree to the Privacy Policy to proceed';
    if (!captchaVerified) errs.captcha = 'Please complete the verification';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setSubmitting(true);
    setSubmitError('');

    try {
      // Save to Firestore
      await addDoc(collection(db, 'appointments'), {
        ...form,
        status: 'pending',
        createdAt: serverTimestamp(),
      });

      setSubmitted(true);
      setForm(initialForm);
      setCaptchaVerified(false);
    } catch (err) {
      setSubmitError('Something went wrong. Please try again or call us directly.');
    } finally {
      setSubmitting(false);
    }
  };

  const onCaptchaVerified = useCallback((verified) => {
    setCaptchaVerified(verified);
    if (errors.captcha) {
      setErrors((prev) => ({ ...prev, captcha: '' }));
    }
  }, [errors.captcha]);

  if (submitted) {
    return (
      <div className={styles.success}>
        <div className={styles.successIcon}>
          <i className="fa-solid fa-circle-check"></i>
        </div>
        <h3>Appointment Request Sent!</h3>
        <p>
          Thank you for booking with Dr. Bharat Baishya. The team will confirm your
          appointment shortly via phone or email.
        </p>
        <button
          className="btn btn-primary"
          onClick={() => setSubmitted(false)}
        >
          Book Another Appointment
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form} id="appointment-form">
      <div className={compact ? styles.gridCompact : styles.grid}>
        {/* Name */}
        <div className="form-group">
          <label className="form-label" htmlFor="apt-name">
            Full Name <span className={styles.required}>*</span>
          </label>
          <input
            id="apt-name"
            type="text"
            name="name"
            className={`form-input ${errors.name ? styles.inputError : ''}`}
            value={form.name}
            onChange={handleChange}
            placeholder="Enter your full name"
          />
          {errors.name && <p className="form-error">{errors.name}</p>}
        </div>

        {/* Phone */}
        <div className="form-group">
          <label className="form-label" htmlFor="apt-phone">
            Phone Number <span className={styles.required}>*</span>
          </label>
          <input
            id="apt-phone"
            type="tel"
            name="phone"
            className={`form-input ${errors.phone ? styles.inputError : ''}`}
            value={form.phone}
            onChange={handleChange}
            placeholder="+91 XXXXXXXXXX"
          />
          {errors.phone && <p className="form-error">{errors.phone}</p>}
        </div>

        {/* Email */}
        <div className="form-group">
          <label className="form-label" htmlFor="apt-email">
            Email Address (Optional)
          </label>
          <input
            id="apt-email"
            type="email"
            name="email"
            className={`form-input ${errors.email ? styles.inputError : ''}`}
            value={form.email}
            onChange={handleChange}
            placeholder="your@email.com"
          />
          {errors.email && <p className="form-error">{errors.email}</p>}
        </div>

        {/* Location */}
        <div className="form-group">
          <label className="form-label" htmlFor="apt-location">
            Preferred Location <span className={styles.required}>*</span>
          </label>
          <select
            id="apt-location"
            name="location"
            className={`form-select ${errors.location ? styles.inputError : ''}`}
            value={form.location}
            onChange={handleChange}
          >
            <option value="">Select a location</option>
            {locations.map((loc) => (
              <option key={loc.id} value={loc.name}>
                {loc.name} ({loc.hours})
              </option>
            ))}
          </select>
          {errors.location && <p className="form-error">{errors.location}</p>}
        </div>

        {/* Date */}
        <div className="form-group">
          <label className="form-label" htmlFor="apt-date">
            Preferred Date <span className={styles.required}>*</span>
          </label>
          <input
            id="apt-date"
            ref={dateRef}
            type="text"
            name="date"
            className={`form-input ${errors.date ? styles.inputError : ''}`}
            value={form.date}
            readOnly
            placeholder="Select date"
          />
          {errors.date && <p className="form-error">{errors.date}</p>}
        </div>

        {/* Time */}
        <div className="form-group">
          <label className="form-label" htmlFor="apt-time">
            Preferred Time
          </label>
          <input
            id="apt-time"
            ref={timeRef}
            type="text"
            name="time"
            className="form-input"
            value={form.time}
            readOnly
            placeholder="Select time"
          />
        </div>
      </div>

      {/* Reason */}
      <div className="form-group">
        <label className="form-label" htmlFor="apt-reason">
          Reason for Visit(Optional)
        </label>
        <textarea
          id="apt-reason"
          name="reason"
          className="form-textarea"
          value={form.reason}
          onChange={handleChange}
          placeholder="Briefly describe your symptoms or reason for the visit..."
          rows={4}
        />
      </div>

      {/* Consent Checkbox */}
      <div className="form-group" style={{ flexDirection: 'row', alignItems: 'flex-start', gap: '0.75rem', display: 'flex', marginTop: '1rem', marginBottom: '1rem' }}>
        <input
          id="apt-consent"
          type="checkbox"
          name="consent"
          checked={form.consent}
          onChange={handleChange}
          style={{ marginTop: '0.25rem', width: '1.25rem', height: '1.25rem', accentColor: 'var(--primary-color)' }}
        />
        <label htmlFor="apt-consent" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
          I agree to the <a href="/privacy-policy" target="_blank" style={{ color: 'var(--primary-color)', textDecoration: 'underline' }}>Privacy Policy</a> and consent to the collection and processing of my personal and health data for appointment booking. <span className={styles.required}>*</span>
        </label>
      </div>
      {errors.consent && <p className="form-error" style={{ marginTop: '-0.75rem', marginBottom: '1rem' }}>{errors.consent}</p>}

      {/* Captcha */}
      <MathCaptcha onVerified={onCaptchaVerified} />
      {errors.captcha && <p className="form-error" style={{ marginTop: '-0.75rem', marginBottom: '1rem' }}>{errors.captcha}</p>}

      {/* Submit Error */}
      {submitError && (
        <div className={styles.errorBanner}>
          <i className="fa-solid fa-triangle-exclamation"></i>
          {submitError}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        className="btn btn-primary btn-lg"
        disabled={submitting}
        style={{ width: '100%' }}
      >
        {submitting ? (
          <><i className="fa-solid fa-spinner fa-spin"></i> Submitting...</>
        ) : (
          <><i className="fa-solid fa-calendar-check"></i> Request Appointment</>
        )}
      </button>

      <p className={styles.note}>
        <i className="fa-solid fa-info-circle"></i>
        <span>
          We&apos;ll confirm your appointment via phone call. Please go through our <Link href="/disclaimer" style={{ color: 'var(--primary-color)', textDecoration: 'underline' }}>Disclaimer</Link> for more information.
        </span>
      </p>
    </form>
  );
}
