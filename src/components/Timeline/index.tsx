import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const EVENTS = [
  {
    year: '2025', month: 'MAR',
    title: 'Improbable Architectures',
    venue: 'Wall — Online',
    description: 'Nine artists explore the intersection of machine dreaming and human grief. The collection\u2019s most ambitious exhibition to date.',
    tag: 'Current',
  },
  {
    year: '2024', month: 'NOV',
    title: 'Signal / Noise',
    venue: 'Digital Arts Foundation, Berlin',
    description: 'A survey of glitch aesthetics and procedural entropy, featuring Dante Ferrara\u2019s acclaimed Last Signal series.',
    tag: 'Group Show',
  },
  {
    year: '2024', month: 'MAR',
    title: 'Kira Nakamura: Interiors',
    venue: 'Wall — Online',
    description: 'Solo debut from Nakamura. Fourteen impossible rooms. Every viewer reports a different door.',
    tag: 'Solo',
  },
  {
    year: '2023', month: 'OCT',
    title: 'Opening Collection',
    venue: 'Wall — Online',
    description: 'The inaugural exhibition that defined the gallery\u2019s voice. Sold out within forty-eight hours.',
    tag: 'Inaugural',
  },
  {
    year: '2023', month: 'MAY',
    title: 'Steppe Futures',
    venue: 'Almaty Digital Week',
    description: 'Asel Dzhaksybekov presents a two-year body of work exploring Kazakh mythology through neural aesthetics.',
    tag: 'Solo',
  },
];

export default function Timeline() {
  const sectionRef  = useRef<HTMLElement>(null);
  const lineRef     = useRef<HTMLDivElement>(null);
  const headingRef  = useRef<HTMLHeadingElement>(null);
  const eyebrowRef  = useRef<HTMLParagraphElement>(null);
  const itemsRef    = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    gsap.fromTo([eyebrowRef.current, headingRef.current],
      { y: 28, opacity: 0 },
      {
        y: 0, opacity: 1, stagger: 0.08, duration: 0.7, ease: 'power2.out',
        scrollTrigger: { trigger: eyebrowRef.current, start: 'top 88%' },
      }
    );

    if (prefersReducedMotion) return;

    gsap.fromTo(lineRef.current, { scaleY: 0 }, {
      scaleY: 1, ease: 'none',
      scrollTrigger: { trigger: sectionRef.current, start: 'top 60%', end: 'bottom 80%', scrub: 1 },
    });

    itemsRef.current.forEach((el) => {
      if (!el) return;
      gsap.fromTo(el, { y: 24, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.6, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 88%' },
      });
    });
  }, []);

  return (
    <section id="timeline" ref={sectionRef} className="section-pad" style={{ background: 'var(--color-surface)' }}>
      <div style={{ marginBottom: 'var(--space-xl)', maxWidth: 640 }}>
        <p ref={eyebrowRef} className="label" style={{ color: 'var(--color-rust)', marginBottom: 'var(--space-sm)', opacity: 0 }}>
          Exhibition History
        </p>
        <h2 ref={headingRef} style={{ opacity: 0 }}>What has hung here.</h2>
      </div>

      {/* Single left-aligned spine — quieter than a centered, alternating
          timeline, and reads more like a real exhibition record/ledger. */}
      <div style={{ position: 'relative', maxWidth: 760 }}>
        <div style={{
          position: 'absolute', left: 0, top: 8, bottom: 8, width: 1,
          background: 'var(--color-line)',
        }}>
          <div ref={lineRef} style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            background: 'var(--color-rust)', transformOrigin: 'top center',
          }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
          {EVENTS.map((ev, i) => (
            <div
              key={i}
              ref={(el) => { itemsRef.current[i] = el; }}
              style={{ paddingLeft: 'var(--space-lg)', position: 'relative', opacity: 0 }}
            >
              {/* Marker dot on the spine */}
              <div style={{
                position: 'absolute', left: -4, top: 6,
                width: 9, height: 9, borderRadius: '50%',
                background: i === 0 ? 'var(--color-rust)' : 'var(--color-ink)',
                border: `1.5px solid ${i === 0 ? 'var(--color-rust)' : 'var(--color-clay)'}`,
              }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <span className="label" style={{ color: i === 0 ? 'var(--color-rust)' : 'var(--color-clay)' }}>
                  {ev.tag} — {ev.month} {ev.year}
                </span>
              </div>

              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.4rem' }}>{ev.title}</h3>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--color-clay)', marginBottom: '0.6rem' }}>
                {ev.venue}
              </p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.92rem', lineHeight: 1.7, color: 'var(--color-clay)', maxWidth: 560 }}>
                {ev.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
