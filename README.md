# The Connection Gap

A five-page static website on the digital divide in the Philippines, presenting **DigiSkills PH** — a free, offline-first mobile app that teaches digital literacy and online safety to Filipino children in low-connectivity homes on low-end devices. Built as a digital-media capstone.

## Pages (required five-page structure)
| File | Page | Purpose |
|------|------|---------|
| `index.html` | Home | Introduces the project, how DigiSkills PH works, and its phased roadmap |
| `about.html` | About | The creator, project objectives, and the course concepts it applies |
| `content1.html` | The Divide | Topic deep-dive: the three-level divide + current data |
| `content2.html` | Case Study | The pandemic remote-learning crisis as a real-world example, with video |
| `resources.html` | Resources | Curated links, course-aligned readings + a knowledge-check quiz |

## Light / dark theme
A theme toggle (sun/moon, in the header) switches the whole site between light and dark.
- The choice is **remembered** between visits (`localStorage`) and, on a first visit, follows the device's `prefers-color-scheme`.
- A tiny inline script in each page applies the saved theme **before paint**, so there is no flash.
- Contrast was verified to meet WCAG AA (≥ 4.5:1) for every text/background pair in **both** themes.

## Media
- **Photography** (`assets/img/`): seven photographs (six skyline/cityscape + one map), optimised for web (each ≤ ~450 KB). Used full-bleed in the hero and as section bands and figures.
- **Video**: the Case Study page features a CNA Insider documentary, *"How Did The Philippines Become One of Asia's Most Unequal Countries?"* It uses a **click-to-play facade**: the embed (privacy-friendly `youtube-nocookie.com`) loads only when the viewer clicks — which is faster, more private, and degrades gracefully. If the broadcaster has disabled embedding, a visible **"watch it on YouTube"** link always works.

## Accessibility (AODA → WCAG 2.0 Level AA)
- AA contrast (≥ 4.5:1) for all text in both themes; bright accents are used only on dark surfaces, with darker "ink" accent variants for light surfaces.
- One `<h1>` per page; logical headings; semantic landmarks; skip link; visible focus rings; `aria-current` nav; `prefers-reduced-motion` support.
- Every meaningful image has descriptive `alt` text; decorative scrims are `aria-hidden`; the video facade button has an `aria-label`.
- Layout reflows to a single column on small screens (no horizontal scroll); the mobile menu and theme toggle are keyboard-operable.
- **Video captions:** for full AA conformance (WCAG 1.2.2) the video must have captions — the player's CC button exposes them. Please confirm captions are available on the chosen video.

## Run locally
No build step. Double-click `index.html`, or serve the folder: `python3 -m http.server`, then open `http://localhost:8000`.

## Publish on GitHub Pages
1. Upload all files keeping the structure (`css/`, `js/`, `assets/img/`).
2. Repo → **Settings → Pages** → **Deploy from a branch** → your branch + `/ (root)` → **Save**.
3. The site appears at `https://<username>.github.io/<repo>/` within ~1 minute.

## Credits & notes
- Photographs are from **Unsplash** (free to use). Photographers: Gerald Escamos, Paolo Syiaco, Sean Yoro, Alexes Gerard, Bill Ringer, OJ Serrano. Crediting them is appreciated; please keep these credits if you publish.
- Video © CNA Insider (linked/embedded, not redistributed).
- Fonts (Archivo, Newsreader, Space Mono) load from Google Fonts. For a fully offline build, host the font files locally with `@font-face`.

---
Plain HTML / CSS / JS. No frameworks.
