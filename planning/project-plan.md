# Animation Playground — Project Plan

## What We're Building

A browser-based animation playground — a simple gallery page where each animation you've built appears as a card. Click any card to see the animation play full-size with replay controls. Works on laptop and mobile.

**Your workflow going forward:**
1. You describe an animation in chat (with optional reference images/SVGs/PNGs)
2. I create the animation using the best tool for the job (CSS, GSAP, or Lottie)
3. It gets added to your gallery automatically
4. You open the browser to see it

---

## Tech Stack

| Layer | Tool | Why |
|-------|------|-----|
| Build tool | **Vite** | Fast dev server, hot reload, zero config |
| App code | **Vanilla HTML/CSS/JS** | No framework = animations are portable everywhere |
| Complex animations | **GSAP** (loaded via npm) | Industry standard, free, most powerful |
| Simple animations | **CSS / Web Animations API** | Zero dependencies, best performance |
| Portable animations | **Lottie** (lottie-web player) | For animations that need to work natively on mobile apps |
| Styling | **Plain CSS** with CSS custom properties | Simple, no build overhead |

---

## Project Structure

```
AI-animations-project/
  index.html              -- Gallery page (main entry)
  vite.config.js          -- Vite configuration
  package.json            -- Dependencies (vite, gsap, lottie-web)
  planning/
    project-plan.md       -- This file
  styles/
    main.css              -- Gallery layout, cards, responsive styles
    tokens.css            -- Design tokens (colors, spacing, fonts)
  scripts/
    gallery.js            -- Renders animation cards, handles navigation
    registry.js           -- Central list of all animations (metadata)
  animations/
    001-bounce-button/
      index.html          -- Standalone preview page for this animation
      meta.json           -- Name, description, type (gsap/css/lottie), tags
      assets/             -- Any SVGs, PNGs, or Lottie JSON files
    002-pulse-loader/
      ...
    003-lottie-check/
      ...
```

**Key design decisions:**
- Each animation lives in its own folder with a standalone `index.html` — this means any animation can be opened independently or embedded anywhere via iframe
- `meta.json` describes each animation so the gallery can render cards without loading animation code
- `registry.js` is a simple array that lists all animations — I update it each time I add one

---

## Gallery Page

A clean, responsive grid of cards:
- Each card shows: animation name, short description, type badge (GSAP / CSS / Lottie), and a live preview via iframe
- Click a card to open the animation full-size in a modal with play/replay/pause controls
- Works on mobile (cards stack vertically)
- Minimal, modern dark-themed UI

---

## Export & Embed Features

Every animation in the viewer has these options:

**Download:**
- **MP4/WebM** — Records the animation playing using the browser's MediaRecorder API
- **GIF** — Same recording flow, encoded as GIF client-side (planned)

**Embed on a website:**
- **iframe snippet** — One line of HTML to embed the animation on any page
- **Direct link** — URL to the standalone animation page
- **Usage info** — Instructions on how to use the animation in your project

---

## How Each Animation Type Works

**CSS animations:**
- Pure CSS `@keyframes` + transitions
- Smallest footprint, most portable
- Used for: hovers, fades, simple transforms, loading spinners

**GSAP animations:**
- GSAP loaded via npm
- Used for: complex timelines, scroll effects, SVG morphing, staggered sequences, drag interactions

**Lottie animations:**
- Lottie JSON files stored in the animation's `assets/` folder
- Played via `lottie-web` library
- Used for: animations you want to reuse in mobile apps (iOS/Android)
- Most portable format

---

## Mobile App Reuse Path (For Later)

When you want to use animations in a mobile app:
- **Lottie animations:** Download the JSON file, drop it into any Lottie player (iOS, Android, Flutter, React Native) — works instantly
- **CSS animations:** Wrap in a WebView — works as-is
- **GSAP animations:** Either wrap in a WebView, or convert to Lottie where possible
