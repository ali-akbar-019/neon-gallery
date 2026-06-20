import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { getLenis } from '../../hooks/useLenis';

// ── Hero: a quiet, confident gallery-poster moment. ──────────────────────
// No 3D scene, no particle field, no glitch type. The signature move here
// is editorial: a single real artwork crop sits behind large serif type,
// the way a gallery's own homepage would open on its current show.

export default function Hero() {
  const labelRef    = useRef<HTMLParagraphElement>(null);
  const lineRefs    = useRef<(HTMLSpanElement | null)[]>([]);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef      = useRef<HTMLDivElement>(null);
  const imageRef    = useRef<HTMLDivElement>(null);
  const metaRef     = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const tl = gsap.timeline({ delay: 0.2 });

    tl.fromTo(labelRef.current,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
    );

    // Headline lines rise in like a poster being unveiled — one clean
    // motion, not a typewriter or glitch effect.
    tl.fromTo(lineRefs.current,
      { yPercent: 110, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 1, stagger: 0.1, ease: 'power3.out' },
      0.15,
    );

    tl.fromTo(imageRef.current,
      { opacity: 0, scale: 1.04 },
      { opacity: 1, scale: 1, duration: 1.3, ease: 'power2.out' },
      0.1,
    );

    tl.fromTo(subtitleRef.current,
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' },
      0.65,
    );

    tl.fromTo(ctaRef.current,
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' },
      0.78,
    );

    tl.fromTo(metaRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.8, ease: 'power2.out' },
      0.9,
    );
  }, []);

  const scrollToGallery = () => {
    const el = document.getElementById('featured');
    if (!el) return;
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(el, { duration: 1.4 });
    else el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section style={{
      position: 'relative',
      minHeight: '100vh',
      display: 'grid',
      gridTemplateColumns: '1.1fr 1fr',
      alignItems: 'stretch',
      background: 'var(--color-ink)',
      overflow: 'hidden',
    }}>
      {/* Left — type column */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: 'clamp(5rem, 8vw, 7rem) clamp(1.5rem, 5vw, 5rem)',
        position: 'relative',
        zIndex: 2,
      }}>
        <p ref={labelRef} className="label" style={{ color: 'var(--color-rust)', marginBottom: 'var(--space-md)', opacity: 0 }}>
          Current Exhibition — Spring 2025
        </p>

        <h1 style={{ marginBottom: 'var(--space-md)' }}>
          {['Rooms that', 'should not', <>exist<span className="accent">.</span></>].map((line, i) => (
            <span key={i} style={{ display: 'block', overflow: 'hidden' }}>
              <span
                ref={(el) => { lineRefs.current[i] = el; }}
                style={{ display: 'inline-block', opacity: 0 }}
              >
                {line}
              </span>
            </span>
          ))}
        </h1>

        <p ref={subtitleRef} className="body-lg" style={{ maxWidth: 440, marginBottom: 'var(--space-lg)', opacity: 0 }}>
          Five digital artists. One impossible architecture. Wall is a permanent
          collection for work that lives only on screens — open day and night, no ticket required.
        </p>

        <div ref={ctaRef} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', opacity: 0 }}>
          <button
            onClick={scrollToGallery}
            style={{
              padding: '0.95rem 2.2rem',
              background: 'var(--color-rust)',
              border: 'none',
              color: 'var(--color-ink)',
              fontFamily: 'var(--font-body)',
              fontSize: '0.92rem',
              fontWeight: 600,
              borderRadius: 2,
              transition: 'background 0.25s ease, transform 0.25s ease',
              cursor: 'pointer',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#DA6440'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--color-rust)'; }}
          >
            View the Collection
          </button>
          <span className="label" style={{ color: 'var(--color-clay)' }}>
            Free admission
          </span>
        </div>

        {/* Quiet meta row — gallery hours, like a real gallery footer-of-hero */}
        <div ref={metaRef} style={{
          display: 'flex', gap: 'var(--space-lg)', marginTop: 'var(--space-2xl)', opacity: 0,
        }}>
          {[
            ['Hours', 'Always open'],
            ['Location', 'Online, everywhere'],
            ['Est.', '2024'],
          ].map(([k, v]) => (
            <div key={k}>
              <p className="label" style={{ marginBottom: '0.35rem' }}>{k}</p>
              <p style={{ fontSize: '0.88rem', color: 'var(--color-bone)' }}>{v}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right — single artwork crop, quiet and large, like a gallery poster */}
      <div
        ref={imageRef}
        style={{
          position: 'relative',
          opacity: 0,
          overflow: 'hidden',
          borderLeft: '1px solid var(--color-line)',
        }}
      >
        <img
          src="https://picsum.photos/seed/wallhero/1200/1600"
          alt="Featured work from the current exhibition"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        {/* Subtle warm grade so the photo sits inside our palette rather
            than fighting it */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, rgba(11,11,12,0.15) 0%, rgba(11,11,12,0.05) 40%, rgba(11,11,12,0.65) 100%)',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'var(--color-rust)',
          mixBlendMode: 'color',
          opacity: 0.12,
        }} />

        {/* Caption, like a wall label beside a hung piece */}
        <div style={{
          position: 'absolute', bottom: 'var(--space-lg)', left: 'var(--space-lg)', right: 'var(--space-lg)',
        }}>
          <p className="label" style={{ color: 'rgba(245,243,238,0.7)', marginBottom: '0.4rem' }}>
            Fractured Dreamscape — Kira Nakamura, 2024
          </p>
        </div>
      </div>
    </section>
  );
}
