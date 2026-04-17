
## Where the landing page is

It already lives at `/` (you're on `/login` right now — visit the root URL to see it). But I'll take it to the next level: more cinematic, more animated, more "expensive."

## Plan: Cinematic upgrade to the landing page

### 1. Hero — magazine-grade
- **Animated aurora mesh** background (multi-layer conic gradients that slowly rotate) + denser animated grid + parallax mouse-follow on the orbs
- **Live status pill** with pulsing dot ("847 engineers online")
- **Split headline** with per-word stagger reveal + animated gradient sweep across "Level up together"
- **Trust microcopy** under CTAs ("No credit card · 60-second signup · 3,800 verified engineers")
- **Floating preview card** (right side, desktop): a tilted glassmorphic mock of a "skill match" card that subtly drifts — gives instant product peek

### 2. New: Marquee logo strip
Infinite horizontal scrolling row of company logos (Stripe, Vercel, OpenAI, Databricks, Figma, Netflix, Airbnb, Datadog) — duplicated for seamless loop. Replaces the static row.

### 3. New: "Live network" visual section
Animated SVG showing nodes (engineers) connecting with pulse lines — represents the exchange network. Pure CSS/SVG with framer-motion — no library.

### 4. Features — premium cards
- Bento-grid layout (2 large + 4 small cards instead of 3 equal)
- Each card: animated gradient border on hover, icon with subtle float, mini-illustration inside (e.g., chat bubble preview, skill tag chips, verified badge)

### 5. New: "Built by engineers, for engineers" code panel
Dark terminal-style card showing a faux API snippet (`exchange.match({ skill: "system-design" })`) with syntax highlighting + animated typing effect

### 6. Stats — animated count-up
Numbers count from 0 → final value when scrolled into view (using framer-motion `useInView` + `animate`)

### 7. Testimonials — auto-rotating carousel
3 cards visible, gentle horizontal auto-scroll on hover-pause

### 8. Final CTA — premium gradient panel
Add animated noise texture overlay + subtle shimmer sweep across the headline

### 9. Footer — expanded
4-column footer (Product / Company / Resources / Legal) with social icons — feels like a real company

### Style additions (`src/styles.css`)
- `@keyframes aurora` (slow rotate)
- `@keyframes marquee` (linear infinite scroll)
- `@keyframes shimmer-sweep`
- `.text-shimmer` utility (animated gradient text mask)
- `.noise` utility (subtle SVG noise overlay)

### Files
**Edit only**: `src/routes/index.tsx` (full rewrite of landing), `src/styles.css` (new keyframes + utilities)

No new dependencies. Framer Motion is already installed.
