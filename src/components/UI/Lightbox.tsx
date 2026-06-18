import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { Artwork } from '../../data/artworks';

interface LightboxProps {
  artwork: Artwork | null;
  onClose: () => void;
}

const accentMap = {
  cyan: 'var(--color-cyan)',
  magenta: 'var(--color-magenta)',
  gold: 'var(--color-gold)',
};

export default function Lightbox({ artwork, onClose }: LightboxProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (artwork) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [artwork]);

  const accent = artwork ? accentMap[artwork.accentColor] : 'var(--color-cyan)';

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
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(5,5,8,0.92)',
            backdropFilter: 'blur(12px)',
            zIndex: 8000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
          }}
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 30 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '3rem',
              maxWidth: 1000,
              width: '100%',
              maxHeight: '90vh',
            }}
          >
            {/* Image */}
            <div style={{ position: 'relative', borderRadius: 4, overflow: 'hidden' }}>
              <img
                src={artwork.imageUrl}
                alt={artwork.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                boxShadow: `inset 0 0 60px rgba(0,0,0,0.4)`,
                border: `1px solid ${accent}`,
                borderRadius: 4,
              }} />
            </div>

            {/* Info */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: '1.5rem',
            }}>
              <div>
                <p style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.7rem',
                  letterSpacing: '0.2em',
                  color: accent,
                  textTransform: 'uppercase',
                  marginBottom: '0.75rem',
                }}>
                  {artwork.medium}
                </p>
                <h2 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                  lineHeight: 1,
                  letterSpacing: '0.02em',
                  color: 'var(--color-white)',
                }}>
                  {artwork.title}
                </h2>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <InfoRow label="Artist" value={artwork.artist} accent={accent} />
                <InfoRow label="Year" value={String(artwork.year)} accent={accent} />
                <InfoRow label="Dimensions" value={artwork.dimensions} accent={accent} />
              </div>

              <div style={{
                height: 1,
                background: `linear-gradient(90deg, ${accent}, transparent)`,
              }} />

              <button
                onClick={onClose}
                data-cursor-hover
                style={{
                  alignSelf: 'flex-start',
                  padding: '0.75rem 2rem',
                  background: 'transparent',
                  border: `1px solid ${accent}`,
                  color: accent,
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  borderRadius: 2,
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = accent;
                  (e.currentTarget as HTMLButtonElement).style.color = '#050508';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                  (e.currentTarget as HTMLButtonElement).style.color = accent;
                }}
              >
                ← Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function InfoRow({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'baseline', borderLeft: `2px solid ${accent}30`, paddingLeft: '0.75rem' }}>
      <span style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.65rem',
        letterSpacing: '0.12em',
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
  );
}
