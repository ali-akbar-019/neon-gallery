import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import ParticleField from './ParticleField';

const GALLERY_NAME = 'VOID GALLERY';
const SUBTITLE = 'Where the digital unconscious surfaces. A permanent collection of works that should not exist.';

const GLITCH_CHARS = '!<>-_\\/[]{}—=+*^?#________';

function useGlitchText(finalText: string, startDelay = 0.5) {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    const timer = setTimeout(() => {
      const length = finalText.length;
      let iteration = 0;
      interval = setInterval(() => {
        setDisplayText(
          finalText.split('').map((char, index) => {
            if (char === ' ') return ' ';
            if (index < iteration) return char;
            return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
          }).join('')
        );
        if (iteration >= length) clearInterval(interval);
        iteration += 0.4;
      }, 35);
    }, startDelay * 1000);

    return () => { clearTimeout(timer); clearInterval(interval); };
  }, [finalText, startDelay]);

  return displayText;
}

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const subtitleRef  = useRef<HTMLParagraphElement>(null);
  const ctaRef       = useRef<HTMLButtonElement>(null);
  const scrollRef    = useRef<HTMLDivElement>(null);
  const glitchText   = useGlitchText(GALLERY_NAME, 0.6);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const tl = gsap.timeline({ delay: 1.2 });

    const words = subtitleRef.current?.querySelectorAll('span') ?? [];
    tl.fromTo(words,
      { y: 20, opacity: 0, filter: 'blur(8px)' },
      { y: 0, opacity: 1, filter: 'blur(0px)', stagger: 0.04, duration: 0.6, ease: 'power2.out' },
      0,
    );

    tl.fromTo(ctaRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' },
      0.3,
    );

    gsap.to(scrollRef.current, {
      y: 10, repeat: -1, yoyo: true, duration: 1.2, ease: 'sine.inOut', delay: 2.5,
    });
  }, []);

  const scrollToGallery = () => {
    document.getElementById('featured')?.scrollIntoView({ behavior: 'smooth' });
  };

  const words = SUBTITLE.split(' ');

  return (
    <section
      ref={containerRef}
      style={{
        position: 'relative',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        background: 'radial-gradient(ellipse at center, #0a0a16 0%, #050508 70%)',
      }}
    >
      <ParticleField />

      {/* Vignette */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at center, transparent 35%, rgba(5,5,8,0.75) 100%)',
        pointerEvents: 'none',
      }} />

      {/* Faint scan lines — quiet, editorial */}
      {[18, 82].map((top) => (
        <div key={top} style={{
          position: 'absolute', left: 0, right: 0, top: `${top}%`, height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(0,255,255,0.1), transparent)',
          pointerEvents: 'none',
        }} />
      ))}

      {/* Main content */}
      <div style={{
        position: 'relative', zIndex: 10, textAlign: 'center',
        maxWidth: 960, padding: '0 var(--space-md)',
      }}>
        {/* Eyebrow */}
        <span className="label" style={{
          color: 'var(--color-cyan)', display: 'block',
          marginBottom: 'var(--space-lg)', opacity: 0.65,
        }}>
          Est. 2024 ✦ Digital Surrealism ✦ Online Exhibition
        </span>

        {/* Glitch title — uses global h1 scale */}
        <h1 style={{
          color: 'var(--color-white)',
          textShadow: '0 0 50px rgba(0,255,255,0.18), 0 0 110px rgba(0,255,255,0.06)',
          marginBottom: 'var(--space-lg)',
          minHeight: '1em',
        }}>
          {glitchText || '\u00a0'}
        </h1>

        {/* Divider */}
        <div style={{
          width: 'min(100%, 360px)', height: 1, margin: '0 auto var(--space-lg)',
          background: 'linear-gradient(90deg, transparent, var(--color-magenta), transparent)',
          boxShadow: '0 0 14px rgba(255,0,255,0.4)',
        }} />

        {/* Subtitle */}
        <p ref={subtitleRef} className="body-lg" style={{
          maxWidth: 540, margin: '0 auto var(--space-xl)',
        }}>
          {words.map((word, i) => (
            <span key={i} style={{ display: 'inline-block', marginRight: '0.35em', opacity: 0 }}>
              {word}
            </span>
          ))}
        </p>

        {/* CTA */}
        <button
          ref={ctaRef}
          data-cursor-hover
          onClick={scrollToGallery}
          className="label"
          style={{
            opacity: 0,
            padding: '1.1rem 3.2rem',
            background: 'transparent',
            border: '1px solid var(--color-cyan)',
            color: 'var(--color-cyan)',
            borderRadius: 2,
            transition: 'color 0.3s ease, box-shadow 0.3s ease, background 0.3s ease',
            boxShadow: '0 0 24px rgba(0,255,255,0.12)',
          }}
          onMouseEnter={e => {
            const btn = e.currentTarget;
            btn.style.boxShadow = '0 0 44px rgba(0,255,255,0.32), 0 0 90px rgba(0,255,255,0.1)';
            btn.style.background = 'rgba(0,255,255,0.05)';
          }}
          onMouseLeave={e => {
            const btn = e.currentTarget;
            btn.style.boxShadow = '0 0 24px rgba(0,255,255,0.12)';
            btn.style.background = 'transparent';
          }}
        >
          Explore the Collection
        </button>
      </div>

      {/* Scroll indicator */}
      <div ref={scrollRef} style={{
        position: 'absolute', bottom: 'var(--space-lg)', left: '50%',
        transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: 'var(--space-xs)', opacity: 0.4,
      }}>
        <span className="label" style={{ color: 'var(--color-white)' }}>Scroll</span>
        <div style={{
          width: 1, height: 40,
          background: 'linear-gradient(to bottom, var(--color-cyan), transparent)',
        }} />
      </div>
    </section>
  );
}
