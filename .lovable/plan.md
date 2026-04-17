
## Why you can't see the landing page

It exists at `/` (root URL) and is fully built — animated aurora hero, marquee logos, live network SVG, bento features, typing terminal, count-up stats, testimonials, footer. The problem is **navigation**: you're stuck on `/login` because:
1. There's no visible "back to home" link from `/login`
2. Once authenticated, `/login` auto-redirects to `/dashboard`, skipping `/`
3. The sidebar inside the app has no link back to the landing page

## Plan: Make the landing page reachable + elevate it further

### 1. Fix discoverability (the real bug)
- Add a **"← Back to home"** link at the top-left of `/login` that routes to `/`
- Add a **"Home"** / logo click in the app sidebar (`AppLayout.tsx`) that routes to `/`
- Keep `/login` redirect to `/dashboard` only when user submits — not on mount if they came from `/`

### 2. Elevate the landing page to truly "grand & rich"
Even though it's already cinematic, push it further:

- **Hero upgrades**
  - Add a **3D-tilt** effect on the floating preview card (mouse-follow rotateX/rotateY via framer-motion)
  - Add a **spotlight cursor** glow that follows the mouse across the hero
  - Replace the static "847 engineers online" pill with a **live ticker** that changes numbers every few seconds
  - Add **scroll-indicator** chevron at the bottom of hero with bounce animation

- **New section: "Skills in motion"** (between marquee and features)
  - Horizontal scrolling row of large skill tag chips (System Design, Kubernetes, ML Ops, etc.) that scroll opposite direction to the logo marquee — creates depth

- **Bento grid polish**
  - Add **animated gradient borders** that rotate around each card on hover (conic-gradient mask trick)
  - Add **mini-charts** inside one of the small cards (animated SVG sparkline)

- **New section: "Meet the engineers"** (before testimonials)
  - 4-column grid of avatar cards from `public/avatars/` with name, role, specialty tags
  - Hover lifts card with shadow + reveals "View profile" button

- **Pricing teaser** (new section, before final CTA)
  - 3 plan cards (Free / Pro $19 / Team $49) with checkmark feature lists, "Most popular" ribbon on Pro

- **Final CTA upgrade**
  - Add **animated noise texture** + **glowing orbit ring** around the headline
  - Two CTAs: "Start free" + "Talk to sales"

- **Sticky top nav** with **scroll-blur** (backdrop-filter increases with scroll)

### 3. Files to edit
- `src/routes/index.tsx` — add new sections (Skills marquee #2, Engineers grid, Pricing, hero spotlight, scroll indicator)
- `src/routes/login.tsx` — add "Back to home" link
- `src/components/AppLayout.tsx` — make sidebar logo link to `/`
- `src/styles.css` — add `@keyframes` for spotlight, orbit-ring, scroll-bounce; add `.spotlight` and `.tilt-card` utilities

No new dependencies. After this, the landing page will be unmistakably visible and significantly richer.
