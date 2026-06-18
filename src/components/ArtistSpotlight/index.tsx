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

function CountUp({ target, duration = 1.5, suffix = '' }: { target: number; duration?: number; suffix?: string }) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();

      const start = performance.now();
      const animate = (now: number) => {
        const progress = Math.min((now - start) / (duration * 1000), 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(Math.round(eased * target));
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }, { threshold: 0.5 });

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return <span ref={ref}>{value}{suffix}</span>;
}

export default function ArtistSpotlight() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    gsap.fromTo(
      headingRef.current,
      { y: 40, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: headingRef.current, start: 'top 85%' },
      }
    );

    const ctx = gsap.context(() => {
      const cards = trackRef.current!;
      const totalWidth = cards.scrollWidth - cards.offsetWidth;

      // Horizontal scroll driven by vertical scroll (pinned section)
      gsap.to(cards, {
        x: () => -totalWidth,
        ease: 'none',
        scrollTrigger: {
          trigger: pinRef.current,
          start: 'top top',
          end: () => `+=${totalWidth + window.innerHeight * 0.5}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="artists"
      ref={sectionRef}
      style={{ background: 'var(--color-bg)' }}
    >
      {/* Section header — NOT pinned */}
      <div style={{
        padding: 'clamp(5rem, 10vw, 8rem) clamp(2rem, 6vw, 6rem) 3rem',
      }}>
        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.65rem',
          letterSpacing: '0.25em',
          color: 'var(--color-gold)',
          textTransform: 'uppercase',
          marginBottom: '1rem',
        }}>
          Contributing Artists
        </p>
        <h2
          ref={headingRef}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.5rem, 6vw, 5rem)',
            letterSpacing: '0.04em',
            color: 'var(--color-white)',
            lineHeight: 1,
            opacity: 0,
          }}
        >
          The Makers
        </h2>
      </div>

      {/* Pinned horizontal scroll container */}
      <div ref={pinRef} style={{ overflow: 'hidden' }}>
        <div
          ref={trackRef}
          style={{
            display: 'flex',
            gap: '2rem',
            padding: '2rem clamp(2rem, 6vw, 6rem)',
            width: 'max-content',
          }}
        >
          {artists.map((artist) => {
            const accent = accentMap[artist.accentColor];
            return (
              <div
                key={artist.id}
                data-cursor-hover
                style={{
                  width: 'min(80vw, 380px)',
                  flexShrink: 0,
                  background: 'var(--color-surface)',
                  borderRadius: 4,
                  border: '1px solid var(--color-border)',
                  overflow: 'hidden',
                  position: 'relative',
                  transition: 'border-color 0.3s ease',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = accent;
                  (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 40px ${accent}20`;
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--color-border)';
                  (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
                }}
              >
                {/* Image */}
                <div style={{ height: 260, overflow: 'hidden', position: 'relative' }}>
                  <img
                    src={artist.imageUrl}
                    alt={artist.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, var(--color-surface) 0%, transparent 60%)',
                  }} />
                  {/* Origin badge */}
                  <div style={{
                    position: 'absolute',
                    top: '1rem',
                    left: '1rem',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.55rem',
                    letterSpacing: '0.12em',
                    color: accent,
                    background: 'rgba(0,0,0,0.6)',
                    padding: '0.3rem 0.6rem',
                    backdropFilter: 'blur(4px)',
                    border: `1px solid ${accent}40`,
                  }}>
                    {artist.origin}
                  </div>
                </div>

                {/* Content */}
                <div style={{ padding: '1.5rem' }}>
                  <p style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.6rem',
                    letterSpacing: '0.15em',
                    color: accent,
                    textTransform: 'uppercase',
                    marginBottom: '0.4rem',
                  }}>
                    {artist.specialty}
                  </p>
                  <h3 style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.8rem',
                    letterSpacing: '0.05em',
                    color: 'var(--color-white)',
                    marginBottom: '1rem',
                    lineHeight: 1,
                  }}>
                    {artist.name}
                  </h3>
                  <p style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.85rem',
                    lineHeight: 1.7,
                    color: 'rgba(240,240,240,0.45)',
                    marginBottom: '1.5rem',
                  }}>
                    {artist.bio}
                  </p>

                  {/* Animated stats */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '0.75rem',
                    paddingTop: '1.25rem',
                    borderTop: '1px solid var(--color-border)',
                  }}>
                    {[
                      { label: 'Works', value: artist.works },
                      { label: 'Shows', value: artist.exhibitions },
                      { label: 'Collections', value: artist.collections },
                    ].map(({ label, value }) => (
                      <div key={label} style={{ textAlign: 'center' }}>
                        <div style={{
                          fontFamily: 'var(--font-display)',
                          fontSize: '1.8rem',
                          color: accent,
                          lineHeight: 1,
                          textShadow: `0 0 20px ${accent}60`,
                        }}>
                          <CountUp target={value} />
                        </div>
                        <div style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.55rem',
                          letterSpacing: '0.12em',
                          color: 'var(--color-muted)',
                          textTransform: 'uppercase',
                          marginTop: '0.3rem',
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
