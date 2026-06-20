import { useRef, useEffect } from 'react';

const ITEMS = [
  'Kira Nakamura', '·', 'Fractured Dreamscape', '·',
  'Zeph Moreau', '·', 'A House With No Floor', '·',
  'Asel Dzhaksybekov', '·', 'Echoes of the Machine', '·',
  'Dante Ferrara', '·', 'Spectral Tide', '·',
  'Opening Night — March 2025', '·', 'Digital Surrealism', '·',
  'Wall', '·',
];

// Pixels per second at full speed. Hover slows this toward 0 instead of
// stopping/restarting the animation — that's what removes the snap-back
// bug that happens when toggling a Framer Motion `animate` prop between
// a keyframe array and `undefined`.
const BASE_SPEED = 38;

export default function Marquee() {
  const trackRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const speedRef = useRef(BASE_SPEED);
  const targetSpeedRef = useRef(BASE_SPEED);
  const halfWidthRef = useRef(0);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const track = trackRef.current;
    if (!track) return;

    // Measure once the track (doubled content) is laid out, so we know
    // exactly when to wrap the offset for a seamless loop.
    const measure = () => {
      halfWidthRef.current = track.scrollWidth / 2;
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track);

    if (prefersReducedMotion) {
      return () => ro.disconnect();
    }

    let rafId: number;
    let lastTime = performance.now();

    const tick = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05); // clamp for tab-switch jumps
      lastTime = now;

      // Ease current speed toward target speed — this is what makes the
      // hover slow-down/speed-up feel smooth instead of an instant stop.
      speedRef.current += (targetSpeedRef.current - speedRef.current) * Math.min(dt * 6, 1);

      offsetRef.current -= speedRef.current * dt;

      // Wrap seamlessly once we've scrolled past one full copy of the list
      if (halfWidthRef.current > 0 && Math.abs(offsetRef.current) >= halfWidthRef.current) {
        offsetRef.current += halfWidthRef.current;
      }

      track.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
    };
  }, []);

  const handleMouseEnter = () => { targetSpeedRef.current = 0; };
  const handleMouseLeave = () => { targetSpeedRef.current = BASE_SPEED; };

  return (
    <div
      ref={wrapperRef}
      style={{
        background: 'var(--color-surface)',
        borderTop: '1px solid var(--color-line)',
        borderBottom: '1px solid var(--color-line)',
        padding: '0.9rem 0',
        overflow: 'hidden',
        position: 'relative',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0, width: 120,
        background: 'linear-gradient(to right, var(--color-surface), transparent)', zIndex: 2,
      }} />
      <div style={{
        position: 'absolute', right: 0, top: 0, bottom: 0, width: 120,
        background: 'linear-gradient(to left, var(--color-surface), transparent)', zIndex: 2,
      }} />

      <div
        ref={trackRef}
        style={{ display: 'flex', whiteSpace: 'nowrap', willChange: 'transform' }}
      >
        {[...ITEMS, ...ITEMS].map((item, i) => (
          <span
            key={i}
            className={item === '·' ? '' : 'label'}
            style={{
              color: item === '·' ? 'var(--color-rust)' : 'var(--color-clay)',
              paddingRight: '2.2rem',
              display: 'inline-block',
              fontFamily: item === '·' ? 'serif' : undefined,
            }}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
