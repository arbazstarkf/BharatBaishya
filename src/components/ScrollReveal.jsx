'use client';

import { useEffect, useRef } from 'react';

export default function ScrollReveal({
  children,
  className = '',
  direction = 'up', // up, left, right
  delay = 0,
  threshold = 0.15,
}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            el.classList.add('revealed');
          }, delay);
          observer.unobserve(el);
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay, threshold]);

  const directionClass = {
    up: 'reveal',
    left: 'reveal-left',
    right: 'reveal-right',
  }[direction] || 'reveal';

  return (
    <div ref={ref} className={`${directionClass} ${className}`}>
      {children}
    </div>
  );
}
