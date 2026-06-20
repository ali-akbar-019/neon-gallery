import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { getLenis } from '../../hooks/useLenis';

const LINKS = [
  { label: 'Exhibition', id: 'featured' },
  { label: 'Collection', id: 'gallery'  },
  { label: 'Artists',    id: 'artists'  },
  { label: 'History',    id: 'timeline' },
  { label: 'Open Call',  id: 'open-call'},
];

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const nav = navRef.current;
    if (!nav || prefersReducedMotion) return;

    // Use set + to (not gsap.from) so the animation is explicit and
    // controllable, and always kill any previous tween on this node first.
    // Without this, React StrictMode's intentional double-invoke of effects
    // (mount → cleanup → mount) could leave two competing tweens on the
    // same element, or interrupt the entrance mid-way and leave the navbar
    // stuck at opacity: 0 — which is exactly what "navbar is hidden" looks like.
    gsap.killTweensOf(nav);
    gsap.set(nav, { y: -40, opacity: 0 });
    const tween = gsap.to(nav, { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out', delay: 0.1 });

    return () => {
      tween.kill();
      // Ensure the nav is left in a fully visible, natural state if this
      // effect is torn down mid-animation (e.g. StrictMode's extra cycle).
      gsap.set(nav, { y: 0, opacity: 1, clearProps: 'transform' });
    };
  }, []);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (!el) return;
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(el, { duration: 1.3 });
    else el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav
      ref={navRef}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: '1rem',
        padding: '1.25rem clamp(1.25rem, 5vw, 6rem)',
        background: 'linear-gradient(to bottom, rgba(11,11,12,0.94), transparent)',
        backdropFilter: 'blur(6px)',
      }}
    >
      {/* Wordmark — fixed-content, never shrinks */}
      <div style={{
        fontFamily: 'var(--font-display)', fontSize: '1.5rem',
        letterSpacing: '0.01em', color: 'var(--color-bone)',
        flexShrink: 0,
      }}>
        Wall
      </div>

      {/* Nav links — hidden below 880px, shown as a simple menu instead.
          flexShrink:0 on each link plus a min-width-aware wrapper stops
          them from ever overlapping the logo or CTA. */}
      <div
        className="nav-links-desktop"
        style={{
          display: 'flex', gap: 'clamp(1rem, 2.5vw, 2.25rem)',
          flexWrap: 'nowrap', flexShrink: 1, justifyContent: 'center', minWidth: 0,
        }}
      >
        {LINKS.map(({ label, id }) => (
          <button
            key={id}
            onClick={() => scrollTo(id)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--color-clay)', fontFamily: 'var(--font-body)',
              fontSize: '0.85rem', transition: 'color 0.2s ease', padding: '0.25rem 0',
              whiteSpace: 'nowrap', flexShrink: 0,
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-bone)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-clay)')}
          >
            {label}
          </button>
        ))}
      </div>

      {/* CTA — fixed-content, never shrinks, never wraps */}
      <button
        onClick={() => scrollTo('open-call')}
        className="nav-cta-desktop"
        style={{
          padding: '0.55rem 1.3rem', background: 'transparent', cursor: 'pointer',
          border: '1px solid var(--color-line)', color: 'var(--color-bone)',
          fontFamily: 'var(--font-body)', fontSize: '0.82rem', fontWeight: 500,
          borderRadius: 2, transition: 'all 0.2s ease',
          whiteSpace: 'nowrap', flexShrink: 0,
        }}
        onMouseEnter={e => {
          const b = e.currentTarget as HTMLButtonElement;
          b.style.borderColor = 'var(--color-rust)';
          b.style.color = 'var(--color-rust)';
        }}
        onMouseLeave={e => {
          const b = e.currentTarget as HTMLButtonElement;
          b.style.borderColor = 'var(--color-line)';
          b.style.color = 'var(--color-bone)';
        }}
      >
        Submit Work
      </button>

      {/* Mobile menu toggle — shown only below 880px via CSS below */}
      <button
        className="nav-menu-toggle"
        onClick={() => setMenuOpen(v => !v)}
        aria-label="Toggle menu"
        style={{
          display: 'none', background: 'none', border: '1px solid var(--color-line)',
          color: 'var(--color-bone)', borderRadius: 2, padding: '0.5rem 0.75rem',
          fontFamily: 'var(--font-mono)', fontSize: '0.75rem', cursor: 'pointer', flexShrink: 0,
        }}
      >
        {menuOpen ? 'Close' : 'Menu'}
      </button>

      {/* Mobile dropdown panel */}
      {menuOpen && (
        <div
          className="nav-mobile-panel"
          style={{
            position: 'absolute', top: '100%', left: 0, right: 0,
            background: 'var(--color-ink)', borderTop: '1px solid var(--color-line)',
            borderBottom: '1px solid var(--color-line)',
            display: 'flex', flexDirection: 'column', padding: '1rem clamp(1.25rem, 5vw, 6rem)',
            gap: '0.75rem',
          }}
        >
          {LINKS.map(({ label, id }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
                color: 'var(--color-clay)', fontFamily: 'var(--font-body)', fontSize: '0.95rem',
                padding: '0.5rem 0',
              }}
            >
              {label}
            </button>
          ))}
          <button
            onClick={() => scrollTo('open-call')}
            style={{
              padding: '0.65rem 1.3rem', background: 'var(--color-rust)', border: 'none',
              color: 'var(--color-ink)', fontFamily: 'var(--font-body)', fontSize: '0.9rem',
              fontWeight: 600, borderRadius: 2, cursor: 'pointer', marginTop: '0.5rem',
            }}
          >
            Submit Work
          </button>
        </div>
      )}

      {/* Responsive rules: collapse to a hamburger below 880px so links
          never run out of room and collide with the logo or CTA. */}
      <style>{`
        @media (max-width: 880px) {
          .nav-links-desktop, .nav-cta-desktop { display: none !important; }
          .nav-menu-toggle { display: inline-flex !important; }
        }
      `}</style>
    </nav>
  );
}
