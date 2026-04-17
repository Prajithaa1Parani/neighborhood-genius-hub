

## Plan: Hover-collapsible Sidebar, Profile Pages, Working Notifications/Chat & DSA Integration

### 1. Sidebar — icon-only by default, expand on hover
Change `src/components/AppLayout.tsx`:
- Set `Sidebar` default state to `collapsed` (icon-only, ~3rem wide)
- Add `onMouseEnter` → expand, `onMouseLeave` → collapse (controlled `open` state via `SidebarProvider`)
- Solid (non-transparent) background: change `TopBar` from `bg-card/80 backdrop-blur` to solid `bg-card`
- Footer shows just **"Prajithaa"** (first name only)

### 2. Rename user → "Prajithaa"
In `src/lib/mock-data.ts`: change `currentUser.name` from `"Prajithaa Ramesh"` to `"Prajithaa"`. Dashboard greeting already uses first name.

### 3. Skill exchange with charging + ratings
Update `Skill` type in `mock-data.ts` to include `pricePerHour: number` (0 = free swap). Update all 10 mock skills with prices (₹0–₹1500/hr). In `SkillCard.tsx` show price badge + existing rating. In `PostSkillDialog.tsx` add a price input (with "Free skill swap" toggle).

### 4. Mentor profile pages (new full route)
Create `src/routes/mentor.$mentorId.tsx` — rich, structured profile page for any mentor:
- Hero band: avatar, name, title, verified badge, rating, location, hourly price, **Message** + **Request Exchange** CTAs
- Sections (cards): About, Skills they teach (full list with levels/prices), Skills they want to learn, Experience timeline, Reviews, Availability
- Build a `mentors` registry in `mock-data.ts` keyed by id (derived from existing instructor names + avatars + augmented bios/skills)
- Add 404 `notFoundComponent` per Tanstack rules
- In **Market** (`SkillCard.tsx`): add a **"View profile"** icon button (UserRound icon) next to the Request button → links to `/mentor/$mentorId`
- In **Chat** thread header: avatar + name become a link to `/mentor/$mentorId`
- In **Dashboard** active exchanges: partner avatar links to mentor profile

### 5. Functional notifications
Replace static array with stateful notifications in `AppLayout.tsx`:
- `useState` list with `read: boolean` flag, badge count = unread only
- Click notification → mark read, navigate to relevant route (chat / market / dashboard)
- "Mark all as read" button in popover header
- "Clear all" button at bottom
- Add 2 more notification types so popover feels alive

### 6. Functional chat — bug fixes
In `src/routes/chat.tsx`:
- Fix unread badge: clear `convo.unread` on select (currently never resets)
- Fix `lastMessage` + `timestamp` in conversation list to update after sending
- Use `useState(conversations)` instead of imported const so list re-renders
- Disable send while empty + add Enter-to-send (already works but double-check shift-enter inserts newline via `<Textarea>`)
- Persist messages per convo on switch (already does)
- Fix scroll-to-bottom on convo switch (currently only triggers on length change)

### 7. DSA algorithms (the academic centerpiece)
Create a new file **`src/lib/dsa/`** folder with named, commented implementations actually used by the app. Each function has a header comment: *what DSA, why used, time/space complexity*.

| File | DSA used | Where it powers the app |
|---|---|---|
| `src/lib/dsa/trie.ts` | **Trie (prefix tree)** | Market search autocomplete — O(L) prefix lookup over all skill titles/tags |
| `src/lib/dsa/fuzzySearch.ts` | **Levenshtein distance (DP)** | Market typo-tolerant search ("kuburnetes" → Kubernetes) |
| `src/lib/dsa/quickSort.ts` | **Quicksort (divide & conquer)** | Sort skills by rating / price / distance in Market |
| `src/lib/dsa/binarySearch.ts` | **Binary search** | Filter skills within a price range on sorted array |
| `src/lib/dsa/priorityQueue.ts` | **Min-heap / priority queue** | Notifications ordered by recency + priority weight |
| `src/lib/dsa/lru.ts` | **LRU cache (HashMap + Doubly linked list)** | Cache last 5 viewed mentor profiles for instant back-navigation |
| `src/lib/dsa/graph.ts` | **Graph + BFS** | "Recommended mentors" — BFS over a skill-similarity graph from user's `skillsNeeded` (shortest path = most relevant mentor) |
| `src/lib/dsa/debounce.ts` | **Debouncing (queue/timer)** | Search input — limits trie queries to 1 per 200ms |

**Integration points** (so the DSA isn't dead code):
- `market.tsx` — use `Trie` + `fuzzySearch` for search, `quickSort` for sort dropdown (new), `binarySearch` for price-range filter (new), `debounce` for input
- `dashboard.tsx` — use `graph.bfs` to compute "Recommended for you"
- `mentor.$mentorId.tsx` — `LRU` cache hooks
- `AppLayout.tsx` — `priorityQueue` to order notifications

Each integration point gets a top-of-file comment block:
```ts
// ─── DSA USED IN THIS FILE ─────────────────────────
// • Trie (src/lib/dsa/trie.ts) — prefix search
// • Quicksort (src/lib/dsa/quickSort.ts) — sort by rating
// ───────────────────────────────────────────────────
```

Update **`DSA_CONCEPTS.md`** at project root with a clear table:
- DSA name → file path → exact line range → real-world purpose in this app → time/space complexity → talking points for the viva

### Files to edit / create

**Edit**: `src/components/AppLayout.tsx`, `src/lib/mock-data.ts`, `src/components/SkillCard.tsx`, `src/components/PostSkillDialog.tsx`, `src/routes/market.tsx`, `src/routes/chat.tsx`, `src/routes/dashboard.tsx`, `DSA_CONCEPTS.md`

**Create**: `src/routes/mentor.$mentorId.tsx`, `src/lib/dsa/{trie,fuzzySearch,quickSort,binarySearch,priorityQueue,lru,graph,debounce}.ts`, `src/lib/dsa/index.ts` (barrel)

No new dependencies.

