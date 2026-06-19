import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;
    gsap.from(navRef.current, {
      y: -60, opacity: 0, duration: 1, ease: 'power3.out', delay: 0.2,
    });
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav
      ref={navRef}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '1.4rem 4rem',
        background: 'linear-gradient(to bottom, rgba(5,5,8,0.96), transparent)',
        backdropFilter: 'blur(6px)',
      }}
    >
      {/* Logo */}
      <div style={{
        fontFamily: 'var(--font-display)', fontSize: '1.4rem',
        letterSpacing: '0.25em', color: 'var(--color-white)',
        display: 'flex', alignItems: 'center', gap: '0.5rem',
      }}>
        <span style={{ color: 'var(--color-cyan)' }}>✦</span>
        VOID GALLERY
      </div>

      {/* Nav links */}
      <div style={{ display: 'flex', gap: '2.5rem' }}>
        {[
          { label: 'Exhibition', id: 'featured' },
          { label: 'Gallery',    id: 'gallery'  },
          { label: 'Artists',    id: 'artists'  },
          { label: 'Timeline',   id: 'timeline' },
          { label: 'Open Call',  id: 'open-call'},
        ].map(({ label, id }) => (
          <button
            key={id}
            data-cursor-hover
            onClick={() => scrollTo(id)}
            style={{
              background: 'none', border: 'none',
              color: 'var(--color-muted)', fontFamily: 'var(--font-mono)',
              fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase',
              transition: 'color 0.2s ease', padding: '0.25rem 0',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-white)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-muted)')}
          >
            {label}
          </button>
        ))}
      </div>

      {/* CTA */}
      <button
        data-cursor-hover
        onClick={() => scrollTo('open-call')}
        style={{
          padding: '0.6rem 1.4rem', background: 'transparent',
          border: '1px solid rgba(0,255,255,0.4)', color: 'var(--color-cyan)',
          fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
          letterSpacing: '0.15em', textTransform: 'uppercase', borderRadius: 2,
          transition: 'all 0.25s ease',
        }}
        onMouseEnter={e => {
          const b = e.currentTarget as HTMLButtonElement;
          b.style.background = 'rgba(0,255,255,0.08)';
          b.style.borderColor = 'var(--color-cyan)';
          b.style.boxShadow  = '0 0 20px rgba(0,255,255,0.2)';
        }}
        onMouseLeave={e => {
          const b = e.currentTarget as HTMLButtonElement;
          b.style.background = 'transparent';
          b.style.borderColor = 'rgba(0,255,255,0.4)';
          b.style.boxShadow  = 'none';
        }}
      >
        Submit Work
      </button>
    </nav>
  );
}
