import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const SOCIAL_LINKS = [
  { label: 'Instagram', href: '#', icon: '◈' },
  { label: 'Twitter', href: '#', icon: '◉' },
  { label: 'Artsy', href: '#', icon: '◎' },
  { label: 'Foundation', href: '#', icon: '◐' },
];

const NAV_LINKS = [
  { label: 'About', href: '#' },
  { label: 'Exhibitions', href: '#' },
  { label: 'Artists', href: '#artists' },
  { label: 'Collection', href: '#gallery' },
  { label: 'Contact', href: '#' },
];

function MagneticButton({ label, href, icon }: { label: string; href: string; icon: string }) {
  const btnRef = useRef<HTMLAnchorElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const btn = btnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) * 0.35;
    const dy = (e.clientY - cy) * 0.35;
    gsap.to(btn, { x: dx, y: dy, duration: 0.3, ease: 'power2.out' });
  };

  const handleMouseLeave = () => {
    gsap.to(btnRef.current, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
  };

  return (
    <a
      ref={btnRef}
      href={href}
      data-cursor-hover
      title={label}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 44,
        height: 44,
        borderRadius: '50%',
        border: '1px solid var(--color-border)',
        color: 'var(--color-muted)',
        fontSize: '1.1rem',
        textDecoration: 'none',
        transition: 'color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
        willChange: 'transform',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLAnchorElement).style.color = 'var(--color-cyan)';
        (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--color-cyan)';
        (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 0 20px rgba(0,255,255,0.25)';
      }}
    >
      {icon}
    </a>
  );
}

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    gsap.fromTo(
      contentRef.current?.children ?? [],
      { y: 30, opacity: 0 },
      {
        y: 0, opacity: 1, stagger: 0.1, duration: 0.7, ease: 'power2.out',
        scrollTrigger: { trigger: footerRef.current, start: 'top 90%' },
      }
    );
  }, []);

  return (
    <footer
      ref={footerRef}
      style={{
        position: 'relative',
        background: 'var(--color-bg)',
        borderTop: '1px solid var(--color-border)',
        overflow: 'hidden',
      }}
    >
      {/* Subtle looping gradient animation in the background */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at 20% 100%, rgba(0,255,255,0.03) 0%, transparent 50%), radial-gradient(ellipse at 80% 100%, rgba(255,0,255,0.03) 0%, transparent 50%)',
        pointerEvents: 'none',
        animation: 'footerGlow 8s ease-in-out infinite alternate',
      }} />

      <style>{`
        @keyframes footerGlow {
          from { opacity: 0.5; }
          to   { opacity: 1; }
        }
      `}</style>

      {/* Glowing top divider line */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 1,
        background: 'linear-gradient(90deg, transparent 0%, var(--color-cyan) 30%, var(--color-magenta) 70%, transparent 100%)',
        boxShadow: '0 0 20px rgba(0,255,255,0.3)',
        opacity: 0.4,
      }} />

      <div
        ref={contentRef}
        style={{
          padding: 'clamp(4rem, 8vw, 6rem) clamp(2rem, 6vw, 6rem)',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '3rem',
          alignItems: 'start',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Brand column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.6rem',
            letterSpacing: '0.25em',
            color: 'var(--color-white)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}>
            <span style={{ color: 'var(--color-cyan)' }}>✦</span>
            VOID GALLERY
          </div>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.85rem',
            lineHeight: 1.7,
            color: 'var(--color-muted)',
            maxWidth: 260,
          }}>
            A permanent online collection of digital surrealism. Open 24 hours. Admission free. Reality optional.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            {SOCIAL_LINKS.map((link) => (
              <MagneticButton key={link.label} {...link} />
            ))}
          </div>
        </div>

        {/* Navigation column */}
        <div>
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.6rem',
            letterSpacing: '0.2em',
            color: 'var(--color-muted)',
            textTransform: 'uppercase',
            marginBottom: '1.5rem',
          }}>
            Navigate
          </p>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {NAV_LINKS.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                data-cursor-hover
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.9rem',
                  color: 'var(--color-muted)',
                  textDecoration: 'none',
                  transition: 'color 0.2s ease',
                  display: 'inline-block',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-white)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-muted)')}
              >
                {label}
              </a>
            ))}
          </nav>
        </div>

        {/* Newsletter / contact column */}
        <div>
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.6rem',
            letterSpacing: '0.2em',
            color: 'var(--color-muted)',
            textTransform: 'uppercase',
            marginBottom: '1.5rem',
          }}>
            Stay in the Void
          </p>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.85rem',
            color: 'var(--color-muted)',
            lineHeight: 1.6,
            marginBottom: '1.25rem',
          }}>
            New acquisitions and exhibition openings, straight to your inbox.
          </p>
          <div style={{ display: 'flex', gap: '0' }}>
            <input
              type="email"
              placeholder="your@email.com"
              style={{
                flex: 1,
                padding: '0.75rem 1rem',
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRight: 'none',
                color: 'var(--color-white)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                outline: 'none',
                borderRadius: '2px 0 0 2px',
              }}
            />
            <button
              data-cursor-hover
              style={{
                padding: '0.75rem 1.25rem',
                background: 'var(--color-cyan)',
                border: 'none',
                color: '#050508',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.65rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                fontWeight: 700,
                borderRadius: '0 2px 2px 0',
                transition: 'box-shadow 0.2s ease',
              }}
              onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 20px rgba(0,255,255,0.4)'}
              onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none'}
            >
              →
            </button>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{
        borderTop: '1px solid var(--color-border)',
        padding: '1.5rem clamp(2rem, 6vw, 6rem)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative',
        zIndex: 1,
      }}>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.6rem',
          letterSpacing: '0.12em',
          color: 'var(--color-muted)',
        }}>
          © {new Date().getFullYear()} Void Gallery. All dimensions reserved.
        </span>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.6rem',
          letterSpacing: '0.12em',
          color: 'var(--color-muted)',
        }}>
          Built with <span style={{ color: 'var(--color-magenta)' }}>✦</span> React + GSAP + Three.js
        </span>
      </div>
    </footer>
  );
}
