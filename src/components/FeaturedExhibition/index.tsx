import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { featuredArtwork } from '../../data/artworks';

gsap.registerPlugin(ScrollTrigger);

export default function FeaturedExhibition() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);

  const artwork = featuredArtwork;

  // 3D card tilt effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = imageRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotateX = ((y - cy) / cy) * -10;
    const rotateY = ((x - cx) / cx) * 10;

    gsap.to(card, {
      rotateX,
      rotateY,
      transformPerspective: 1000,
      duration: 0.4,
      ease: 'power2.out',
    });
  };

  const handleMouseLeave = () => {
    gsap.to(imageRef.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.6,
      ease: 'elastic.out(1, 0.5)',
    });
  };

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Image parallax on scroll
      gsap.fromTo(
        imageRef.current,
        { yPercent: -8 },
        {
          yPercent: 8,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5,
          },
        }
      );

      // Content stagger on scroll into view
      const elements = [eyebrowRef.current, titleRef.current, descRef.current, metaRef.current];
      gsap.fromTo(
        elements,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.12,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: contentRef.current,
            start: 'top 80%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="featured"
      ref={sectionRef}
      style={{
        padding: 'var(--section-py) var(--section-px)',
        background: 'var(--color-bg)',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 'clamp(3rem, 6vw, 7rem)',
        alignItems: 'center',
      }}
    >
      {/* 3D Tilt Image card */}
      <div
        ref={imageRef}
        data-cursor-hover
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          position: 'relative',
          borderRadius: 4,
          overflow: 'hidden',
          willChange: 'transform',
          boxShadow: '0 30px 100px rgba(0,0,0,0.6)',
        }}
      >
        <img
          src={artwork.imageUrl}
          alt={artwork.title}
          style={{
            width: '100%',
            height: '100%',
            display: 'block',
            objectFit: 'cover',
            aspectRatio: '4/5',
          }}
        />

        {/* Neon border glow */}
        <div style={{
          position: 'absolute',
          inset: 0,
          boxShadow: 'inset 0 0 0 1px rgba(0,255,255,0.25)',
          borderRadius: 4,
          pointerEvents: 'none',
        }} />

        {/* Corner accent */}
        <div style={{
          position: 'absolute',
          top: '1.5rem',
          right: '1.5rem',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.6rem',
          letterSpacing: '0.15em',
          color: 'var(--color-cyan)',
          background: 'rgba(0,0,0,0.7)',
          padding: '0.4rem 0.7rem',
          backdropFilter: 'blur(4px)',
          border: '1px solid rgba(0,255,255,0.2)',
        }}>
          Featured Work
        </div>
      </div>

      {/* Content */}
      <div ref={contentRef} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
        <div>
          <p
            ref={eyebrowRef}
            className="label"
            style={{
              color: 'var(--color-cyan)',
              marginBottom: 'var(--space-sm)',
              opacity: 0,
            }}
          >
            Current Exhibition ✦ {artwork.year}
          </p>
          <h2
            ref={titleRef}
            style={{
              color: 'var(--color-white)',
              opacity: 0,
            }}
          >
            {artwork.title}
          </h2>
        </div>

        <p
          ref={descRef}
          className="body-lg"
          style={{
            maxWidth: 480,
            opacity: 0,
          }}
        >
          {artwork.artist} renders an interior that cannot exist in waking life — a space whose
          geometry shifts faster than memory can record it. Each viewing reveals a different architecture.
        </p>

        <div ref={metaRef} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', opacity: 0 }}>
          {[
            { label: 'Artist', value: artwork.artist },
            { label: 'Medium', value: artwork.medium },
            { label: 'Dimensions', value: artwork.dimensions },
          ].map(({ label, value }) => (
            <div key={label} style={{
              display: 'flex',
              gap: '1.5rem',
              alignItems: 'center',
              padding: '0.75rem 0',
              borderBottom: '1px solid var(--color-border)',
            }}>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6rem',
                letterSpacing: '0.15em',
                color: 'var(--color-muted)',
                textTransform: 'uppercase',
                minWidth: 80,
              }}>
                {label}
              </span>
              <span style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.9rem',
                color: 'var(--color-white)',
              }}>
                {value}
              </span>
            </div>
          ))}
        </div>

        <button
          data-cursor-hover
          style={{
            alignSelf: 'flex-start',
            padding: '0.9rem 2.5rem',
            background: 'var(--color-cyan)',
            border: 'none',
            color: '#050508',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.7rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            borderRadius: 2,
            fontWeight: 700,
            transition: 'all 0.25s ease',
            boxShadow: '0 0 30px rgba(0,255,255,0.3)',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 50px rgba(0,255,255,0.6)';
            (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 30px rgba(0,255,255,0.3)';
            (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
          }}
        >
          View Full Work →
        </button>
      </div>
    </section>
  );
}
