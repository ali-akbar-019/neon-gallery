import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Entrance animation — driven by master timeline via data attribute
    // The hero section will call this after its own entrance
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    gsap.from(navRef.current, {
      y: -60,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      delay: 0.2,
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
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1.5rem 4rem',
        background: 'linear-gradient(to bottom, rgba(5,5,8,0.95), transparent)',
        backdropFilter: 'blur(4px)',
      }}
    >
      {/* Logo */}
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: '1.4rem',
        letterSpacing: '0.25em',
        color: 'var(--color-white)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
      }}>
        <span style={{ color: 'var(--color-cyan)' }}>✦</span>
        VOID GALLERY
      </div>

      {/* Nav Links */}
      <div style={{ display: 'flex', gap: '3rem' }}>
        {[
          { label: 'Exhibition', id: 'featured' },
          { label: 'Gallery', id: 'gallery' },
          { label: 'Artists', id: 'artists' },
        ].map(({ label, id }) => (
          <button
            key={id}
            data-cursor-hover
            onClick={() => scrollTo(id)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-muted)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.7rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              transition: 'color 0.2s ease',
              padding: '0.25rem 0',
              position: 'relative',
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
        style={{
          padding: '0.6rem 1.5rem',
          background: 'transparent',
          border: '1px solid rgba(0,255,255,0.4)',
          color: 'var(--color-cyan)',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.65rem',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          borderRadius: 2,
          transition: 'all 0.25s ease',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,255,255,0.1)';
          (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--color-cyan)';
          (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 20px rgba(0,255,255,0.2)';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
          (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(0,255,255,0.4)';
          (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
        }}
      >
        Enter Gallery
      </button>
    </nav>
  );
}
