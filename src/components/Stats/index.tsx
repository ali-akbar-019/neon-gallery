import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { value: 172, suffix: '+', label: 'Works in Collection', accent: 'cyan' },
  { value: 32, suffix: '', label: 'Solo Exhibitions', accent: 'magenta' },
  { value: 4, suffix: '', label: 'Resident Artists', accent: 'gold' },
  { value: 12, suffix: 'K+', label: 'Monthly Visitors', accent: 'cyan' },
];

const accentMap: Record<string, string> = {
  cyan: 'var(--color-cyan)',
  magenta: 'var(--color-magenta)',
  gold: 'var(--color-gold)',
};

function StatItem({
  value,
  suffix,
  label,
  accent,
  index,
}: {
  value: number;
  suffix: string;
  label: string;
  accent: string;
  index: number;
}) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const color = accentMap[accent];

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();

        if (prefersReducedMotion) { setDisplay(value); return; }

        const delay = index * 120;
        setTimeout(() => {
          const start = performance.now();
          const duration = 1600;
          const animate = (now: number) => {
            const p = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 4);
            setDisplay(Math.round(eased * value));
            if (p < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }, delay);
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [value, index]);

  return (
    <div
      ref={ref}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '3rem 2rem',
        borderRight: '1px solid var(--color-border)',
        position: 'relative',
      }}
    >
      {/* Subtle background glow */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `radial-gradient(ellipse at center, ${color}08 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'clamp(3.5rem, 7vw, 6rem)',
        lineHeight: 1,
        color,
        textShadow: `0 0 40px ${color}60, 0 0 80px ${color}20`,
        letterSpacing: '0.02em',
      }}>
        {display}{suffix}
      </div>

      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.65rem',
        letterSpacing: '0.2em',
        color: 'var(--color-muted)',
        textTransform: 'uppercase',
        textAlign: 'center',
      }}>
        {label}
      </div>

      {/* Bottom accent */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 40,
        height: 2,
        background: color,
        boxShadow: `0 0 10px ${color}`,
      }} />
    </div>
  );
}

export default function Stats() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    gsap.fromTo(
      headingRef.current,
      { y: 30, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: headingRef.current, start: 'top 85%' },
      }
    );
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        background: 'var(--color-surface)',
        borderTop: '1px solid var(--color-border)',
        borderBottom: '1px solid var(--color-border)',
      }}
    >
      {/* Heading */}
      <div
        ref={headingRef}
        style={{
          textAlign: 'center',
          padding: 'clamp(3rem, 6vw, 5rem) 2rem 0',
          opacity: 0,
        }}
      >
        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.65rem',
          letterSpacing: '0.25em',
          color: 'var(--color-muted)',
          textTransform: 'uppercase',
          marginBottom: '0.5rem',
        }}>
          By the Numbers
        </p>
      </div>

      {/* Stats grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
      }}>
        {STATS.map((stat, i) => (
          <StatItem key={stat.label} {...stat} index={i} />
        ))}
      </div>
    </section>
  );
}
