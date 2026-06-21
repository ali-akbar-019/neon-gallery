import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getLenis } from '../../hooks/useLenis';

gsap.registerPlugin(ScrollTrigger);

const SOCIAL_LINKS = [
  { label: 'Instagram', href: '#' },
  { label: 'Are.na',     href: '#' },
  { label: 'Artsy',      href: '#' },
];

const NAV_LINKS = [
  { label: 'Exhibition', href: '#featured' },
  { label: 'Collection', href: '#gallery'  },
  { label: 'Artists',    href: '#artists'  },
  { label: 'History',    href: '#timeline' },
  { label: 'Open Call',  href: '#open-call'},
];

export default function Footer() {
  const footerRef  = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;
    gsap.fromTo(contentRef.current?.children ?? [], { y: 24, opacity: 0 }, {
      y: 0, opacity: 1, stagger: 0.08, duration: 0.6, ease: 'power2.out',
      scrollTrigger: { trigger: footerRef.current, start: 'top 90%' },
    });
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith('#') || href === '#') return;
    e.preventDefault();
    const el = document.getElementById(href.slice(1));
    if (!el) return;
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(el, { duration: 1.4 });
    else el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer ref={footerRef} style={{ background: 'var(--color-ink)', borderTop: '1px solid var(--color-line)' }}>
      <div
        ref={contentRef}
        className="footer-grid"
        style={{
          padding: 'var(--space-2xl) var(--section-px) var(--space-xl)',
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr 1fr',
          gap: 'var(--space-lg)',
          alignItems: 'start',
        }}
      >
        {/* Brand column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.7rem' }}>Wall</div>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.88rem', lineHeight: 1.7, color: 'var(--color-clay)', maxWidth: 260 }}>
            A permanent online collection for digital surrealism. Open day and night. No ticket required.
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-md)', marginTop: '0.5rem' }}>
            {SOCIAL_LINKS.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--color-clay)', textDecoration: 'none', transition: 'color 0.2s ease' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-rust)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-clay)')}
              >
                {label}
              </a>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div>
          <p className="label" style={{ marginBottom: 'var(--space-md)' }}>Navigate</p>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
            {NAV_LINKS.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                onClick={(e) => handleNavClick(e, href)}
                style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--color-clay)', textDecoration: 'none', transition: 'color 0.2s ease' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-bone)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-clay)')}
              >
                {label}
              </a>
            ))}
          </nav>
        </div>

        {/* Newsletter */}
        <div>
          <p className="label" style={{ marginBottom: 'var(--space-md)' }}>Stay informed</p>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.88rem', color: 'var(--color-clay)', lineHeight: 1.6, marginBottom: 'var(--space-sm)' }}>
            New acquisitions and exhibition openings, straight to your inbox.
          </p>
          <div style={{ display: 'flex' }}>
            <input
              type="email"
              placeholder="your@email.com"
              style={{
                flex: 1, padding: '0.7rem 0.9rem',
                background: 'var(--color-surface)', border: '1px solid var(--color-line)', borderRight: 'none',
                color: 'var(--color-bone)', fontFamily: 'var(--font-body)', fontSize: '0.85rem', outline: 'none',
              }}
            />
            <button
              style={{
                padding: '0.7rem 1.1rem', background: 'var(--color-rust)', border: 'none',
                color: 'var(--color-ink)', fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s ease',
              }}
              onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = '#DA6440'}
              onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = 'var(--color-rust)'}
            >
              →
            </button>
          </div>
        </div>
      </div>

      <div style={{
        borderTop: '1px solid var(--color-line)', padding: 'var(--space-sm) var(--section-px)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem',
      }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--color-clay)' }}>
          © {new Date().getFullYear()} Wall. All rights reserved.
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--color-clay)' }}>
          Built with React + GSAP
        </span>
      </div>

      {/* Below 760px: 3 columns → 1, stacked. Below 480px the bottom bar's
          two lines (copyright + credit) wrap onto separate lines via
          flexWrap, already handled above. */}
      <style>{`
        @media (max-width: 760px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}
