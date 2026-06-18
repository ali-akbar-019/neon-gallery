import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const dot = dotRef.current!;
    const ring = ringRef.current!;

    let mouseX = 0, mouseY = 0;

    // Move dot instantly, ring follows with lag
    const moveCursor = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Dot snaps immediately
      gsap.set(dot, { x: mouseX, y: mouseY });
      // Ring lags behind
      gsap.to(ring, {
        x: mouseX,
        y: mouseY,
        duration: 0.35,
        ease: 'power2.out',
      });
    };

    // Detect hoverable elements — expand ring
    const handleEnter = () => {
      gsap.to(ring, { scale: 2.5, opacity: 0.6, duration: 0.25, ease: 'power2.out' });
      gsap.to(dot, { scale: 0, duration: 0.2 });
    };
    const handleLeave = () => {
      gsap.to(ring, { scale: 1, opacity: 1, duration: 0.25, ease: 'power2.out' });
      gsap.to(dot, { scale: 1, duration: 0.2 });
    };

    window.addEventListener('mousemove', moveCursor);

    // Listen on all interactive elements
    const selector = 'a, button, [data-cursor-hover]';
    const attachHover = () => {
      document.querySelectorAll<HTMLElement>(selector).forEach(el => {
        el.addEventListener('mouseenter', handleEnter);
        el.addEventListener('mouseleave', handleLeave);
      });
    };
    attachHover();

    // Re-run on DOM changes (for dynamically added elements)
    const observer = new MutationObserver(attachHover);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      {/* Glowing dot — snaps to cursor */}
      <div
        ref={dotRef}
        className="custom-cursor"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 6,
          height: 6,
          borderRadius: '50%',
          backgroundColor: 'var(--color-cyan)',
          boxShadow: '0 0 10px var(--color-cyan), 0 0 20px var(--color-cyan)',
          pointerEvents: 'none',
          zIndex: 9999,
          transform: 'translate(-50%, -50%)',
          willChange: 'transform',
        }}
      />
      {/* Ring — follows with spring lag */}
      <div
        ref={ringRef}
        className="custom-cursor"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 32,
          height: 32,
          borderRadius: '50%',
          border: '1.5px solid rgba(0,255,255,0.7)',
          pointerEvents: 'none',
          zIndex: 9998,
          transform: 'translate(-50%, -50%)',
          willChange: 'transform',
          mixBlendMode: 'screen',
        }}
      />
    </>
  );
}
