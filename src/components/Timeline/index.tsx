import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const EVENTS = [
  {
    year: '2024',
    month: 'NOV',
    title: 'Neon Surrealism: Volume II',
    venue: 'Void Gallery — Online',
    description: 'Nine artists explore the intersection of machine dreaming and human grief. The collection\'s most ambitious exhibition to date.',
    accent: 'cyan',
    tag: 'Current',
  },
  {
    year: '2024',
    month: 'JUN',
    title: 'Signal / Noise',
    venue: 'Digital Arts Foundation, Berlin',
    description: 'A survey of glitch aesthetics and procedural entropy — featuring Dante Ferrara\'s acclaimed "Last Signal" series.',
    accent: 'magenta',
    tag: 'Group Show',
  },
  {
    year: '2024',
    month: 'MAR',
    title: 'Kira Nakamura: Interiors',
    venue: 'Void Gallery — Online',
    description: 'Solo debut from Nakamura. Fourteen impossible rooms. Every viewer reports a different door.',
    accent: 'gold',
    tag: 'Solo',
  },
  {
    year: '2023',
    month: 'OCT',
    title: 'Neon Surrealism: Volume I',
    venue: 'Void Gallery — Online',
    description: 'The inaugural exhibition that defined the gallery\'s voice. Sold-out digital prints within 48 hours.',
    accent: 'cyan',
    tag: 'Inaugural',
  },
  {
    year: '2023',
    month: 'MAY',
    title: 'Steppe Futures',
    venue: 'Almaty Digital Week',
    description: 'Asel Dzhaksybekov presents a two-year body of work exploring Kazakh mythology through neural aesthetics.',
    accent: 'magenta',
    tag: 'Solo',
  },
];

const accentMap: Record<string, string> = {
  cyan: 'var(--color-cyan)',
  magenta: 'var(--color-magenta)',
  gold: 'var(--color-gold)',
};

export default function Timeline() {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    gsap.fromTo(
      [eyebrowRef.current, headingRef.current],
      { y: 35, opacity: 0 },
      {
        y: 0, opacity: 1, stagger: 0.1, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: eyebrowRef.current, start: 'top 88%' },
      }
    );

    if (prefersReducedMotion) return;

    // Animate the vertical spine line growing downward
    gsap.fromTo(
      lineRef.current,
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 60%',
          end: 'bottom 80%',
          scrub: 1,
        },
      }
    );

    // Each event row slides in from alternating sides
    itemsRef.current.forEach((el, i) => {
      if (!el) return;
      const fromLeft = i % 2 === 0;
      gsap.fromTo(
        el,
        { x: fromLeft ? -50 : 50, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 0.75, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%' },
        }
      );
    });
  }, []);

  return (
    <section
      id="timeline"
      ref={sectionRef}
      style={{
        padding: 'clamp(5rem, 10vw, 8rem) clamp(2rem, 6vw, 6rem)',
        background: 'var(--color-bg-2)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle background texture */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse at 50% 0%, rgba(255,0,255,0.04) 0%, transparent 60%)',
      }} />

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 'clamp(3.5rem, 7vw, 6rem)' }}>
        <p ref={eyebrowRef} style={{
          fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
          letterSpacing: '0.25em', color: 'var(--color-magenta)',
          textTransform: 'uppercase', marginBottom: '0.9rem', opacity: 0,
        }}>
          Exhibition History
        </p>
        <h2 ref={headingRef} style={{
          fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 6vw, 5rem)',
          letterSpacing: '0.04em', color: 'var(--color-white)', lineHeight: 1, opacity: 0,
        }}>
          The Record
        </h2>
      </div>

      {/* Timeline */}
      <div style={{ position: 'relative', maxWidth: 900, margin: '0 auto' }}>
        {/* Vertical spine */}
        <div style={{
          position: 'absolute', left: '50%', top: 0, bottom: 0,
          width: 1, transform: 'translateX(-50%)',
          background: 'var(--color-border)',
        }}>
          <div
            ref={lineRef}
            style={{
              position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
              background: 'linear-gradient(to bottom, var(--color-cyan), var(--color-magenta), var(--color-gold))',
              transformOrigin: 'top center',
              boxShadow: '0 0 8px rgba(0,255,255,0.4)',
            }}
          />
        </div>

        {/* Events */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem' }}>
          {EVENTS.map((ev, i) => {
            const accent = accentMap[ev.accent];
            const isLeft = i % 2 === 0;

            return (
              <div
                key={i}
                ref={(el) => { itemsRef.current[i] = el; }}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 40px 1fr',
                  alignItems: 'center',
                  gap: '1.5rem',
                  opacity: 0,
                }}
              >
                {/* Left side content or spacer */}
                <div style={{
                  gridColumn: isLeft ? 1 : 3,
                  gridRow: 1,
                  background: 'var(--color-surface)',
                  border: `1px solid ${accent}30`,
                  borderRadius: 4,
                  padding: '1.5rem',
                  position: 'relative',
                  transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = accent;
                    (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 30px ${accent}18`;
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = `${accent}30`;
                    (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
                  }}
                >
                  {/* Accent top stripe */}
                  <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, height: 2,
                    background: accent, borderRadius: '4px 4px 0 0',
                    boxShadow: `0 0 8px ${accent}`,
                  }} />

                  {/* Tag + date */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <span style={{
                      fontFamily: 'var(--font-mono)', fontSize: '0.55rem',
                      letterSpacing: '0.15em', color: accent, textTransform: 'uppercase',
                      border: `1px solid ${accent}50`, padding: '0.2rem 0.5rem', borderRadius: 2,
                    }}>
                      {ev.tag}
                    </span>
                    <span style={{
                      fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
                      letterSpacing: '0.1em', color: 'var(--color-muted)',
                    }}>
                      {ev.month} {ev.year}
                    </span>
                  </div>

                  <h3 style={{
                    fontFamily: 'var(--font-display)', fontSize: '1.4rem',
                    letterSpacing: '0.04em', color: 'var(--color-white)',
                    lineHeight: 1.1, marginBottom: '0.5rem',
                  }}>
                    {ev.title}
                  </h3>
                  <p style={{
                    fontFamily: 'var(--font-mono)', fontSize: '0.58rem',
                    letterSpacing: '0.1em', color: accent, opacity: 0.8,
                    marginBottom: '0.75rem', textTransform: 'uppercase',
                  }}>
                    {ev.venue}
                  </p>
                  <p style={{
                    fontFamily: 'var(--font-body)', fontSize: '0.83rem',
                    lineHeight: 1.7, color: 'rgba(240,240,240,0.42)',
                  }}>
                    {ev.description}
                  </p>
                </div>

                {/* Center dot */}
                <div style={{
                  gridColumn: 2, gridRow: 1,
                  display: 'flex', justifyContent: 'center', alignItems: 'center',
                  zIndex: 2,
                }}>
                  <div style={{
                    width: 14, height: 14, borderRadius: '50%',
                    background: accent,
                    boxShadow: `0 0 16px ${accent}, 0 0 40px ${accent}50`,
                    border: '2px solid var(--color-bg-2)',
                  }} />
                </div>

                {/* Empty grid cell for the other side */}
                <div style={{ gridColumn: isLeft ? 3 : 1, gridRow: 1 }} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
