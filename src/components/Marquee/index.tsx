import { useState } from 'react';
import { motion } from 'framer-motion';

const ITEMS = [
  'Kira Nakamura',
  '✦',
  'Fractured Dreamscape',
  '✦',
  'Zeph Moreau',
  '✦',
  'The Neon Labyrinth',
  '✦',
  'Asel Dzhaksybekov',
  '✦',
  'Echoes of the Machine',
  '✦',
  'Dante Ferrara',
  '✦',
  'Spectral Tide',
  '✦',
  'Opening Night — July 2024',
  '✦',
  'Digital Surrealism',
  '✦',
  'Void Gallery',
  '✦',
];

export default function Marquee() {
  const [hovered, setHovered] = useState(false);
  const duration = 28;

  return (
    <div
      style={{
        background: 'var(--color-surface)',
        borderTop: '1px solid var(--color-border)',
        borderBottom: '1px solid var(--color-border)',
        padding: '1rem 0',
        overflow: 'hidden',
        position: 'relative',
        zIndex: 10,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Left + right gradient fade */}
      <div style={{
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: 120,
        background: 'linear-gradient(to right, var(--color-surface), transparent)',
        zIndex: 2,
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        width: 120,
        background: 'linear-gradient(to left, var(--color-surface), transparent)',
        zIndex: 2,
        pointerEvents: 'none',
      }} />

      {/* Scrolling content — doubled for seamless loop */}
      <motion.div
        style={{ display: 'flex', whiteSpace: 'nowrap' }}
        animate={{ x: hovered ? undefined : [0, '-50%'] }}
        transition={{
          x: {
            duration,
            ease: 'linear',
            repeat: Infinity,
            repeatType: 'loop',
          },
        }}
      >
        {[...ITEMS, ...ITEMS].map((item, i) => (
          <span
            key={i}
            style={{
              fontFamily: item === '✦' ? 'serif' : 'var(--font-mono)',
              fontSize: item === '✦' ? '0.6rem' : '0.68rem',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: item === '✦' ? 'var(--color-magenta)' : 'var(--color-muted)',
              paddingRight: '2.5rem',
              transition: 'color 0.2s ease',
              display: 'inline-block',
            }}
          >
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
