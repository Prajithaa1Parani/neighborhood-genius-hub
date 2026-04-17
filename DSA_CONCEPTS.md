# 🧠 DSA Concepts in The Exchange — Engineering Skill Network

> **For your viva:** every algorithm below is *actually wired up* and powers a real feature in the app — it's not dead code. Files & line numbers are exact.

---

## Quick Reference Table

| # | Algorithm / DS | File | Powers | Time | Space |
|---|---|---|---|---|---|
| 1 | **Trie (Prefix Tree)** | `src/lib/dsa/trie.ts` | Market search prefix lookup | Insert `O(L)`, Search `O(L+k)` | `O(N·L)` |
| 2 | **Levenshtein Distance (DP)** | `src/lib/dsa/fuzzySearch.ts` | Typo-tolerant search | `O(m·n)` | `O(min(m,n))` |
| 3 | **Quicksort (Divide & Conquer)** | `src/lib/dsa/quickSort.ts` | Sort by rating / price / distance | Avg `O(n log n)` | `O(log n)` |
| 4 | **Binary Search (lower/upper bound)** | `src/lib/dsa/binarySearch.ts` | Price-range filter on sorted array | `O(log n)` | `O(1)` |
| 5 | **Min-Heap / Priority Queue** | `src/lib/dsa/priorityQueue.ts` | Notification ordering | push/pop `O(log n)` | `O(n)` |
| 6 | **LRU Cache (HashMap + ordered Map)** | `src/lib/dsa/lru.ts` | Cache last 5 mentor profiles | get/put `O(1)` | `O(capacity)` |
| 7 | **Graph + BFS** | `src/lib/dsa/graph.ts` | "Recommended for you" on Dashboard | `O(V+E)` | `O(V)` |
| 8 | **Debouncing (timer queue)** | `src/lib/dsa/debounce.ts` | Search input throttling | `O(1)` per call | `O(1)` |
| 9 | **Hash Map** (`Record<string, ChatMessage[]>`) | `src/routes/chat.tsx` | O(1) message lookup by convoId | `O(1)` avg | `O(n)` |
| 10 | **Queue (FIFO)** | `src/routes/chat.tsx` | Chronological message append | enqueue `O(1)` | `O(n)` |
| 11 | **Buffered Stream Parsing** | `src/routes/chat.tsx` | SSE chunk → line decoding | `O(n)` per byte | `O(buffer)` |
| 12 | **State Machine (FSM)** | `src/lib/auth-context.tsx`, `src/routes/chat.tsx` | Auth states, typing states | `O(1)` per transition | `O(1)` |

---

## 1. Trie (Prefix Tree) — `src/lib/dsa/trie.ts`

**Where it's used:** `src/routes/market.tsx` lines ~57-64 build the Trie from every skill title + tag, then `searchPrefix(tok)` returns matching skill IDs in `O(L)`.

**Talking points**
- Each node stores a `Map<char, TrieNode>` plus a `Set<id>` of all skill IDs that pass through it — so prefix lookup also returns *which* skills match, not just whether anything matches.
- Multi-token queries are handled by **set intersection** of per-token results.

---

## 2. Levenshtein Distance (Dynamic Programming) — `src/lib/dsa/fuzzySearch.ts`

**Where it's used:** Market search falls back to fuzzy match when the Trie returns nothing — `fuzzyMatch(hay, q, 2)` allows up to 2 edits, so typing `kuburnetes` still surfaces the Kubernetes course.

**Talking points**
- Classic edit-distance DP recurrence: `dp[i][j] = min(dp[i-1][j]+1, dp[i][j-1]+1, dp[i-1][j-1]+cost)`
- We use the **rolling-row optimization** → space drops from `O(m·n)` to `O(min(m,n))`.
- Sliding-window scan over `text` lets us match a small typo'd query inside a long description.

---

## 3. Quicksort — `src/lib/dsa/quickSort.ts`

**Where it's used:** Market `Sort by` dropdown (rating / price asc / price desc / distance) at `src/routes/market.tsx` lines ~107-120.

**Talking points**
- Lomuto partition, recursive divide & conquer.
- Comparator passed in → reusable across keys.
- We avoid mutating input by cloning first (functional safety).

---

## 4. Binary Search + Range Query — `src/lib/dsa/binarySearch.ts`

**Where it's used:** Market price filter — `rangeQuery(skillsSortedByPrice, 0, maxPrice)` returns the slice in `O(log n + k)` instead of scanning all skills.

**Talking points**
- `lowerBound` and `upperBound` mirror C++ STL semantics.
- Pre-sorting once via quicksort (memoized) lets every subsequent filter be logarithmic.

---

## 5. Min-Heap / Priority Queue — `src/lib/dsa/priorityQueue.ts`

**Where it's used:** Notifications in the top bar — `src/components/AppLayout.tsx` lines ~62-76. Each notification gets a score = `priority*100 + recency + readPenalty`; the heap drains the **most urgent unread** first.

**Talking points**
- Array-backed binary heap, parent at `(i-1)>>1`, children at `2i+1` / `2i+2`.
- `bubbleUp` after push, `sinkDown` after pop — both `O(log n)`.

---

## 6. LRU Cache — `src/lib/dsa/lru.ts`

**Where it's used:** `src/routes/mentor.$mentorId.tsx` — the route loader caches the last 5 viewed profiles. Re-opening one is `O(1)`.

**Talking points**
- Implemented via JavaScript `Map`, which preserves insertion order. Re-inserting an existing key (delete → set) moves it to "most recently used".
- When size > capacity, evict the first key returned by `keys().next()` — that's the LRU entry.

---

## 7. Graph + BFS — `src/lib/dsa/graph.ts`

**Where it's used:** Dashboard "Recommended for you" — `src/routes/dashboard.tsx` lines ~46-72.
- Build bipartite graph: `skill:<title>` ↔ `mentor:<id>`, plus `tag` ↔ `skill` edges.
- Run **multi-source BFS** from tokens of `user.skillsNeeded`.
- Mentors connected by the **shortest path** rank highest → most relevant.

**Talking points**
- Adjacency list via `Map<N, Set<N>>`.
- Iterative BFS using a head index instead of `Array.shift()` (which is `O(n)`) → keeps the algorithm true `O(V+E)`.

---

## 8. Debounce — `src/lib/dsa/debounce.ts`

**Where it's used:** `useDebouncedValue(search, 200)` in `src/routes/market.tsx`. Limits Trie + fuzzy recompute to **once per 200 ms** of typing — same idea Google uses for its search box.

---

## 9-12. Other Concepts in the Codebase

- **Hash Map:** `chatMessages: Record<string, ChatMessage[]>` — O(1) message-list lookup.
- **Queue (FIFO):** chat thread always appends new messages to the end and renders front-to-back.
- **Buffered Stream Parsing:** the SSE reader in `src/routes/chat.tsx` decodes a `Uint8Array` byte-stream into `\n`-delimited JSON events using a rolling buffer.
- **Finite State Machine:** auth has `{UNAUTHENTICATED, AUTHENTICATED}` and chat has `{IDLE, TYPING}`.

---

## How to Demonstrate to Sir

1. Open **Market** → type `kuburnetes` → fuzzy match finds Kubernetes (Levenshtein DP).
2. Type `react` → results appear after 200 ms (debounce + Trie prefix).
3. Change "Sort by" → Quicksort re-orders.
4. Pick "≤ ₹500/hr" → Binary-search range query slices the sorted array.
5. Open **Dashboard** → "Recommended for you" → BFS over skill-similarity graph.
6. Open **bell icon** → most-urgent unread first → priority-queue ordering.
7. Open a **mentor profile**, navigate away, come back → instant load = LRU cache hit.

All algorithms live under `src/lib/dsa/` and each file's header comment documents its DSA, complexity, and where it's used.
