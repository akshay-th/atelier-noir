# ATELIER NOIR — Design Specification

A fictional avant-garde design studio. The typography **is** the design: no imagery,
no decoration that isn't type, a line, or a border. Brutalist-editorial, kinetic,
velocity-aware.

---

## 1. Concept

ATELIER NOIR is a studio that works in black. The site behaves like a printed
manifesto that has learned to move: enormous display type fills the viewport,
bands of text run like press rollers, and everything leans with the speed of
your scroll. The page is framed by a thin hairline border — the sheet of paper —
with metadata pinned in its corners like a print spec sheet.

Tone: severe, confident, Parisian/Tokyoite. No rounded corners. No soft shadows.
Hairlines, blocks, and mass.

## 2. Palette

| Token        | Value                  | Use                                  |
|--------------|------------------------|--------------------------------------|
| `--noir`     | `#0A0A0A`              | Page background, inverted-section text |
| `--bone`     | `#EDEAE4`              | Type, hairlines, inverted-section bg |
| `--bone-dim` | `rgba(237,234,228,.28)`| Un-filled work-row titles, muted meta |
| `--hairline` | `rgba(237,234,228,.18)`| Borders, rules, grid lines           |
| Accent       | none                   | Restraint is the accent              |

One deliberate violation: the **services section inverts** (bone background,
noir text) for a full-bleed flash of drama mid-page.

## 3. Typography

- **Display:** `Anton` (Google Fonts) — single weight, ultra-condensed mass.
  Always uppercase, `letter-spacing: -0.01em`, `line-height: 0.82`.
- **Meta/mono:** `Space Mono` — corner metadata, section indices, labels,
  manifesto kicker. `11–13px`, uppercase, `letter-spacing: 0.12em`.

Type scale (fluid):

| Role            | Size                              |
|-----------------|-----------------------------------|
| Hero wordmark   | `clamp(72px, 19.5vw, 340px)` — viewport-filling, two lines |
| Marquee band    | `clamp(40px, 8vw, 120px)`         |
| Manifesto       | `clamp(28px, 4.6vw, 72px)` Anton  |
| Work rows       | `clamp(44px, 9vw, 150px)`         |
| Section heads   | `clamp(34px, 6vw, 96px)`          |
| Footer "HELLO"  | ring `clamp(220px, 34vw, 420px)` diameter |
| Meta/mono       | `11–13px`                         |

## 4. Page frame & corner metadata

- Fixed 1px hairline frame inset `12px` from the viewport edge,
  `pointer-events: none`, `mix-blend-mode: difference` so it survives the
  inverted section.
- Corners (fixed, mono, difference-blended):
  - **TL** `AN® — ATELIER NOIR`
  - **TR** `PARIS — TOKYO`
  - **BL** `©2026 — EST. MMXIX`
  - **BR** live local time `HH:MM:SS — LOCAL` (JS clock, 1s tick)
- Corners hidden under ~480px except TL and BR (space).

## 5. Storyboard (sections, in order)

### 0 — Preloader
Black full-screen overlay. The four letters `N O I R` assemble: each letter
rises from below its baseline (clipped), staggered 80ms, slight skew settling
to 0. A mono counter is skipped — restraint. After assembly (~1.2s) the overlay
wipes upward (`clip-path` inset) revealing the hero mid-stagger. Hard fallback:
overlay force-removed at 4s or on any JS failure (CSS `animation` fallback
removes it), so content is never trapped.

### 1 — Hero
`ATELIER` / `NOIR` split across two lines, filling the viewport. Each letter is
a span:
- **Entrance:** letters translate up from 110% (clipped by line), stagger 45ms,
  `power4.out`, slight rotation settling to 0.
- **Scroll-velocity skew:** whole lines get `skewX` proportional to scroll
  velocity (clamped ±6°), eased back to 0 (`power3`) when scrolling stops.
- Second line `NOIR` is indented right and outlined-only (`-webkit-text-stroke`)
  until entrance completes, then fills — a one-beat ink moment.
- Bottom of hero: mono scroll hint `(SCROLL)` + studio one-liner.

### 2 — Marquee band
Full-bleed band between hairlines: `DESIGN — MOTION — IDENTITY — SPATIAL — `
repeated, Anton, infinite loop (two duplicated tracks, `xPercent` -50 loop).
**Direction follows scroll direction:** timeScale lerps toward `±1`, magnitude
boosted by |velocity| (up to 4×), so it speeds up as you flick and reverses
when you scroll back up.

### 3 — Manifesto
Mono kicker `(01 — MANIFESTO)`. One bold Anton paragraph (~40 words):
"WE BELIEVE RESTRAINT IS VIOLENCE DONE WELL…" Each word is a span at
`opacity: .14`; a scrubbed ScrollTrigger (start 80%/end 35%) staggers each word
to full opacity as the section crosses the viewport — the classic
Awwwards word-reveal, tied to scrub, reversible.

### 4 — Selected works
Mono kicker `(02 — SELECTED WORKS)`. Five rows, hairline-separated, each:
`index (mono) — TITLE (Anton, huge) — discipline (mono) — year (mono)`.
- **Fill-on-hover:** title color is `--bone-dim`; a bone `background-image`
  with `background-clip: text` animates `background-size 0→100%` left-to-right
  on hover (CSS transition, 0.6s expo).
- **Cursor preview panel:** a fixed `3:4` panel (~300×400) that fades/scales in
  on row hover and follows the cursor via `gsap.quickTo` (lagged, 0.5s expo).
  Its art is pure CSS per project — gradients/patterns, no images:
  - `01 VESSEL` — radial bone orb on noir, conic sheen
  - `02 MONO` — hard repeating-linear stripes
  - `03 KIN` — offset duotone radial blobs
  - `04 HALDE` — repeating conic checker, skewed
  - `05 RUINE` — layered linear fractures / glitch bands
- **Velocity skew:** rows share the hero's scroll-velocity `skewX`.
- Touch / no-hover (`hover:none` media): preview disabled entirely, titles
  rendered fully filled.

### 5 — Services (INVERTED)
Full-bleed bone section, noir text — the drama flip. Head: `CAPABILITIES`.
2×2 grid (1-col ≤720px) with brutal 1px noir borders, collapsed (shared) edges:
`01 IDENTITY / 02 MOTION / 03 SPATIAL / 04 EDITORIAL`, each cell =
index (mono) + Anton term + two-line mono description. Cells get a hover state:
background flips to noir, text to bone (brutal, instant-ish 0.25s).
Section enters with a clip-path wipe.

### 6 — Contact footer
Back to noir. `LET'S MAKE / SOMETHING GRAVE` Anton head, then the signature:
- **HELLO ring:** giant circular button — SVG ring of rotating text
  (`ATELIER NOIR — GET IN TOUCH — ` on a circular path, 24s linear infinite
  rotation) around a centered Anton `HELLO→`. 1px bone border, perfect circle.
  **Hover inverts:** bone fill, noir text, rotation continues.
- Mono columns: emails, cities, socials. Bottom rule + credits line.

## 6. Motion system (global)

- **Smooth scroll:** Lenis (`lerp .11`), driven by `gsap.ticker`;
  `ScrollTrigger.update` on Lenis scroll. `lagSmoothing(0)`.
- **Velocity bus:** one `ScrollTrigger` on the body reads
  `self.getVelocity()`; a lerped `vel` value feeds (a) hero/work `skewX`
  (±6° clamp), (b) marquee `timeScale` (sign = direction, magnitude 1–4).
- **Easing language:** `power4.out` entrances, `expo.out` fills/follows,
  `none` for scrubs.
- **Reveals:** every section head/kicker slides up 40px + fades via
  non-scrub ScrollTrigger (`start: top 85%`, play once).

## 7. Accessibility & resilience

- `prefers-reduced-motion: reduce` → Lenis not instantiated, all GSAP
  entrance/scrub/velocity effects skipped (content fully visible statically),
  marquee paused to a static band, ring rotation stopped. Implemented by
  gating all JS motion behind a `motionOK` check **and** CSS fallbacks.
- JS-off / CDN failure: content is visible by default; animation-hidden states
  are applied **by JS only** (`.js` class pattern) — never in base CSS.
- Semantic HTML (`header/main/section/footer`, `h1…h3`, list for works),
  focus-visible styles, `aria-hidden` on decorative split letters with a
  screen-reader-only full-word fallback, `aria-label` on the HELLO button.
- Responsive to 360px: fluid clamps, works rows wrap meta below title,
  services grid 1-col, corner meta reduced.

## 8. Tech constraints

- Static: `index.html`, `css/style.css`, `js/main.js`. Relative paths only
  (served from `/atelier-noir/` subpath).
- CDN: GSAP 3.12.5 + ScrollTrigger (cdnjs), Lenis 1.x (jsdelivr). No build,
  no npm, no Three.js, no external images (favicon = inline SVG data URI).
- `<title>`, meta description, OG tags, no console errors.
