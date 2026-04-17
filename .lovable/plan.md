
The user wants:
1. Collapsible sidebar nav (Dashboard, Market, Chat, Profile) — replace top nav
2. "Welcome back, Prajithaa" on dashboard (rename user)
3. Login page redesign with both Login + Sign Up tabs
4. Brand new rich, animated, expensive-looking landing page at `/` with Login/Sign Up buttons
5. Overall: highly professional, rich aesthetic

## Plan: Premium Landing Page + Sidebar Layout

### 1. New animated landing page (`src/routes/index.tsx`)
Replace current redirect-only index with a rich marketing page:
- **Hero**: dark navy gradient bg with subtle animated grid + floating gradient orbs (CSS keyframes), large display heading "Trade Engineering Skills. Level Up Together.", subhead, two CTA buttons (Login / Sign Up) → both route to `/login`
- **Logo bar**: faux company strip ("Trusted by engineers from…") with monochrome tech logos as text
- **Feature grid**: 3 cards with icons (Skill Marketplace / AI-powered Chat / Verified Engineers) with hover lift + gradient borders
- **Stats strip**: animated count-up numbers (skills exchanged, engineers, hours)
- **How it works**: 3-step horizontal flow with connecting line
- **Testimonials**: 3 quote cards with avatars from `public/avatars/`
- **Final CTA**: gradient panel with Sign Up button
- **Footer**: minimal
- Use Framer Motion (already in stack) for fade-in-on-scroll, staggered children
- Glassmorphic navbar at top with logo + Login/Sign Up buttons

### 2. Login page redesign (`src/routes/login.tsx`)
- Two-column layout: left = brand panel (navy gradient, logo, tagline, testimonial), right = card with **Tabs** (Login / Sign Up)
- Login tab: existing demo flow (email + password, demo autofill)
- Sign Up tab: name + email + password fields → on submit, just runs login (mock) and routes to dashboard with toast "Account created"
- Both tabs styled identically, polished

### 3. Collapsible sidebar (`src/components/AppLayout.tsx`)
- Replace top horizontal nav with shadcn `Sidebar` (collapsible="icon")
- Sidebar contains: Logo header, nav items (Dashboard, Market, Chat, Profile), bottom user card + logout
- Top header strip stays minimal: `SidebarTrigger` + page title + notifications bell + user avatar
- Mobile: sidebar becomes offcanvas drawer (default shadcn behavior)
- Remove `BottomNav`
- Wrap `PageShell` in `SidebarProvider`

### 4. User rename → Prajithaa
- Update `currentUser` in `src/lib/mock-data.ts`: name "Prajithaa Ramesh", title kept (Senior Backend Engineer), avatar stays (priya.png reused or arjun renamed — use existing female avatar `priya.png`)
- Dashboard greeting: "Welcome back, Prajithaa 👋"

### 5. Styles polish (`src/styles.css`)
Add utility keyframes/classes for landing:
- `@keyframes float`, `@keyframes gradient-shift`, `@keyframes grid-pan`
- Glass card utility, gradient text utility, animated border utility

### 6. Routing
- `/` → landing (public)
- `/login` → login/signup tabs (public)
- `/dashboard`, `/market`, `/chat`, `/profile` → behind auth, wrapped in sidebar shell
- Remove auto-redirect from `/` to dashboard when authenticated → instead landing page nav shows "Go to Dashboard" if logged in

### Files
**Edit**: `src/routes/index.tsx` (full rewrite landing), `src/routes/login.tsx` (tabs), `src/components/AppLayout.tsx` (sidebar), `src/lib/mock-data.ts` (user → Prajithaa), `src/lib/auth-context.tsx` (add `signup`), `src/routes/dashboard.tsx` (greeting), `src/styles.css` (animations)

**No new dependencies** — framer-motion + shadcn sidebar already available.
