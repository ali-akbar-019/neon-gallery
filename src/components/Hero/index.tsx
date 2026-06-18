import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import ParticleField from './ParticleField';

const GALLERY_NAME = 'VOID GALLERY';
const SUBTITLE = 'Where the digital unconscious surfaces. A permanent collection of works that should not exist.';

// Glitch characters used for the effect
const GLITCH_CHARS = '!<>-_\\/[]{}—=+*^?#________';

function useGlitchText(finalText: string, startDelay = 0.5) {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    let frame = 0;
    let interval: ReturnType<typeof setInterval>;

    const timer = setTimeout(() => {
      const length = finalText.length;
      let iteration = 0;

      interval = setInterval(() => {
        setDisplayText(
          finalText
            .split('')
            .map((char, index) => {
              if (char === ' ') return ' ';
              if (index < iteration) return char;
              return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
            })
            .join('')
        );

        if (iteration >= length) {
          clearInterval(interval);
        }

        iteration += 0.4;
        frame++;
      }, 35);
    }, startDelay * 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [finalText, startDelay]);

  return displayText;
}

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const yearRef = useRef<HTMLSpanElement>(null);
  const glitchText = useGlitchText(GALLERY_NAME, 0.6);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const tl = gsap.timeline({ delay: 1.2 });

    // Subtitle words stagger in
    const words = subtitleRef.current?.querySelectorAll('span') ?? [];
    tl.fromTo(
      words,
      { y: 20, opacity: 0, filter: 'blur(8px)' },
      { y: 0, opacity: 1, filter: 'blur(0px)', stagger: 0.04, duration: 0.6, ease: 'power2.out' },
      0,
    );

    // CTA slides up
    tl.fromTo(
      ctaRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' },
      0.3,
    );

    // Scroll indicator bounces
    gsap.to(scrollRef.current, {
      y: 10,
      repeat: -1,
      yoyo: true,
      duration: 1.2,
      ease: 'sine.inOut',
      delay: 2.5,
    });
  }, []);

  const scrollToGallery = () => {
    const el = document.getElementById('featured');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  // Split subtitle into words for stagger
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
        background: 'radial-gradient(ellipse at center, #0a0a18 0%, #050508 70%)',
      }}
    >
      {/* Three.js particle background */}
      <ParticleField />

      {/* Vignette overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at center, transparent 30%, rgba(5,5,8,0.7) 100%)',
        pointerEvents: 'none',
      }} />

      {/* Horizontal scan line decorations */}
      {[15, 85].map((top) => (
        <div key={top} style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: `${top}%`,
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(0,255,255,0.15), transparent)',
          pointerEvents: 'none',
        }} />
      ))}

      {/* Main content */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        textAlign: 'center',
        maxWidth: '900px',
        padding: '0 2rem',
      }}>
        {/* Year badge */}
        <span
          ref={yearRef}
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.65rem',
            letterSpacing: '0.3em',
            color: 'var(--color-cyan)',
            textTransform: 'uppercase',
            display: 'block',
            marginBottom: '1.5rem',
            opacity: 0.7,
          }}
        >
          Est. 2024 ✦ Digital Surrealism ✦ Online Exhibition
        </span>

        {/* Glitch title */}
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(4rem, 12vw, 9rem)',
            lineHeight: 0.9,
            letterSpacing: '0.08em',
            color: 'var(--color-white)',
            textShadow: '0 0 40px rgba(0,255,255,0.2), 0 0 80px rgba(0,255,255,0.08)',
            marginBottom: '2rem',
            fontWeight: 400,
          }}
        >
          {glitchText || '\u00a0'}
        </h1>

        {/* Animated divider line */}
        <div style={{
          width: '100%',
          maxWidth: 400,
          height: '1px',
          background: 'linear-gradient(90deg, transparent, var(--color-magenta), transparent)',
          margin: '0 auto 2rem',
          boxShadow: '0 0 12px rgba(255,0,255,0.4)',
        }} />

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
            color: 'rgba(240,240,240,0.5)',
            lineHeight: 1.7,
            maxWidth: 520,
            margin: '0 auto 3rem',
          }}
        >
          {words.map((word, i) => (
            <span
              key={i}
              style={{ display: 'inline-block', marginRight: '0.35em', opacity: 0 }}
            >
              {word}
            </span>
          ))}
        </p>

        {/* CTA Button */}
        <button
          ref={ctaRef}
          data-cursor-hover
          onClick={scrollToGallery}
          style={{
            opacity: 0,
            padding: '1rem 3rem',
            background: 'transparent',
            border: '1px solid var(--color-cyan)',
            color: 'var(--color-cyan)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            borderRadius: 2,
            position: 'relative',
            overflow: 'hidden',
            transition: 'color 0.3s ease, box-shadow 0.3s ease',
            boxShadow: '0 0 20px rgba(0,255,255,0.1)',
          }}
          onMouseEnter={e => {
            const btn = e.currentTarget;
            btn.style.boxShadow = '0 0 40px rgba(0,255,255,0.3), 0 0 80px rgba(0,255,255,0.1)';
            btn.style.background = 'rgba(0,255,255,0.05)';
          }}
          onMouseLeave={e => {
            const btn = e.currentTarget;
            btn.style.boxShadow = '0 0 20px rgba(0,255,255,0.1)';
            btn.style.background = 'transparent';
          }}
        >
          Explore the Collection
        </button>
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollRef}
        style={{
          position: 'absolute',
          bottom: '2.5rem',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.5rem',
          opacity: 0.4,
        }}
      >
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.55rem',
          letterSpacing: '0.2em',
          color: 'var(--color-white)',
          textTransform: 'uppercase',
        }}>
          Scroll
        </span>
        <div style={{
          width: 1,
          height: 40,
          background: 'linear-gradient(to bottom, var(--color-cyan), transparent)',
        }} />
      </div>
    </section>
  );
}
