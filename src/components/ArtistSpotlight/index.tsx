import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { artists } from '../../data/artists';

gsap.registerPlugin(ScrollTrigger);

// ── The Makers ──────────────────────────────────────────────────────────
// No horizontal-scroll pin. Instead: a static asymmetric grid that reads
// like four works actually hung on a gallery wall — varying card heights,
// simple scroll-reveal, hover lift. Calm, confident, no forced mechanic.

function CountUp({ target, duration = 1.2 }: { target: number; duration?: number }) {
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

// Each card gets a different height to mimic a real salon-style hang.
const SPAN: Record<number, string> = {
  0: 'tall',
  1: 'short',
  2: 'short',
  3: 'tall',
};

export default function ArtistSpotlight() {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const cardsRef   = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    gsap.fromTo([eyebrowRef.current, headingRef.current],
      { y: 24, opacity: 0 },
      {
        y: 0, opacity: 1, stagger: 0.08, duration: 0.7, ease: 'power2.out',
        scrollTrigger: { trigger: eyebrowRef.current, start: 'top 88%' },
      }
    );

    if (prefersReducedMotion) return;

    cardsRef.current.forEach((el, i) => {
      if (!el) return;
      gsap.fromTo(el,
        { y: 36, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.7, ease: 'power2.out', delay: (i % 2) * 0.08,
          scrollTrigger: { trigger: el, start: 'top 92%' },
        }
      );
    });
  }, []);

  return (
    <section id="artists" className="section-pad" style={{ background: 'var(--color-ink)' }}>
      {/* Header */}
      <div style={{ marginBottom: 'var(--space-xl)', maxWidth: 640 }}>
        <p ref={eyebrowRef} className="label" style={{ color: 'var(--color-rust)', marginBottom: 'var(--space-sm)', opacity: 0 }}>
          The Makers
        </p>
        <h2 ref={headingRef} style={{ opacity: 0 }}>
          Four practices,<br />one wall.
        </h2>
      </div>

      {/* Asymmetric gallery-wall grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 'var(--space-md)',
      }}>
        {artists.map((artist, i) => {
          const tall = SPAN[i] === 'tall';
          return (
            <div
              key={artist.id}
              ref={(el) => { cardsRef.current[i] = el; }}
              style={{
                gridRow: tall ? 'span 2' : 'span 1',
                background: 'var(--color-surface)',
                border: '1px solid var(--color-line)',
                display: 'flex',
                flexDirection: 'column',
                opacity: 0,
                transition: 'border-color 0.3s ease, transform 0.3s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.borderColor = 'var(--color-rust)';
                el.style.transform = 'translateY(-4px)';
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.borderColor = 'var(--color-line)';
                el.style.transform = 'translateY(0)';
              }}
            >
              {/* Photo */}
              <div style={{
                position: 'relative',
                aspectRatio: tall ? '3/4' : '4/3',
                overflow: 'hidden',
                borderBottom: '1px solid var(--color-line)',
              }}>
                <img
                  src={artist.imageUrl}
                  alt={artist.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(180deg, transparent 60%, rgba(11,11,12,0.5) 100%)',
                }} />
                <p className="label" style={{
                  position: 'absolute', top: 'var(--space-sm)', left: 'var(--space-sm)',
                  color: 'var(--color-bone)',
                }}>
                  {artist.origin}
                </p>
              </div>

              {/* Content */}
              <div style={{ padding: 'var(--space-sm)', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <p className="label" style={{ color: 'var(--color-rust)', marginBottom: '0.4rem' }}>
                  {artist.specialty}
                </p>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '0.6rem' }}>{artist.name}</h3>
                <p style={{
                  fontFamily: 'var(--font-body)', fontSize: '0.85rem',
                  lineHeight: 1.65, color: 'var(--color-clay)', flex: 1,
                }}>
                  {artist.bio}
                </p>

                <div style={{
                  display: 'flex', gap: 'var(--space-md)', paddingTop: 'var(--space-sm)',
                  marginTop: 'var(--space-sm)', borderTop: '1px solid var(--color-line)',
                }}>
                  {[
                    { label: 'Works', value: artist.works },
                    { label: 'Shows', value: artist.exhibitions },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--color-bone)' }}>
                        <CountUp target={value} />
                      </div>
                      <div className="label" style={{ fontSize: '0.6rem' }}>{label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
