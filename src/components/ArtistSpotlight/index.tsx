import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { artists } from '../../data/artists';

gsap.registerPlugin(ScrollTrigger);

const accentMap = {
  cyan: 'var(--color-cyan)',
  magenta: 'var(--color-magenta)',
  gold: 'var(--color-gold)',
};

function CountUp({ target, duration = 1.4 }: { target: number; duration?: number }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const triggered = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || triggered.current) return;
      triggered.current = true;
      observer.disconnect();
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min((now - start) / (duration * 1000), 1);
        setDisplay(Math.round((1 - Math.pow(1 - p, 3)) * target));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.3 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return <span ref={ref}>{display}</span>;
}

export default function ArtistSpotlight() {
  const wrapRef = useRef<HTMLDivElement>(null);   // the outer wrapper we pin
  const trackRef = useRef<HTMLDivElement>(null);  // the sliding row of cards
  const headingRef = useRef<HTMLHeadingElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const stRef = useRef<ScrollTrigger | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Heading entrance
    gsap.fromTo([eyebrowRef.current, headingRef.current],
      { y: 35, opacity: 0 },
      {
        y: 0, opacity: 1, stagger: 0.1, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: eyebrowRef.current, start: 'top 88%' },
      }
    );

    if (prefersReducedMotion) return;

    // Wait a tick so layout is fully painted and scrollWidth is accurate
    const setupST = () => {
      const wrap = wrapRef.current;
      const track = trackRef.current;
      if (!wrap || !track) return;

      // Kill any previous instance
      stRef.current?.kill();

      const trackW = track.scrollWidth;
      const viewW  = wrap.offsetWidth;
      const dist   = trackW - viewW;          // total px to slide

      if (dist <= 0) return;                  // nothing to scroll

      stRef.current = ScrollTrigger.create({
        trigger: wrap,
        start: 'top top',
        // pin travels exactly as far as the cards need to slide, plus a short breathe
        end: () => `+=${dist + 80}`,
        pin: true,
        scrub: 1.2,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          gsap.set(track, { x: -dist * self.progress });
        },
      });
    };

    // Small RAF delay lets images begin loading so layout settles
    const id = requestAnimationFrame(() => setTimeout(setupST, 120));

    // Also refresh if window resizes
    const onResize = () => { ScrollTrigger.refresh(); };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(id);
      stRef.current?.kill();
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <section
      id="artists"
      style={{ background: 'var(--color-bg)', position: 'relative' }}
    >
      {/* ── Heading (scrolls normally, NOT pinned) ──────────────────────── */}
      <div style={{
        padding: 'clamp(5rem, 10vw, 8rem) clamp(2rem, 6vw, 6rem) 2.5rem',
      }}>
        <p ref={eyebrowRef} style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.65rem',
          letterSpacing: '0.25em',
          color: 'var(--color-gold)',
          textTransform: 'uppercase',
          marginBottom: '0.9rem',
          opacity: 0,
        }}>
          Contributing Artists
        </p>
        <h2 ref={headingRef} style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2.5rem, 6vw, 5rem)',
          letterSpacing: '0.04em',
          color: 'var(--color-white)',
          lineHeight: 1,
          opacity: 0,
        }}>
          The Makers
        </h2>
      </div>

      {/* ── Pinned horizontal-scroll wrapper ────────────────────────────── */}
      {/* NOTE: NO overflow:hidden here — that breaks GSAP pin spacer */}
      <div
        ref={wrapRef}
        style={{
          width: '100%',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          background: 'var(--color-bg)',
          willChange: 'transform',
        }}
      >
        {/* Scroll hint */}
        <div style={{
          position: 'absolute',
          bottom: '2rem',
          right: 'clamp(2rem, 6vw, 6rem)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          opacity: 0.35,
          pointerEvents: 'none',
        }}>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.55rem',
            letterSpacing: '0.2em',
            color: 'var(--color-white)',
            textTransform: 'uppercase',
          }}>
            Scroll to explore
          </span>
          <span style={{ color: 'var(--color-gold)', fontSize: '0.8rem' }}>→</span>
        </div>

        {/* Track — slides left via gsap.set in onUpdate */}
        <div
          ref={trackRef}
          style={{
            display: 'flex',
            gap: '2rem',
            padding: '0 clamp(2rem, 6vw, 6rem)',
            willChange: 'transform',
          }}
        >
          {artists.map((artist) => {
            const accent = accentMap[artist.accentColor];
            return (
              <div
                key={artist.id}
                data-cursor-hover
                style={{
                  width: 'clamp(300px, 28vw, 400px)',
                  flexShrink: 0,
                  background: 'var(--color-surface)',
                  borderRadius: 6,
                  border: '1px solid var(--color-border)',
                  overflow: 'hidden',
                  position: 'relative',
                  transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.borderColor = accent;
                  el.style.boxShadow = `0 0 50px ${accent}25`;
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.borderColor = 'var(--color-border)';
                  el.style.boxShadow = 'none';
                }}
              >
                {/* Photo */}
                <div style={{ height: 280, overflow: 'hidden', position: 'relative' }}>
                  <img
                    src={artist.imageUrl}
                    alt={artist.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to top, var(--color-surface) 0%, transparent 55%)',
                  }} />
                  {/* Neon accent corner stripe */}
                  <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0,
                    height: 3,
                    background: `linear-gradient(90deg, ${accent}, transparent)`,
                    boxShadow: `0 0 12px ${accent}`,
                  }} />
                  <div style={{
                    position: 'absolute', top: '1rem', left: '1rem',
                    fontFamily: 'var(--font-mono)', fontSize: '0.55rem',
                    letterSpacing: '0.12em', color: accent,
                    background: 'rgba(0,0,0,0.65)', padding: '0.3rem 0.7rem',
                    backdropFilter: 'blur(6px)', border: `1px solid ${accent}40`,
                    borderRadius: 2,
                  }}>
                    {artist.origin}
                  </div>
                </div>

                {/* Content */}
                <div style={{ padding: '1.5rem 1.75rem 1.75rem' }}>
                  <p style={{
                    fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
                    letterSpacing: '0.15em', color: accent,
                    textTransform: 'uppercase', marginBottom: '0.4rem',
                  }}>
                    {artist.specialty}
                  </p>
                  <h3 style={{
                    fontFamily: 'var(--font-display)', fontSize: '2rem',
                    letterSpacing: '0.04em', color: 'var(--color-white)',
                    lineHeight: 1, marginBottom: '0.9rem',
                  }}>
                    {artist.name}
                  </h3>
                  <p style={{
                    fontFamily: 'var(--font-body)', fontSize: '0.83rem',
                    lineHeight: 1.75, color: 'rgba(240,240,240,0.42)',
                    marginBottom: '1.5rem',
                  }}>
                    {artist.bio}
                  </p>

                  {/* Stats */}
                  <div style={{
                    display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '0.5rem', paddingTop: '1.25rem',
                    borderTop: '1px solid var(--color-border)',
                  }}>
                    {[
                      { label: 'Works',  value: artist.works },
                      { label: 'Shows',  value: artist.exhibitions },
                      { label: 'Colls.', value: artist.collections },
                    ].map(({ label, value }) => (
                      <div key={label} style={{ textAlign: 'center' }}>
                        <div style={{
                          fontFamily: 'var(--font-display)', fontSize: '1.9rem',
                          color: accent, lineHeight: 1,
                          textShadow: `0 0 18px ${accent}55`,
                        }}>
                          <CountUp target={value} />
                        </div>
                        <div style={{
                          fontFamily: 'var(--font-mono)', fontSize: '0.5rem',
                          letterSpacing: '0.14em', color: 'var(--color-muted)',
                          textTransform: 'uppercase', marginTop: '0.3rem',
                        }}>
                          {label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
