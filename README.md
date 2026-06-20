# Wall

A single-page gallery site for digital surrealism. Built with Vite + React + TypeScript, GSAP, Framer Motion, and Lenis smooth scroll.

**Design system: "Wall & Bone"** — a warm near-black background, bone-white text, and a single terracotta accent. Fraunces serif for display type, Inter for body, JetBrains Mono for labels only. No neon, no particle fields, no horizontal-scroll gimmicks — the goal is to read like a real gallery's own site, not a sci-fi dashboard.

---

## Setup

```bash
npm install
npm run dev
```

Open `http://localhost:5173`

---

## Tech Stack

| Library | Role |
|---|---|
| Vite + React + TypeScript | Build tooling and components |
| GSAP + ScrollTrigger | Scroll-driven reveals and timelines |
| Framer Motion | Lightbox modal transitions |
| Lenis | Smooth inertia scroll, synced to GSAP via `scrollerProxy` |
| Tailwind CSS v4 | Utility classes |

---

## Sections

1. **Hero** — editorial split layout: large serif headline beside a single artwork crop, like a gallery's own homepage.
2. **Marquee** — infinite ticker of artist names and titles, reverses on hover.
3. **Featured Exhibition** — subtle 3D tilt on the current show's image, scroll parallax.
4. **The Works** — masonry grid of the permanent collection, click for a lightbox.
5. **The Makers** — a static, asymmetric grid of artist profiles (like pieces hung on a wall), with animated stat counters. No horizontal scroll.
6. **By the Numbers** — count-up stats on scroll.
7. **What Has Hung Here** — a left-aligned exhibition history/ledger.
8. **Gallery Philosophy** — a quiet word-by-word quote reveal.
9. **Open Call** — submission form with requirements and a deadline.
10. **Footer** — navigation, newsletter signup, social links.

---

## Swapping in Real Content

- Artworks: edit `src/data/artworks.ts`
- Artists: edit `src/data/artists.ts`
- Color tokens, type scale, and spacing: all in `src/styles/global.css` under `:root`

---

## Why no custom cursor / horizontal-scroll pin / 3D background?

Earlier passes on this project leaned on stock "AI-gallery" visual tropes — neon multi-color accents, a rotating 3D particle field, a horizontal-scroll-pinned section, and a custom cursor. These were removed because they didn't serve a gallery site's actual job: showing work clearly and reading as considered, not as a tech demo. The current version is intentionally quieter.

---

## Accessibility

`prefers-reduced-motion` is respected throughout — all GSAP animations are skipped if enabled. Focus states are visible on all interactive elements.

---

## Build

```bash
npm run build   # outputs to /dist
npm run preview # preview the production build locally
```
