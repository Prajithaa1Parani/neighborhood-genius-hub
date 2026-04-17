import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/lib/auth-context";
import { useExchanges } from "@/lib/exchanges-context";
import { categories, levels } from "@/lib/mock-data";
import { PageShell } from "@/components/AppLayout";
import { SkillCard } from "@/components/SkillCard";
import { PostSkillDialog } from "@/components/PostSkillDialog";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search } from "lucide-react";

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
  const { isAuthenticated } = useAuth();
  const { skills } = useExchanges();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeLevel, setActiveLevel] = useState<(typeof levels)[number]>("All Levels");

  useEffect(() => {
    if (!isAuthenticated) navigate({ to: "/login" });
  }, [isAuthenticated, navigate]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return skills.filter(s => {
      const matchSearch = !q || s.title.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.tags.some(t => t.toLowerCase().includes(q));
      const matchCat = activeCategory === "All" || s.category === activeCategory;
      const matchLevel = activeLevel === "All Levels" || s.level === activeLevel;
      return matchSearch && matchCat && matchLevel;
    });
  }, [skills, search, activeCategory, activeLevel]);

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
            Browse skills offered by engineers across web, backend, ML, DevOps and security.
          </p>
        </div>
        <PostSkillDialog />
      </div>

      {/* Filter bar */}
      <Card className="sticky top-[64px] z-20 mb-6 border-border bg-card/95 shadow-none backdrop-blur">
        <CardContent className="space-y-3 p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search skills, tags, or topics…"
              className="pl-9"
            />
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
            <button onClick={() => { setSearch(""); setActiveCategory("All"); setActiveLevel("All Levels"); }} className="mt-2 text-sm font-medium text-primary hover:underline">
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
