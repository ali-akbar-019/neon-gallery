import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const QUOTE = 'Art is not what you see, but what you make others see.';
const ATTRIBUTION = '— Edgar Degas, misremembered beautifully';

// Floating dust particle config
const PARTICLES = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 3 + 1,
  duration: Math.random() * 8 + 6,
  delay: Math.random() * 5,
  opacity: Math.random() * 0.35 + 0.05,
  color: ['#00FFFF', '#FF00FF', '#FFD700', '#ffffff'][Math.floor(Math.random() * 4)],
}));

export default function Quote() {
  const sectionRef = useRef<HTMLElement>(null);
  const wordsRef = useRef<HTMLSpanElement[]>([]);
  const attributionRef = useRef<HTMLParagraphElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  const words = QUOTE.split(' ');

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Each word blurs in from nothing
      gsap.fromTo(
        wordsRef.current,
        { opacity: 0, filter: 'blur(12px)', y: 20 },
        {
          opacity: 1,
          filter: 'blur(0px)',
          y: 0,
          stagger: 0.08,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 65%',
          },
        }
      );

      // Divider line expands from center
      gsap.fromTo(
        lineRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.2,
          ease: 'power3.inOut',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
          },
        }
      );

      // Attribution fades in last
      gsap.fromTo(
        attributionRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', delay: 0.8,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 65%' },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        position: 'relative',
        padding: 'clamp(6rem, 14vw, 12rem) clamp(2rem, 8vw, 10rem)',
        background: 'var(--color-bg)',
        overflow: 'hidden',
        textAlign: 'center',
      }}
    >
      {/* Floating dust particles */}
      {PARTICLES.map((p) => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            background: p.color,
            opacity: p.opacity,
            pointerEvents: 'none',
            animation: `floatDust ${p.duration}s ${p.delay}s ease-in-out infinite alternate`,
            boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
          }}
        />
      ))}

      {/* Ambient radial glow behind quote */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '60vw',
        height: '60vw',
        maxWidth: 700,
        maxHeight: 700,
        background: 'radial-gradient(ellipse at center, rgba(255,0,255,0.04) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <style>{`
        @keyframes floatDust {
          from { transform: translateY(0px) translateX(0px); }
          to   { transform: translateY(-24px) translateX(10px); }
        }
      `}</style>

      {/* Eyebrow */}
      <p style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.65rem',
        letterSpacing: '0.3em',
        color: 'var(--color-muted)',
        textTransform: 'uppercase',
        marginBottom: '3rem',
      }}>
        Gallery Philosophy
      </p>

      {/* Animated quote */}
      <blockquote style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'clamp(2rem, 5vw, 4.5rem)',
        lineHeight: 1.2,
        letterSpacing: '0.03em',
        color: 'var(--color-white)',
        maxWidth: 900,
        margin: '0 auto 2.5rem',
        fontWeight: 400,
      }}>
        {words.map((word, i) => (
          <span
            key={i}
            ref={(el) => { if (el) wordsRef.current[i] = el; }}
            style={{
              display: 'inline-block',
              marginRight: '0.35em',
              opacity: 0,
            }}
          >
            {word}
          </span>
        ))}
      </blockquote>

      {/* Divider */}
      <div
        ref={lineRef}
        style={{
          width: 80,
          height: 1,
          margin: '0 auto 2rem',
          background: 'linear-gradient(90deg, var(--color-magenta), var(--color-cyan))',
          transformOrigin: 'center',
          transform: 'scaleX(0)',
          boxShadow: '0 0 10px rgba(255,0,255,0.4)',
        }}
      />

      {/* Attribution */}
      <p
        ref={attributionRef}
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.75rem',
          letterSpacing: '0.12em',
          color: 'var(--color-muted)',
          opacity: 0,
          fontStyle: 'italic',
        }}
      >
        {ATTRIBUTION}
      </p>
    </section>
  );
}
