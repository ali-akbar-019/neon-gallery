import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { Artwork } from '../../data/artworks';

interface LightboxProps {
  artwork: Artwork | null;
  onClose: () => void;
}

export default function Lightbox({ artwork, onClose }: LightboxProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = artwork ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [artwork]);

  return (
    <AnimatePresence>
      {artwork && (
        <motion.div
          ref={overlayRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => e.target === overlayRef.current && onClose()}
          className="lightbox-overlay"
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(11,11,12,0.94)',
            backdropFilter: 'blur(10px)',
            zIndex: 8000,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '2rem',
            overflowY: 'auto',
          }}
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 20 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="lightbox-content"
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 'var(--space-lg)',
              maxWidth: 1000, width: '100%', maxHeight: '90vh',
            }}
          >
            {/* Image */}
            <div className="lightbox-image" style={{ position: 'relative', overflow: 'hidden', border: '1px solid var(--color-line)', minWidth: 0 }}>
              <img
                src={artwork.imageUrl}
                alt={artwork.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>

            {/* Info */}
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 'var(--space-md)' }}>
              <div>
                <p className="label" style={{ color: 'var(--color-rust)', marginBottom: '0.6rem' }}>
                  {artwork.medium}
                </p>
                <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3rem)' }}>{artwork.title}</h2>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <InfoRow label="Artist" value={artwork.artist} />
                <InfoRow label="Year" value={String(artwork.year)} />
                <InfoRow label="Dimensions" value={artwork.dimensions} />
              </div>

              <div className="divider" />

              <button
                onClick={onClose}
                style={{
                  alignSelf: 'flex-start',
                  padding: '0.7rem 1.8rem',
                  background: 'transparent',
                  border: '1px solid var(--color-line)',
                  color: 'var(--color-bone)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.85rem',
                  borderRadius: 2,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--color-rust)';
                  (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-rust)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--color-line)';
                  (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-bone)';
                }}
              >
                ← Close
              </button>
            </div>
          </motion.div>

          {/* Below 760px: stack image above info instead of squeezing two
              columns, and shrink the overlay's outer padding so the modal
              has more usable width on phones. */}
          <style>{`
            @media (max-width: 760px) {
              .lightbox-content { grid-template-columns: 1fr !important; max-height: none !important; }
              .lightbox-image { aspect-ratio: 4/3 !important; }
            }
            @media (max-width: 480px) {
              .lightbox-overlay { padding: 1rem !important; }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'baseline' }}>
      <span className="label" style={{ minWidth: 90 }}>{label}</span>
      <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--color-bone)' }}>{value}</span>
    </div>
  );
}
