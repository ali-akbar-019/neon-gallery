import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { artworks, type Artwork } from '../../data/artworks';
import Lightbox from '../UI/Lightbox';

gsap.registerPlugin(ScrollTrigger);

function ArtworkCard({ artwork, index, onClick }: {
  artwork: Artwork;
  index: number;
  onClick: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    gsap.fromTo(
      cardRef.current,
      { y: 40, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.7, ease: 'power2.out',
        scrollTrigger: { trigger: cardRef.current, start: 'top 90%' },
        delay: (index % 3) * 0.08,
      }
    );
  }, [index]);

  const handleMouseEnter = () => {
    gsap.to(overlayRef.current, { opacity: 1, duration: 0.3, ease: 'power2.out' });
    const img = cardRef.current?.querySelector('img');
    if (img) gsap.to(img, { scale: 1.04, duration: 0.5, ease: 'power2.out' });
  };

  const handleMouseLeave = () => {
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.3, ease: 'power2.in' });
    const img = cardRef.current?.querySelector('img');
    if (img) gsap.to(img, { scale: 1, duration: 0.5, ease: 'power2.out' });
  };

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        position: 'relative',
        overflow: 'hidden',
        opacity: 0,
        border: '1px solid var(--color-line)',
        cursor: 'pointer',
      }}
    >
      <img
        src={artwork.imageUrl}
        alt={artwork.title}
        loading="lazy"
        style={{ width: '100%', height: '100%', display: 'block', objectFit: 'cover', minHeight: 200 }}
      />

      <div
        ref={overlayRef}
        style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(11,11,12,0.92) 0%, rgba(11,11,12,0.3) 55%, transparent 100%)',
          opacity: 0,
          display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
          padding: 'var(--space-sm)',
        }}
      >
        <p className="label" style={{ color: 'var(--color-rust)', marginBottom: '0.35rem' }}>
          {artwork.artist}
        </p>
        <h3 style={{ fontSize: '1.25rem', lineHeight: 1.15 }}>{artwork.title}</h3>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--color-clay)', marginTop: '0.5rem' }}>
          {artwork.medium} · {artwork.year}
        </p>
      </div>
    </div>
  );
}

export default function GalleryGrid() {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    gsap.fromTo([eyebrowRef.current, headingRef.current],
      { y: 30, opacity: 0 },
      {
        y: 0, opacity: 1, stagger: 0.08, duration: 0.8, ease: 'power2.out',
        scrollTrigger: { trigger: eyebrowRef.current, start: 'top 85%' },
      }
    );
  }, []);

  return (
    <section id="gallery" className="section-pad" style={{ background: 'var(--color-surface)' }}>
      <div style={{ marginBottom: 'var(--space-xl)', maxWidth: 640 }}>
        <p ref={eyebrowRef} className="label" style={{ color: 'var(--color-rust)', marginBottom: 'var(--space-sm)', opacity: 0 }}>
          Permanent Collection
        </p>
        <h2 ref={headingRef} style={{ opacity: 0 }}>The works on view.</h2>
      </div>

      <div style={{
        columns: 'clamp(280px, 30vw, 380px) 3',
        columnGap: 'var(--space-md)',
        rowGap: 'var(--space-md)',
      }}>
        {artworks.map((artwork, i) => (
          <div key={artwork.id} style={{ breakInside: 'avoid', marginBottom: 'var(--space-md)' }}>
            <ArtworkCard artwork={artwork} index={i} onClick={() => setSelectedArtwork(artwork)} />
          </div>
        ))}
      </div>

      <Lightbox artwork={selectedArtwork} onClose={() => setSelectedArtwork(null)} />
    </section>
  );
}
