
## Redesign: Professional CS/Engineering Skill Exchange

Pivot the project from generic skills (cooking, music, gardening) to a **CS & Engineering-only** platform with a professional, structured, card-based UI and realistic human avatars.

### 1. Domain pivot — CS/Engineering only

**New characters** (replace mock users, generate realistic photo-style avatars via Nano Banana stored as static images in `public/avatars/`):
- **Marcus Thorne** → **Arjun Mehta** — Senior Backend Engineer (Distributed Systems, Go, Kubernetes)
- **Elena Vance** → **Priya Sharma** — ML Engineer (PyTorch, Computer Vision, MLOps)
- **David Kim** → stays — Senior Frontend Engineer (React, TypeScript, Next.js)
- **Sarah Chen** → stays — UI/UX Engineer (Design Systems, Figma-to-Code)
- **Priya Nair** → **Rohan Desai** — DevOps / Cloud Architect (AWS, Terraform, CI/CD)
- **Jean Pierre** → **Liam O'Brien** — Cybersecurity Specialist (Pen Testing, OWASP)
- **Aisha Malik** → stays — Data Engineer (SQL, Spark, Airflow)
- **Julian Chen** → stays — Mobile Engineer (React Native, Swift)

**New skill catalog** (~10 skills) — examples: Data Structures & Algorithms, System Design, Docker & Kubernetes, Machine Learning Fundamentals, REST API Design, Git & Collaboration, AWS for Beginners, TypeScript Deep Dive, OAuth & Auth Flows, SQL Query Optimization.

**New categories:** All, Algorithms, Web Dev, Backend, DevOps, ML/AI, Mobile, Security, Data, System Design.

### 2. Realistic avatars (replace DiceBear cartoons)

Use the AI gateway image skill (`google/gemini-3.1-flash-image-preview`) to generate 8 professional headshot-style photos (neutral background, decent expressions, diverse, business-casual). Save to `/public/avatars/{name}.png` and reference via `/avatars/...` URLs.

Skill cover images: keep existing Unsplash but swap to tech-themed photos (code editors, server racks, whiteboards, ML diagrams).

### 3. Card-based, structured, professional UI

**Global design refresh** in `src/styles.css`:
- Tighten palette: pure white surfaces (`#FFFFFF`), slate background (`#F8FAFC`), navy primary (`#1E293B` / accent `#2563EB`), subtle borders (`#E2E8F0`).
- Remove the gradient stat-card backgrounds (blue/green/orange tints) → replace with clean white cards + colored icon chips.
- Stronger typographic hierarchy: section eyebrow labels, consistent 12/14/16/20/24px scale.
- Use shadcn `Card` / `Badge` primitives consistently across all pages.

**Layout grid**:
- Bump container from `max-w-lg` → `max-w-6xl` with responsive grids (1 col mobile → 2/3 cols desktop) so it actually feels like a structured dashboard, not a cramped phone view.
- Sidebar nav for desktop (≥md) + bottom nav for mobile.

**Per-page card structure**:

- **Dashboard** — 3-column KPI cards (Skills Exchanged / Hours Earned / Rating) with icon chip + label + value + trend; "Active Exchanges" as a clean table-like card list with avatar, skill, status badge, progress bar, action button; "Recommended Skills" 3-column card grid.
- **Market** — Sticky filter bar (search + category chips + level filter), 3-column responsive skill card grid. Each card: cover image, level badge, title, instructor row, description (2 lines clamped), tags, footer with rating + distance + "Request Exchange" button.
- **Profile** — 2-column layout: left sticky card (avatar, name, title, location, verified badge, stats grid, action buttons); right column stacked cards (About, Skills Offered, Skills Needed, Reviews list, Skill Completion).
- **Chat** — 2-pane layout on desktop (conversation list left, message thread right), single-pane on mobile. Cleaner message bubbles, character profile header card with their tech specialty shown.
- **Login** — Centered card with logo, demo credentials hint card, autofill button.

### 4. Functional/interactive additions

- **"Request Exchange" button** on skill cards opens a confirmation toast + adds to active exchanges (in-memory state via a small Zustand-free React context).
- **Working "Post Skill" modal** — a dialog form (title, category, level, description, tags) that prepends a new skill to the market list for the session.
- **Notifications dropdown** on the bell icon (3 mock notifications).
- **Filters work end-to-end**: search + category + level chip combine.
- **Chat AI** — update `CHARACTER_PROFILES` in `supabase/functions/chat-reply/index.ts` with the new CS personas (Arjun, Priya Sharma, David, Sarah, Rohan, Liam) so each replies in their domain (e.g., Arjun answers system design questions correctly, Liam answers security questions, etc.). Keep streaming + the existing UI.

### 5. Files to change

Edit:
- `src/styles.css` — palette + remove gradient stat cards
- `src/lib/mock-data.ts` — full rewrite: CS personas, CS skills, CS categories, avatar paths
- `src/components/AppLayout.tsx` — add desktop sidebar, refine header
- `src/routes/dashboard.tsx`, `market.tsx`, `profile.tsx`, `chat.tsx`, `login.tsx` — restructure with shadcn `Card`, responsive grids
- `supabase/functions/chat-reply/index.ts` — new character profiles
- `README.md` + `DSA_CONCEPTS.md` — update names/skills to match
- `mem://index.md` + create `mem://design/cs-domain.md`

Create:
- `public/avatars/*.png` — 8 generated realistic headshots (via image-gen script)
- `src/components/SkillCard.tsx`, `StatCard.tsx`, `PostSkillDialog.tsx` — reusable cards/dialog

### 6. Demo credentials (unchanged)

`marcus@exchange.demo` / `demo1234` — but the logged-in user becomes **Arjun Mehta** (rename in mock-data; keep email for muscle memory).
