'use client';

import { useEffect, useRef, useState } from 'react';

export default function AnimatedCounter({ end, duration = 2000, suffix = '', prefix = '', label }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const startTime = performance.now();

          const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * end));

            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [end, duration]);

  return (
    <div ref={ref} style={{ textAlign: 'center' }}>
      <div style={{
        fontSize: 'clamp(2rem, 4vw, 3rem)',
        fontWeight: 700,
        fontFamily: 'var(--font-josefin)',
        background: 'var(--gradient-primary)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        lineHeight: 1.1,
      }}>
        {prefix}{count}{suffix}
      </div>
      {label && (
        <p style={{
          fontSize: '0.9rem',
          color: 'var(--text-secondary)',
          marginTop: '0.5rem',
          fontWeight: 500,
        }}>
          {label}
        </p>
      )}
    </div>
  );
}
