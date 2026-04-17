// ─── DSA USED IN THIS FILE ─────────────────────────────────────
// • Trie (src/lib/dsa/trie.ts)        — O(L) prefix lookup
// • Levenshtein DP (fuzzySearch.ts)   — typo-tolerant matching
// • Quicksort (quickSort.ts)          — sort by rating/price/distance
// • Binary search (binarySearch.ts)   — O(log n) price-range filter
// • Debounce (debounce.ts)            — limits search recompute to 1
//                                        per 200ms while user types
// ───────────────────────────────────────────────────────────────

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/lib/auth-context";
import { useExchanges } from "@/lib/exchanges-context";
import { categories, levels, type Skill } from "@/lib/mock-data";
import {
  Trie, fuzzyMatch, quickSort, rangeQuery, useDebouncedValue,
} from "@/lib/dsa";
import { PageShell } from "@/components/AppLayout";
import { SkillCard } from "@/components/SkillCard";
import { PostSkillDialog } from "@/components/PostSkillDialog";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

type SortKey = "relevance" | "rating" | "priceAsc" | "priceDesc" | "distance";

export const Route = createFileRoute("/market")({
  head: () => ({
    meta: [
      { title: "Skill Market — The Exchange" },
      { name: "description", content: "Browse engineering skills offered by other software engineers nearby." },
    ],
  }),
  component: MarketPage,
});

function MarketPage() {
  const { isAuthenticated, user } = useAuth();
  const { skills: allSkillsCtx } = useExchanges();
  const skills = useMemo(
    () => allSkillsCtx.filter(s => s.postedBy !== user?.id),
    [allSkillsCtx, user?.id]
  );
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 200); // DSA: debounce
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeLevel, setActiveLevel] = useState<(typeof levels)[number]>("All Levels");
  const [sortBy, setSortBy] = useState<SortKey>("relevance");
  const [maxPrice, setMaxPrice] = useState<number>(2000); // ₹/hr cap

  useEffect(() => {
    if (!isAuthenticated) navigate({ to: "/login" });
  }, [isAuthenticated, navigate]);

  // Build a Trie once per skills list (DSA: trie)
  const { trie, byId } = useMemo(() => {
    const t = new Trie();
    const map = new Map<string, Skill>();
    for (const s of skills) {
      map.set(s.id, s);
      // Insert each word of title and tags
      for (const w of s.title.split(/\s+/)) if (w) t.insert(w, s.id);
      for (const tag of s.tags) for (const w of tag.split(/\s+/)) if (w) t.insert(w, s.id);
    }
    return { trie: t, byId: map };
  }, [skills]);

  // Sort by price once for binary-search range query
  const skillsSortedByPrice = useMemo(
    () => quickSort(skills, (a, b) => a.pricePerHour - b.pricePerHour), // DSA: quicksort
    [skills]
  );

  const filtered = useMemo(() => {
    const q = debouncedSearch.trim().toLowerCase();

    // 1) Price-range pre-filter using binary search (O(log n + k))
    const inPrice = rangeQuery(skillsSortedByPrice, 0, maxPrice, s => s.pricePerHour); // DSA: binary search

    // 2) Search: prefer trie prefix matches, fall back to fuzzy
    let candidateIds: Set<string> | null = null;
    if (q) {
      const tokens = q.split(/\s+/).filter(Boolean);
      // Intersect trie hits across tokens
      for (const tok of tokens) {
        const hits = trie.searchPrefix(tok);
        if (candidateIds === null) {
          candidateIds = new Set<string>(hits);
        } else {
          const prev: Set<string> = candidateIds;
          candidateIds = new Set<string>([...prev].filter((x: string) => hits.has(x)));
        }
      }
    }

    const result = inPrice.filter(s => {
      // Search match (trie hit OR fuzzy fallback)
      let matchSearch = !q;
      if (q) {
        const triedHit = candidateIds?.has(s.id) ?? false;
        if (triedHit) matchSearch = true;
        else {
          const hay = `${s.title} ${s.description} ${s.tags.join(" ")}`;
          matchSearch = fuzzyMatch(hay, q, 2); // DSA: Levenshtein DP
        }
      }
      const matchCat = activeCategory === "All" || s.category === activeCategory;
      const matchLevel = activeLevel === "All Levels" || s.level === activeLevel;
      return matchSearch && matchCat && matchLevel;
    });

    // 3) Sort with quicksort (DSA: divide & conquer)
    const cmp = (() => {
      switch (sortBy) {
        case "rating": return (a: Skill, b: Skill) => b.rating - a.rating;
        case "priceAsc": return (a: Skill, b: Skill) => a.pricePerHour - b.pricePerHour;
        case "priceDesc": return (a: Skill, b: Skill) => b.pricePerHour - a.pricePerHour;
        case "distance": return (a: Skill, b: Skill) => parseFloat(a.distance) - parseFloat(b.distance);
        default: return (a: Skill, b: Skill) => b.rating - a.rating;
      }
    })();
    return quickSort(result, cmp);
  }, [byId, trie, skillsSortedByPrice, debouncedSearch, activeCategory, activeLevel, sortBy, maxPrice]);

  if (!isAuthenticated) return null;

  return (
    <PageShell>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Skill Market</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            What will you learn next?
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Search powered by a Trie + Levenshtein fuzzy match. Sort with quicksort, range-filter price via binary search.
          </p>
        </div>
        <PostSkillDialog />
      </div>

      {/* Filter bar */}
      <Card className="sticky top-[56px] z-20 mb-6 border-border bg-card shadow-none">
        <CardContent className="space-y-3 p-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_180px_180px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search (try a typo: kuburnetes)…"
                className="pl-9"
              />
            </div>
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortKey)}>
              <SelectTrigger><SelectValue placeholder="Sort by" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Best match</SelectItem>
                <SelectItem value="rating">Top rated</SelectItem>
                <SelectItem value="priceAsc">Price: low → high</SelectItem>
                <SelectItem value="priceDesc">Price: high → low</SelectItem>
                <SelectItem value="distance">Nearest first</SelectItem>
              </SelectContent>
            </Select>
            <Select value={String(maxPrice)} onValueChange={(v) => setMaxPrice(parseInt(v, 10))}>
              <SelectTrigger><SelectValue placeholder="Max price" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Free swap only</SelectItem>
                <SelectItem value="500">≤ ₹500/hr</SelectItem>
                <SelectItem value="1000">≤ ₹1000/hr</SelectItem>
                <SelectItem value="1500">≤ ₹1500/hr</SelectItem>
                <SelectItem value="2000">Any price</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                  activeCategory === cat
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground hover:bg-muted"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 border-t border-border pt-3">
            <span className="self-center text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Level:</span>
            {levels.map(lvl => (
              <button
                key={lvl}
                onClick={() => setActiveLevel(lvl)}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                  activeLevel === lvl
                    ? "border-navy bg-navy text-navy-foreground"
                    : "border-border bg-card text-muted-foreground hover:bg-muted"
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{filtered.length}</span> skill{filtered.length === 1 ? "" : "s"} found
        </p>
      </div>

      {filtered.length === 0 ? (
        <Card className="border-dashed bg-card text-center">
          <CardContent className="p-12">
            <p className="text-sm text-muted-foreground">No skills match your filters.</p>
            <button
              onClick={() => { setSearch(""); setActiveCategory("All"); setActiveLevel("All Levels"); setSortBy("relevance"); setMaxPrice(2000); }}
              className="mt-2 text-sm font-medium text-primary hover:underline"
            >
              Reset filters
            </button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map(skill => (
            <SkillCard key={skill.id} skill={skill} />
          ))}
        </div>
      )}
    </PageShell>
  );
}
