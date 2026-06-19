import { useRef, useEffect, useState, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { artists } from '../../data/artists';

gsap.registerPlugin(ScrollTrigger);

const accentMap = {
  cyan: 'var(--color-cyan)',
  magenta: 'var(--color-magenta)',
  gold: 'var(--color-gold)',
};

function CountUp({ target, duration = 1.4 }: { target: number; duration?: number }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const triggered = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || triggered.current) return;
      triggered.current = true;
      observer.disconnect();
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min((now - start) / (duration * 1000), 1);
        setDisplay(Math.round((1 - Math.pow(1 - p, 3)) * target));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.3 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return <span ref={ref}>{display}</span>;
}

export default function ArtistSpotlight() {
  const wrapRef     = useRef<HTMLDivElement>(null);   // pinned viewport
  const trackRef    = useRef<HTMLDivElement>(null);   // sliding row
  const headingRef  = useRef<HTMLHeadingElement>(null);
  const eyebrowRef  = useRef<HTMLParagraphElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);   // mini progress bar inside the pin

  // useLayoutEffect so ScrollTrigger is set up AFTER the DOM has its final
  // layout, but BEFORE the browser paints — avoids any visible "jump" or
  // "snap" when the pin engages.
  useLayoutEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    gsap.fromTo([eyebrowRef.current, headingRef.current],
      { y: 35, opacity: 0 },
      {
        y: 0, opacity: 1, stagger: 0.1, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: eyebrowRef.current, start: 'top 88%' },
      }
    );

    if (prefersReducedMotion) return;

    let st: ScrollTrigger | undefined;
    let raf = 0;

    const build = () => {
      const wrap  = wrapRef.current;
      const track = trackRef.current;
      if (!wrap || !track) return;

      st?.kill();

      const dist = track.scrollWidth - wrap.offsetWidth;
      if (dist <= 0) return;

      // tween drives both the track's x position AND a quickTo-style
      // tracked value, so motion is interpolated smoothly by GSAP itself
      // rather than being set frame-by-frame from raw scroll progress.
      // This is what removes the "snap/attach" feeling — the position is
      // tweened with inertia (scrub value), not hard-set.
      const xTo = gsap.quickTo(track, 'x', { duration: 0.5, ease: 'power3.out' });
      const progressTo = progressRef.current
        ? gsap.quickTo(progressRef.current, 'scaleX', { duration: 0.5, ease: 'power3.out' })
        : null;

      st = ScrollTrigger.create({
        trigger: wrap,
        start: 'top top',
        end: () => `+=${dist + window.innerHeight * 0.15}`,
        pin: true,
        // A gentle scrub value (not "true") adds inertia/lag so the
        // horizontal motion always feels like it's catching up smoothly,
        // never a 1:1 hard jump.
        scrub: 0.6,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          xTo(-dist * self.progress);
          progressTo?.(Math.max(0.02, self.progress));
        },
      });
    };

    // Defer until images have a chance to lay out — prevents wrong
    // scrollWidth measurement which was the root cause of the old bug.
    raf = requestAnimationFrame(() => {
      // double RAF: first lets React commit, second lets browser paint/layout
      requestAnimationFrame(() => setTimeout(build, 60));
    });

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(raf);
      st?.kill();
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <section id="artists" style={{ background: 'var(--color-bg)', position: 'relative' }}>
      {/* Heading — scrolls normally */}
      <div style={{ padding: 'var(--section-py) var(--section-px) var(--space-lg)' }}>
        <p ref={eyebrowRef} className="label" style={{
          color: 'var(--color-gold)', marginBottom: 'var(--space-sm)', opacity: 0,
        }}>
          Contributing Artists
        </p>
        <h2 ref={headingRef} style={{ color: 'var(--color-white)', opacity: 0 }}>
          The Makers
        </h2>
      </div>

      {/* Pinned horizontal-scroll viewport */}
      <div
        ref={wrapRef}
        style={{
          width: '100%',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          background: 'var(--color-bg)',
          position: 'relative',
        }}
      >
        {/* Progress indicator — shows how far through the artist set we are */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 2,
          background: 'var(--color-border)', zIndex: 5,
        }}>
          <div
            ref={progressRef}
            style={{
              width: '100%', height: '100%', transformOrigin: 'left center', transform: 'scaleX(0)',
              background: 'linear-gradient(90deg, var(--color-gold), var(--color-magenta))',
              boxShadow: '0 0 10px rgba(255,215,0,0.5)',
            }}
          />
        </div>

        {/* Scroll hint */}
        <div style={{
          position: 'absolute', bottom: 'var(--space-md)', right: 'var(--section-px)',
          display: 'flex', alignItems: 'center', gap: '0.6rem', opacity: 0.35, pointerEvents: 'none',
        }}>
          <span className="label" style={{ color: 'var(--color-white)' }}>Scroll to explore</span>
          <span style={{ color: 'var(--color-gold)', fontSize: '0.8rem' }}>→</span>
        </div>

        {/* Track */}
        <div
          ref={trackRef}
          style={{
            display: 'flex',
            gap: 'var(--space-md)',
            padding: `0 var(--section-px)`,
            willChange: 'transform',
          }}
        >
          {artists.map((artist) => {
            const accent = accentMap[artist.accentColor];
            return (
              <div
                key={artist.id}
                data-cursor-hover
                style={{
                  width: 'clamp(300px, 28vw, 400px)',
                  flexShrink: 0,
                  background: 'var(--color-surface)',
                  borderRadius: 6,
                  border: '1px solid var(--color-border)',
                  overflow: 'hidden',
                  position: 'relative',
                  transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.borderColor = accent;
                  el.style.boxShadow = `0 0 50px ${accent}25`;
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.borderColor = 'var(--color-border)';
                  el.style.boxShadow = 'none';
                }}
              >
                {/* Photo */}
                <div style={{ height: 280, overflow: 'hidden', position: 'relative' }}>
                  <img
                    src={artist.imageUrl}
                    alt={artist.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to top, var(--color-surface) 0%, transparent 55%)',
                  }} />
                  <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, height: 3,
                    background: `linear-gradient(90deg, ${accent}, transparent)`,
                    boxShadow: `0 0 12px ${accent}`,
                  }} />
                  <div style={{
                    position: 'absolute', top: '1rem', left: '1rem',
                    fontFamily: 'var(--font-mono)', fontSize: '0.55rem',
                    letterSpacing: '0.12em', color: accent,
                    background: 'rgba(0,0,0,0.65)', padding: '0.3rem 0.7rem',
                    backdropFilter: 'blur(6px)', border: `1px solid ${accent}40`,
                    borderRadius: 2,
                  }}>
                    {artist.origin}
                  </div>
                </div>

                {/* Content */}
                <div style={{ padding: '1.5rem 1.75rem 1.75rem' }}>
                  <p style={{
                    fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
                    letterSpacing: '0.15em', color: accent,
                    textTransform: 'uppercase', marginBottom: '0.5rem',
                  }}>
                    {artist.specialty}
                  </p>
                  <h3 style={{ color: 'var(--color-white)', marginBottom: '0.9rem' }}>
                    {artist.name}
                  </h3>
                  <p style={{
                    fontFamily: 'var(--font-body)', fontSize: '0.85rem',
                    lineHeight: 1.75, color: 'rgba(239,239,239,0.42)',
                    marginBottom: '1.5rem',
                  }}>
                    {artist.bio}
                  </p>

                  <div style={{
                    display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '0.5rem', paddingTop: '1.25rem',
                    borderTop: '1px solid var(--color-border)',
                  }}>
                    {[
                      { label: 'Works',  value: artist.works },
                      { label: 'Shows',  value: artist.exhibitions },
                      { label: 'Colls.', value: artist.collections },
                    ].map(({ label, value }) => (
                      <div key={label} style={{ textAlign: 'center' }}>
                        <div style={{
                          fontFamily: 'var(--font-display)', fontSize: '1.9rem',
                          color: accent, lineHeight: 1,
                          textShadow: `0 0 18px ${accent}55`,
                        }}>
                          <CountUp target={value} />
                        </div>
                        <div style={{
                          fontFamily: 'var(--font-mono)', fontSize: '0.5rem',
                          letterSpacing: '0.14em', color: 'var(--color-muted)',
                          textTransform: 'uppercase', marginTop: '0.3rem',
                        }}>
                          {label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
