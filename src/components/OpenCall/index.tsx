import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const MEDIUMS = ['Digital painting', 'AI-assisted', 'Glitch art', 'Generative', '3D / sculpture', 'Photography', 'Mixed media', 'Other'];

export default function OpenCall() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const leftRef    = useRef<HTMLDivElement>(null);
  const formRef    = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState({ name: '', email: '', medium: '', statement: '', url: '' });
  const [submitted, setSubmitted] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    gsap.fromTo([eyebrowRef.current, headingRef.current],
      { y: 28, opacity: 0 },
      {
        y: 0, opacity: 1, stagger: 0.08, duration: 0.7, ease: 'power2.out',
        scrollTrigger: { trigger: eyebrowRef.current, start: 'top 88%' },
      }
    );

    if (prefersReducedMotion) return;

    gsap.fromTo(leftRef.current, { y: 30, opacity: 0 }, {
      y: 0, opacity: 1, duration: 0.7, ease: 'power2.out',
      scrollTrigger: { trigger: leftRef.current, start: 'top 82%' },
    });
    gsap.fromTo(formRef.current, { y: 30, opacity: 0 }, {
      y: 0, opacity: 1, duration: 0.7, ease: 'power2.out', delay: 0.1,
      scrollTrigger: { trigger: formRef.current, start: 'top 82%' },
    });
  }, []);

  const handleSubmit = () => {
    if (!form.name || !form.email || !form.medium) return;
    gsap.to(formRef.current, {
      scale: 0.97, opacity: 0, duration: 0.3, ease: 'power2.in',
      onComplete: () => {
        setSubmitted(true);
        gsap.fromTo(formRef.current, { scale: 0.96, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.45, ease: 'power2.out' });
      },
    });
  };

  const inputStyle = (name: string) => ({
    width: '100%',
    padding: '0.8rem 1rem',
    background: 'var(--color-ink)',
    border: `1px solid ${focused === name ? 'var(--color-rust)' : 'var(--color-line)'}`,
    borderRadius: 2,
    color: 'var(--color-bone)',
    fontFamily: 'var(--font-body)',
    fontSize: '0.9rem',
    outline: 'none',
    transition: 'border-color 0.2s ease',
  });

  const labelStyle = {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.65rem',
    letterSpacing: '0.1em',
    color: 'var(--color-clay)',
    textTransform: 'uppercase' as const,
    display: 'block',
    marginBottom: '0.5rem',
  };

  const fieldStyle = { display: 'flex', flexDirection: 'column' as const };

  return (
    <section id="open-call" ref={sectionRef} className="section-pad" style={{ background: 'var(--color-ink)' }}>
      <div style={{ marginBottom: 'var(--space-xl)' }}>
        <p ref={eyebrowRef} className="label" style={{ color: 'var(--color-rust)', marginBottom: 'var(--space-sm)', opacity: 0 }}>
          Open Call — 2025
        </p>
        <h2 ref={headingRef} style={{ opacity: 0 }}>Submit your work.</h2>
      </div>

      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1.3fr',
        gap: 'clamp(3rem, 6vw, 6rem)', alignItems: 'start',
      }}>
        {/* Left — info */}
        <div ref={leftRef} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)', opacity: 0 }}>
          <p className="body-lg">
            Wall accepts submissions from digital artists worldwide. We are especially
            interested in work that sits at the edge of the recognizable — images that
            feel borrowed from a dream you haven't had yet.
          </p>

          <div>
            <p className="label" style={{ color: 'var(--color-rust)', marginBottom: 'var(--space-sm)' }}>Requirements</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              {[
                ['Resolution', 'Min. 3000px on longest edge'],
                ['Format', 'TIFF, PNG, or RAW'],
                ['Quantity', 'Up to 5 works per submission'],
                ['Response', 'Within 6–8 weeks'],
                ['Rights', 'Artist retains full ownership'],
              ].map(([k, v]) => (
                <div key={k} style={{
                  display: 'flex', gap: 'var(--space-md)', alignItems: 'baseline',
                  paddingBottom: '0.9rem', borderBottom: '1px solid var(--color-line)',
                }}>
                  <span className="label" style={{ minWidth: 90 }}>{k}</span>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--color-bone)' }}>{v}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{
            padding: 'var(--space-sm) var(--space-md)',
            border: '1px solid var(--color-line)',
            borderLeft: '2px solid var(--color-rust)',
          }}>
            <p className="label" style={{ color: 'var(--color-rust)', marginBottom: '0.4rem' }}>Deadline</p>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem' }}>31 March 2025</p>
          </div>
        </div>

        {/* Right — form */}
        <div ref={formRef} style={{ opacity: 0 }}>
          {submitted ? (
            <div style={{
              border: '1px solid var(--color-line)', padding: 'var(--space-xl) var(--space-lg)',
              textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-sm)',
            }}>
              <div style={{
                width: 52, height: 52, borderRadius: '50%',
                border: '1px solid var(--color-rust)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.3rem', color: 'var(--color-rust)',
              }}>
                ✓
              </div>
              <h3 style={{ fontSize: '1.6rem' }}>Submission Received</h3>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.92rem', color: 'var(--color-clay)', lineHeight: 1.7, maxWidth: 360 }}>
                We've received your submission, {form.name.split(' ')[0]}. We review every work personally and will be in touch within 6–8 weeks.
              </p>
              <button
                onClick={() => { setSubmitted(false); setForm({ name: '', email: '', medium: '', statement: '', url: '' }); }}
                style={{
                  marginTop: '0.5rem', padding: '0.65rem 1.6rem',
                  background: 'transparent', border: '1px solid var(--color-line)',
                  color: 'var(--color-clay)', fontFamily: 'var(--font-body)', fontSize: '0.85rem',
                  borderRadius: 2, cursor: 'pointer', transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--color-rust)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-rust)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--color-line)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-clay)'; }}
              >
                Submit Another
              </button>
            </div>
          ) : (
            <div style={{
              background: 'var(--color-surface)', border: '1px solid var(--color-line)',
              padding: 'clamp(1.75rem, 4vw, 2.5rem)', display: 'flex', flexDirection: 'column', gap: 'var(--space-md)',
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-sm)' }}>
                <div style={fieldStyle}>
                  <label style={labelStyle}>Full Name *</label>
                  <input type="text" placeholder="Kira Nakamura" value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    onFocus={() => setFocused('name')} onBlur={() => setFocused(null)}
                    style={inputStyle('name')} />
                </div>
                <div style={fieldStyle}>
                  <label style={labelStyle}>Email *</label>
                  <input type="email" placeholder="you@studio.art" value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    onFocus={() => setFocused('email')} onBlur={() => setFocused(null)}
                    style={inputStyle('email')} />
                </div>
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle}>Primary Medium *</label>
                <div style={{ position: 'relative' }}>
                  <select
                    value={form.medium}
                    onChange={e => setForm(f => ({ ...f, medium: e.target.value }))}
                    onFocus={() => setFocused('medium')} onBlur={() => setFocused(null)}
                    style={{ ...inputStyle('medium'), appearance: 'none', cursor: 'pointer' }}
                  >
                    <option value="" disabled>Select a medium…</option>
                    {MEDIUMS.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                  <span style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-clay)', pointerEvents: 'none' }}>▾</span>
                </div>
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle}>Portfolio URL</label>
                <input type="url" placeholder="https://yourportfolio.com" value={form.url}
                  onChange={e => setForm(f => ({ ...f, url: e.target.value }))}
                  onFocus={() => setFocused('url')} onBlur={() => setFocused(null)}
                  style={inputStyle('url')} />
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle}>Artist Statement <span style={{ color: 'var(--color-clay)', textTransform: 'none' }}>(optional)</span></label>
                <textarea rows={4} placeholder="Describe your practice in a few sentences…" value={form.statement}
                  onChange={e => setForm(f => ({ ...f, statement: e.target.value }))}
                  onFocus={() => setFocused('statement')} onBlur={() => setFocused(null)}
                  style={{ ...inputStyle('statement'), resize: 'vertical', minHeight: 100, lineHeight: 1.6 }} />
              </div>

              <button
                onClick={handleSubmit}
                disabled={!form.name || !form.email || !form.medium}
                style={{
                  padding: '0.95rem 2rem',
                  background: (!form.name || !form.email || !form.medium) ? 'var(--color-surface-2)' : 'var(--color-rust)',
                  border: 'none',
                  color: (!form.name || !form.email || !form.medium) ? 'var(--color-clay)' : 'var(--color-ink)',
                  fontFamily: 'var(--font-body)', fontSize: '0.92rem', fontWeight: 600,
                  borderRadius: 2, cursor: (!form.name || !form.email || !form.medium) ? 'not-allowed' : 'pointer',
                  transition: 'background 0.2s ease',
                }}
              >
                Submit Application →
              </button>

              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--color-clay)', lineHeight: 1.6 }}>
                * Required fields. We do not share your information with third parties.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
