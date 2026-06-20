import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { value: 172, suffix: '+', label: 'Works in collection' },
  { value: 32,  suffix: '',  label: 'Solo exhibitions' },
  { value: 4,   suffix: '',  label: 'Resident artists' },
  { value: 12,  suffix: 'K+', label: 'Monthly visitors' },
];

function StatItem({ value, suffix, label, index }: {
  value: number; suffix: string; label: string; index: number;
}) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      if (prefersReducedMotion) { setDisplay(value); return; }

      setTimeout(() => {
        const start = performance.now();
        const duration = 1400;
        const animate = (now: number) => {
          const p = Math.min((now - start) / duration, 1);
          setDisplay(Math.round((1 - Math.pow(1 - p, 4)) * value));
          if (p < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
      }, index * 100);
    }, { threshold: 0.4 });

    observer.observe(el);
    return () => observer.disconnect();
  }, [value, index]);

  return (
    <div
      ref={ref}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem',
        padding: 'var(--space-lg) var(--space-md)',
        borderRight: '1px solid var(--color-line)',
      }}
    >
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.8rem, 5.5vw, 4.5rem)', lineHeight: 1, color: 'var(--color-bone)' }}>
        {display}{suffix}
      </div>
      <div className="label">{label}</div>
    </div>
  );
}

export default function Stats() {
  const headingRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;
    gsap.fromTo(headingRef.current, { y: 24, opacity: 0 }, {
      y: 0, opacity: 1, duration: 0.7, ease: 'power2.out',
      scrollTrigger: { trigger: headingRef.current, start: 'top 85%' },
    });
  }, []);

  return (
    <section style={{ background: 'var(--color-surface)', borderTop: '1px solid var(--color-line)', borderBottom: '1px solid var(--color-line)' }}>
      <div style={{ textAlign: 'center', padding: 'var(--space-lg) var(--space-md) 0' }}>
        <p ref={headingRef} className="label" style={{ opacity: 0 }}>By the numbers</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
        {STATS.map((stat, i) => (
          <StatItem key={stat.label} {...stat} index={i} />
        ))}
      </div>
    </section>
  );
}
