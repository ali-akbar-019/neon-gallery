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

  // Gentle 3D tilt — like leaning in to examine a piece up close.
  // Kept subtle (max ~6deg) so it reads as a considered interaction,
  // not a flashy effect.
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = imageRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotateX = ((y - cy) / cy) * -5;
    const rotateY = ((x - cx) / cx) * 5;

    gsap.to(card, { rotateX, rotateY, transformPerspective: 1200, duration: 0.5, ease: 'power2.out' });
  };

  const handleMouseLeave = () => {
    gsap.to(imageRef.current, { rotateX: 0, rotateY: 0, duration: 0.7, ease: 'power3.out' });
  };

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(imageRef.current, { yPercent: -6 }, {
        yPercent: 6, ease: 'none',
        scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: 1.5 },
      });

      const elements = [eyebrowRef.current, titleRef.current, descRef.current, metaRef.current];
      gsap.fromTo(elements, { y: 36, opacity: 0 }, {
        y: 0, opacity: 1, stagger: 0.1, duration: 0.8, ease: 'power2.out',
        scrollTrigger: { trigger: contentRef.current, start: 'top 80%' },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="featured"
      ref={sectionRef}
      className="section-pad featured-section"
      style={{
        background: 'var(--color-ink)',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 'clamp(3rem, 6vw, 7rem)',
        alignItems: 'center',
      }}
    >
      {/* Tilt image card */}
      <div
        ref={imageRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="featured-image"
        style={{
          position: 'relative',
          overflow: 'hidden',
          willChange: 'transform',
          border: '1px solid var(--color-line)',
          minWidth: 0,
        }}
      >
        <img
          src={artwork.imageUrl}
          alt={artwork.title}
          style={{ width: '100%', height: '100%', display: 'block', objectFit: 'cover', aspectRatio: '4/5' }}
        />
        <div style={{
          position: 'absolute', top: 'var(--space-sm)', right: 'var(--space-sm)',
          fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.12em',
          color: 'var(--color-bone)', background: 'rgba(11,11,12,0.7)',
          padding: '0.4rem 0.75rem', backdropFilter: 'blur(4px)',
          border: '1px solid var(--color-line)',
        }}>
          Featured Work
        </div>
      </div>

      {/* Content */}
      <div ref={contentRef} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', minWidth: 0 }}>
        <div>
          <p ref={eyebrowRef} className="label" style={{ color: 'var(--color-rust)', marginBottom: 'var(--space-sm)', opacity: 0 }}>
            Current Exhibition — {artwork.year}
          </p>
          <h2 ref={titleRef} style={{ opacity: 0 }}>{artwork.title}</h2>
        </div>

        <p ref={descRef} className="body-lg" style={{ maxWidth: 480, opacity: 0 }}>
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
              display: 'flex', flexWrap: 'wrap', gap: 'var(--space-sm)', alignItems: 'center',
              padding: '0.7rem 0', borderBottom: '1px solid var(--color-line)',
            }}>
              <span className="label" style={{ minWidth: 90 }}>{label}</span>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--color-bone)' }}>{value}</span>
            </div>
          ))}
        </div>

        <button
          style={{
            alignSelf: 'flex-start',
            padding: '0.9rem 2.3rem',
            background: 'var(--color-rust)',
            border: 'none',
            color: 'var(--color-ink)',
            fontFamily: 'var(--font-body)',
            fontSize: '0.92rem',
            fontWeight: 600,
            borderRadius: 2,
            cursor: 'pointer',
            transition: 'background 0.25s ease, transform 0.25s ease',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.background = '#DA6440';
            (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.background = 'var(--color-rust)';
            (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
          }}
        >
          View Full Work →
        </button>
      </div>

      {/* Below 860px: stack image above content instead of squeezing two
          columns. Image gets a capped height so it doesn't dominate the
          screen on mobile. */}
      <style>{`
        @media (max-width: 860px) {
          .featured-section { grid-template-columns: 1fr !important; }
          .featured-image { aspect-ratio: 4/3 !important; }
          .featured-image img { aspect-ratio: 4/3 !important; }
        }
      `}</style>
    </section>
  );
}
