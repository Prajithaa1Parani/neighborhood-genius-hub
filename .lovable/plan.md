

## Plan: My Posts page, session history, second demo user

### 1. "My Posts" — separate from Market
- New route `src/routes/my-posts.tsx` — lists skills posted by current user
- Add `postedBy: string` (user id) to `Skill` type in `mock-data.ts`
- Update `postSkill` in `exchanges-context.tsx` to stamp `postedBy: currentUser.id`
- In `market.tsx`: filter out skills where `postedBy === currentUser.id` (you can't request your own skill)
- Add **"My Posts"** sidebar item in `AppLayout.tsx` (icon: `FileText` or `Briefcase`)
- My Posts page shows: posted skills as cards with edit/delete + view count + request count + status badge

### 2. Session History
- New route `src/routes/history.tsx` — past completed exchanges
- Add `completedExchanges` array to `mock-data.ts` (5-6 mock past sessions: skill, partner, date, duration, rating given, rating received, notes)
- Add **"History"** sidebar item (icon: `History`)
- Page layout: timeline-style list grouped by month, each entry = card with partner avatar (links to mentor profile), skill name, date, duration, both ratings, "Leave review" if not yet rated
- Stats header: total sessions, total hours, avg rating

### 3. Second demo user (cross-account testing)
- In `mock-data.ts`: add a second user `Aarav Kumar` with own id, avatar, skills
- Export `DEMO_CREDENTIALS_2 = { email: "aarav@exchange.demo", password: "demo1234" }`
- Update `auth-context.tsx` `login()` to check both credential pairs and set the matching user
- Update `login.tsx` demo credentials box to show **both** accounts side-by-side with "Auto-fill" buttons for each
- Pre-seed one mock skill posted by Aarav so when you log in as Prajithaa you see Aarav's post in Market (and vice versa)

### 4. DSA touch (for the viva)
- Use existing `quickSort` in My Posts (sort by date/views) and History (sort by date)
- Use existing `priorityQueue` in History to surface "needs review" sessions first
- Add comment headers in both new files documenting which DSA powers what

### 5. Files

**Create**: `src/routes/my-posts.tsx`, `src/routes/history.tsx`

**Edit**: `src/lib/mock-data.ts` (add user 2, postedBy field, completedExchanges, prices already done), `src/lib/auth-context.tsx` (multi-user login), `src/lib/exchanges-context.tsx` (stamp postedBy, expose completedExchanges), `src/routes/market.tsx` (filter own posts), `src/routes/login.tsx` (show 2 demo accounts), `src/components/AppLayout.tsx` (2 new sidebar items), `DSA_CONCEPTS.md` (note new usages)

No new dependencies.

