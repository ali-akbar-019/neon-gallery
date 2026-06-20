import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const QUOTE = 'Art is not what you see, but what you make others see.';
const ATTRIBUTION = 'After Edgar Degas';

export default function Quote() {
  const sectionRef     = useRef<HTMLElement>(null);
  const wordsRef        = useRef<HTMLSpanElement[]>([]);
  const attributionRef = useRef<HTMLParagraphElement>(null);
  const lineRef         = useRef<HTMLDivElement>(null);

  const words = QUOTE.split(' ');

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(wordsRef.current,
        { opacity: 0, y: 14 },
        {
          opacity: 1, y: 0, stagger: 0.06, duration: 0.55, ease: 'power2.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 65%' },
        }
      );

      gsap.fromTo(lineRef.current, { scaleX: 0 }, {
        scaleX: 1, duration: 1, ease: 'power2.inOut',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
      });

      gsap.fromTo(attributionRef.current, { opacity: 0 }, {
        opacity: 1, duration: 0.7, delay: 0.6,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 65%' },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        padding: 'clamp(5rem, 11vw, 9rem) var(--section-px)',
        background: 'var(--color-ink)',
        textAlign: 'center',
      }}
    >
      <p className="label" style={{ marginBottom: 'var(--space-lg)' }}>Gallery Philosophy</p>

      <blockquote style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'clamp(1.8rem, 4.2vw, 3.4rem)',
        lineHeight: 1.25,
        color: 'var(--color-bone)',
        maxWidth: 820,
        margin: '0 auto var(--space-lg)',
        fontWeight: 420,
      }}>
        {words.map((word, i) => (
          <span key={i} ref={(el) => { if (el) wordsRef.current[i] = el; }} style={{ display: 'inline-block', marginRight: '0.3em', opacity: 0 }}>
            {word}
          </span>
        ))}
      </blockquote>

      <div ref={lineRef} style={{
        width: 48, height: 2, margin: '0 auto var(--space-sm)',
        background: 'var(--color-rust)', transform: 'scaleX(0)',
      }} />

      <p ref={attributionRef} className="label" style={{ opacity: 0 }}>{ATTRIBUTION}</p>
    </section>
  );
}
