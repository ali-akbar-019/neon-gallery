import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const MEDIUMS = ['Digital Painting', 'AI-Assisted', 'Glitch Art', 'Generative', '3D / Sculpture', 'Photography', 'Mixed Media', 'Other'];

export default function OpenCall() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState({
    name: '', email: '', medium: '', statement: '', url: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    gsap.fromTo(
      [eyebrowRef.current, headingRef.current],
      { y: 35, opacity: 0 },
      {
        y: 0, opacity: 1, stagger: 0.1, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: eyebrowRef.current, start: 'top 88%' },
      }
    );

    if (prefersReducedMotion) return;

    // Left info column slides in
    gsap.fromTo(leftRef.current, { x: -60, opacity: 0 }, {
      x: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: leftRef.current, start: 'top 80%' },
    });

    // Form slides in from right
    gsap.fromTo(formRef.current, { x: 60, opacity: 0 }, {
      x: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: formRef.current, start: 'top 80%' },
    });
  }, []);

  const handleSubmit = () => {
    if (!form.name || !form.email || !form.medium) return;
    // Animate out form, animate in success
    gsap.to(formRef.current, {
      scale: 0.96, opacity: 0, duration: 0.35, ease: 'power2.in',
      onComplete: () => {
        setSubmitted(true);
        gsap.fromTo(formRef.current,
          { scale: 0.92, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.4)' }
        );
      },
    });
  };

  const inputStyle = (name: string) => ({
    width: '100%',
    padding: '0.85rem 1.1rem',
    background: focused === name ? 'rgba(0,255,255,0.03)' : 'var(--color-surface)',
    border: `1px solid ${focused === name ? 'var(--color-cyan)' : 'var(--color-border)'}`,
    borderRadius: 3,
    color: 'var(--color-white)',
    fontFamily: 'var(--font-body)',
    fontSize: '0.9rem',
    outline: 'none',
    transition: 'border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease',
    boxShadow: focused === name ? '0 0 20px rgba(0,255,255,0.1)' : 'none',
  });

  const labelStyle = {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.6rem',
    letterSpacing: '0.15em',
    color: 'var(--color-muted)',
    textTransform: 'uppercase' as const,
    display: 'block',
    marginBottom: '0.5rem',
  };

  const fieldStyle = { display: 'flex', flexDirection: 'column' as const, gap: 0 };

  return (
    <section
      id="open-call"
      ref={sectionRef}
      style={{
        padding: 'var(--section-py) var(--section-px)',
        background: 'var(--color-bg)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background glow */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse at 80% 50%, rgba(0,255,255,0.04) 0%, transparent 60%)',
      }} />

      {/* Header */}
      <div style={{ marginBottom: 'clamp(3rem, 6vw, 5rem)' }}>
        <p ref={eyebrowRef} style={{
          fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
          letterSpacing: '0.25em', color: 'var(--color-cyan)',
          textTransform: 'uppercase', marginBottom: '0.9rem', opacity: 0,
        }}>
          Open Call — 2025
        </p>
        <h2 ref={headingRef} style={{
          color: 'var(--color-white)', opacity: 0,
        }}>
          Submit Your Work
        </h2>
      </div>

      {/* Two-column layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1.4fr',
        gap: 'clamp(3rem, 6vw, 6rem)',
        alignItems: 'start',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Left — info */}
        <div ref={leftRef} style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', opacity: 0 }}>
          <div>
            <p style={{
              fontFamily: 'var(--font-body)', fontSize: '1rem',
              lineHeight: 1.8, color: 'rgba(240,240,240,0.5)',
            }}>
              Void Gallery accepts submissions from digital artists worldwide. We are especially interested in work that sits at the edge of the recognizable — images that feel borrowed from a dream you haven't had yet.
            </p>
          </div>

          {/* Requirements */}
          <div>
            <p style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
              letterSpacing: '0.2em', color: 'var(--color-cyan)',
              textTransform: 'uppercase', marginBottom: '1.25rem',
            }}>
              Requirements
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                ['Resolution', 'Min. 3000px on longest edge'],
                ['Format', 'TIFF, PNG, or RAW'],
                ['Quantity', 'Up to 5 works per submission'],
                ['Response', 'Within 6–8 weeks'],
                ['Rights', 'Artist retains full ownership'],
              ].map(([k, v]) => (
                <div key={k} style={{
                  display: 'flex', gap: '1rem', alignItems: 'flex-start',
                  paddingBottom: '1rem', borderBottom: '1px solid var(--color-border)',
                }}>
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
                    letterSpacing: '0.12em', color: 'var(--color-muted)',
                    textTransform: 'uppercase', minWidth: 80,
                  }}>
                    {k}
                  </span>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.88rem', color: 'var(--color-white)', lineHeight: 1.5 }}>
                    {v}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Deadline badge */}
          <div style={{
            padding: '1.25rem 1.5rem',
            background: 'var(--color-surface)',
            border: '1px solid rgba(255,215,0,0.25)',
            borderRadius: 4,
            borderLeft: '3px solid var(--color-gold)',
          }}>
            <p style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.55rem',
              letterSpacing: '0.2em', color: 'var(--color-gold)',
              textTransform: 'uppercase', marginBottom: '0.4rem',
            }}>
              Deadline
            </p>
            <p style={{
              fontFamily: 'var(--font-display)', fontSize: '1.6rem',
              color: 'var(--color-white)', letterSpacing: '0.06em', lineHeight: 1,
            }}>
              31 MARCH 2025
            </p>
          </div>
        </div>

        {/* Right — form */}
        <div ref={formRef} style={{ opacity: 0 }}>
          {submitted ? (
            <div style={{
              background: 'var(--color-surface)',
              border: '1px solid rgba(0,255,255,0.3)',
              borderRadius: 6,
              padding: '3rem',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1.25rem',
            }}>
              <div style={{
                width: 60, height: 60, borderRadius: '50%',
                background: 'rgba(0,255,255,0.1)',
                border: '1px solid var(--color-cyan)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.5rem', color: 'var(--color-cyan)',
                boxShadow: '0 0 30px rgba(0,255,255,0.2)',
              }}>
                ✦
              </div>
              <h3 style={{
                fontFamily: 'var(--font-display)', fontSize: '2rem',
                color: 'var(--color-white)', letterSpacing: '0.06em',
              }}>
                Submission Received
              </h3>
              <p style={{
                fontFamily: 'var(--font-body)', fontSize: '0.9rem',
                color: 'rgba(240,240,240,0.45)', lineHeight: 1.7, maxWidth: 360,
              }}>
                We've received your submission, {form.name.split(' ')[0]}. We review every work personally and will be in touch within 6–8 weeks.
              </p>
              <button
                data-cursor-hover
                onClick={() => { setSubmitted(false); setForm({ name: '', email: '', medium: '', statement: '', url: '' }); }}
                style={{
                  marginTop: '0.5rem',
                  padding: '0.7rem 1.75rem',
                  background: 'transparent',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-muted)',
                  fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
                  letterSpacing: '0.12em', textTransform: 'uppercase',
                  borderRadius: 3, transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--color-white)';
                  (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-white)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--color-border)';
                  (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-muted)';
                }}
              >
                Submit Another
              </button>
            </div>
          ) : (
            <div style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 6,
              padding: 'clamp(2rem, 4vw, 3rem)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
            }}>
              {/* Row 1: Name + Email */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={fieldStyle}>
                  <label style={labelStyle}>Full Name *</label>
                  <input
                    type="text"
                    placeholder="Kira Nakamura"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    onFocus={() => setFocused('name')}
                    onBlur={() => setFocused(null)}
                    style={inputStyle('name')}
                  />
                </div>
                <div style={fieldStyle}>
                  <label style={labelStyle}>Email *</label>
                  <input
                    type="email"
                    placeholder="you@studio.art"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    onFocus={() => setFocused('email')}
                    onBlur={() => setFocused(null)}
                    style={inputStyle('email')}
                  />
                </div>
              </div>

              {/* Medium select */}
              <div style={fieldStyle}>
                <label style={labelStyle}>Primary Medium *</label>
                <div style={{ position: 'relative' }}>
                  <select
                    value={form.medium}
                    onChange={e => setForm(f => ({ ...f, medium: e.target.value }))}
                    onFocus={() => setFocused('medium')}
                    onBlur={() => setFocused(null)}
                    style={{
                      ...inputStyle('medium'),
                      appearance: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    <option value="" disabled style={{ background: 'var(--color-surface)' }}>Select a medium…</option>
                    {MEDIUMS.map(m => (
                      <option key={m} value={m} style={{ background: 'var(--color-surface)' }}>{m}</option>
                    ))}
                  </select>
                  <span style={{
                    position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)',
                    color: 'var(--color-muted)', pointerEvents: 'none', fontSize: '0.8rem',
                  }}>▾</span>
                </div>
              </div>

              {/* Portfolio URL */}
              <div style={fieldStyle}>
                <label style={labelStyle}>Portfolio / Dropbox URL</label>
                <input
                  type="url"
                  placeholder="https://yourportfolio.com"
                  value={form.url}
                  onChange={e => setForm(f => ({ ...f, url: e.target.value }))}
                  onFocus={() => setFocused('url')}
                  onBlur={() => setFocused(null)}
                  style={inputStyle('url')}
                />
              </div>

              {/* Artist statement */}
              <div style={fieldStyle}>
                <label style={labelStyle}>Artist Statement <span style={{ color: 'var(--color-muted)' }}>(optional)</span></label>
                <textarea
                  rows={4}
                  placeholder="Describe your practice in a few sentences…"
                  value={form.statement}
                  onChange={e => setForm(f => ({ ...f, statement: e.target.value }))}
                  onFocus={() => setFocused('statement')}
                  onBlur={() => setFocused(null)}
                  style={{
                    ...inputStyle('statement'),
                    resize: 'vertical',
                    minHeight: 110,
                    fontFamily: 'var(--font-body)',
                    lineHeight: 1.6,
                  }}
                />
              </div>

              {/* Submit */}
              <button
                data-cursor-hover
                onClick={handleSubmit}
                style={{
                  padding: '1rem 2rem',
                  background: (!form.name || !form.email || !form.medium)
                    ? 'rgba(0,255,255,0.15)' : 'var(--color-cyan)',
                  border: 'none',
                  color: (!form.name || !form.email || !form.medium) ? 'rgba(0,255,255,0.4)' : '#050508',
                  fontFamily: 'var(--font-mono)', fontSize: '0.72rem',
                  letterSpacing: '0.18em', textTransform: 'uppercase',
                  borderRadius: 3, fontWeight: 700,
                  transition: 'all 0.25s ease',
                  boxShadow: (!form.name || !form.email || !form.medium)
                    ? 'none' : '0 0 30px rgba(0,255,255,0.3)',
                }}
                onMouseEnter={e => {
                  if (!form.name || !form.email || !form.medium) return;
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 50px rgba(0,255,255,0.5)';
                  (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = (!form.name || !form.email || !form.medium)
                    ? 'none' : '0 0 30px rgba(0,255,255,0.3)';
                  (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
                }}
              >
                Submit Application →
              </button>

              <p style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.58rem',
                letterSpacing: '0.1em', color: 'var(--color-muted)',
                lineHeight: 1.6,
              }}>
                * Required fields. We do not share your information with third parties.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
