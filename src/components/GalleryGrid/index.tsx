import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { artworks, type Artwork } from '../../data/artworks';
import Lightbox from '../UI/Lightbox';

gsap.registerPlugin(ScrollTrigger);

const accentMap = {
  cyan: 'var(--color-cyan)',
  magenta: 'var(--color-magenta)',
  gold: 'var(--color-gold)',
};

function ArtworkCard({ artwork, index, onClick }: {
  artwork: Artwork;
  index: number;
  onClick: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const accent = accentMap[artwork.accentColor];

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    gsap.fromTo(
      cardRef.current,
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: cardRef.current,
          start: 'top 88%',
        },
        delay: (index % 3) * 0.1,
      }
    );
  }, [index]);

  const handleMouseEnter = () => {
    gsap.to(overlayRef.current, { opacity: 1, duration: 0.3, ease: 'power2.out' });
    const img1 = cardRef.current?.querySelector("img"); if(img1) gsap.to(img1, { scale: 1.06, duration: 0.5, ease: 'power2.out' });
    gsap.to(cardRef.current, { boxShadow: `0 0 40px ${accent}30`, duration: 0.3 });
  };

  const handleMouseLeave = () => {
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.3, ease: 'power2.in' });
    const img2 = cardRef.current?.querySelector("img"); if(img2) gsap.to(img2, { scale: 1, duration: 0.5, ease: 'power2.out' });
    gsap.to(cardRef.current, { boxShadow: 'none', duration: 0.3 });
  };

  return (
    <div
      ref={cardRef}
      data-cursor-hover
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        position: 'relative',
        borderRadius: 4,
        overflow: 'hidden',
        opacity: 0,
        border: `1px solid var(--color-border)`,
        transition: 'border-color 0.3s ease',
      }}
    >
      <img
        src={artwork.imageUrl}
        alt={artwork.title}
        loading="lazy"
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          objectFit: 'cover',
          minHeight: 200,
        }}
      />

      {/* Animated overlay */}
      <div
        ref={overlayRef}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(5,5,8,0.95) 0%, rgba(5,5,8,0.4) 50%, transparent 100%)',
          opacity: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '1.5rem',
        }}
      >
        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.6rem',
          letterSpacing: '0.15em',
          color: accent,
          textTransform: 'uppercase',
          marginBottom: '0.4rem',
        }}>
          {artwork.artist}
        </p>
        <h3 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.4rem',
          letterSpacing: '0.04em',
          color: 'var(--color-white)',
          lineHeight: 1.1,
        }}>
          {artwork.title}
        </h3>
        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.6rem',
          letterSpacing: '0.1em',
          color: 'var(--color-muted)',
          marginTop: '0.5rem',
        }}>
          {artwork.medium} · {artwork.year}
        </p>

        {/* Neon accent line */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 2,
          background: accent,
          boxShadow: `0 0 12px ${accent}`,
        }} />
      </div>
    </div>
  );
}

export default function GalleryGrid() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);

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
  }, []);

  return (
    <section
      id="gallery"
      ref={sectionRef}
      style={{
        padding: 'clamp(5rem, 10vw, 8rem) clamp(2rem, 6vw, 6rem)',
        background: 'var(--color-bg-2)',
      }}
    >
      {/* Section header */}
      <div style={{ marginBottom: 'clamp(3rem, 6vw, 5rem)' }}>
        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.65rem',
          letterSpacing: '0.25em',
          color: 'var(--color-magenta)',
          textTransform: 'uppercase',
          marginBottom: '1rem',
        }}>
          Permanent Collection
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
          The Works
        </h2>
      </div>

      {/* Masonry-style CSS columns grid */}
      <div
        style={{
          columns: 'clamp(280px, 30vw, 380px) 3',
          columnGap: '1.5rem',
          rowGap: '1.5rem',
        }}
      >
        {artworks.map((artwork, i) => (
          <div key={artwork.id} style={{ breakInside: 'avoid', marginBottom: '1.5rem' }}>
            <ArtworkCard
              artwork={artwork}
              index={i}
              onClick={() => setSelectedArtwork(artwork)}
            />
          </div>
        ))}
      </div>

      <Lightbox artwork={selectedArtwork} onClose={() => setSelectedArtwork(null)} />
    </section>
  );
}
