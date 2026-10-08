# ATELIER NOIR

A fictional avant-garde design studio, set entirely in type. Brutalist-editorial
landing page: stark noir (`#0A0A0A`) and bone (`#EDEAE4`), viewport-filling
kinetic typography, and scroll-velocity-reactive motion — no images, no build
tools, no frameworks.

**Live:** https://akshay-th.github.io/atelier-noir/

## Signature moves

- **Preloader** — "NOIR" letters assemble, then the curtain wipes up.
- **Hero** — `ATELIER / NOIR` set gigantic, letters stagger in; lines skew with
  scroll velocity (classic award-site feel).
- **Marquee band** — `DESIGN — MOTION — IDENTITY — SPATIAL —` loops infinitely
  and **reverses direction with your scroll direction**, speeding up with flicks.
- **Manifesto** — a bold paragraph reveals word-by-word, scrub-linked to scroll.
- **Selected works** — huge text rows (`01 VESSEL … 05 RUINE`); hovering fills
  the title via a `background-clip: text` wipe and summons a cursor-following
  preview panel whose art is pure CSS gradients.
- **Services** — full-bleed inverted (bone) section, brutal 1px-border grid.
- **Contact** — giant circular `HELLO→` button with rotating ring text that
  inverts on hover.
- **Frame** — thin difference-blended border around the viewport with
  page-corner metadata: `AN®`, `PARIS — TOKYO`, `©2026`, live local time.

## Stack

- Static HTML/CSS/JS, relative paths (works from any subpath).
- [GSAP 3](https://gsap.com) + ScrollTrigger (cdnjs) for all motion.
- [Lenis](https://lenis.darkroom.engineering/) (jsdelivr) for smooth scroll.
- Google Fonts: **Anton** (display) + **Space Mono** (metadata).

## Reliability

- Full `prefers-reduced-motion` support — the page renders completely static.
- All animation-hidden states are applied by JS only; with JS or a CDN blocked,
  every section is still visible and the preloader removes itself.
- Cursor preview disabled on touch / coarse-pointer devices; responsive to 360px.

## Run locally

```sh
python3 -m http.server 4174
# http://localhost:4174/
```

`DESIGN.md` holds the full concept, type scale, storyboard and motion spec.
