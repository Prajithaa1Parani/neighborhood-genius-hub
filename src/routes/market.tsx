import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { allSkills, categories } from "@/lib/mock-data";
import { AppHeader, BottomNav } from "@/components/AppLayout";
import { Search, Star, MapPin, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/market")({
  head: () => ({
    meta: [
      { title: "Skill Market — The Exchange" },
      { name: "description", content: "Browse and discover skills in your neighborhood" },
    ],
  }),
  component: MarketPage,
});

function MarketPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Skills");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: "/login" });
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  const filtered = allSkills.filter(s => {
    const matchesSearch = s.title.toLowerCase().includes(search.toLowerCase()) || s.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    const matchesCat = activeCategory === "All Skills" || s.category === activeCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="min-h-screen bg-background pb-20">
      <AppHeader />
      <main className="mx-auto max-w-lg px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">What will you<br /><span className="text-primary">learn</span> today?</h1>
          <p className="mt-1 text-sm text-muted-foreground">Connect with local experts in your neighborhood. Exchange your craft for theirs.</p>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search skills, topics..."
            className="w-full rounded-xl border border-input bg-card py-2.5 pl-10 pr-4 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Categories */}
        <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-accent"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Skills */}
        <div className="space-y-4">
          {filtered.map(skill => (
            <div key={skill.id} className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
              <img src={skill.image} alt={skill.title} className="h-40 w-full object-cover" />
              <div className="p-4">
                <div className="mb-2 flex items-start justify-between">
                  <h3 className="text-base font-bold text-card-foreground">{skill.title}</h3>
                  <div className="flex items-center gap-0.5">
                    <Star className="h-3.5 w-3.5 fill-warning text-warning" />
                    <span className="text-sm font-semibold text-foreground">{skill.rating}</span>
                  </div>
                </div>
                <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
                  <img src={skill.instructor.avatar} alt={skill.instructor.name} className="h-5 w-5 rounded-full" />
                  <span>{skill.instructor.name}</span>
                  <span>•</span>
                  <span>{skill.duration}</span>
                </div>
                <p className="mb-3 text-xs leading-relaxed text-muted-foreground">{skill.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-stat-green">
                    <MapPin className="h-3 w-3" />
                    {skill.distance}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {skill.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90">
                  Exchange <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="py-12 text-center text-muted-foreground">
              <p className="text-sm">No skills found matching your search.</p>
            </div>
          )}
        </div>

        {/* Don't see your skill CTA */}
        <div className="mt-6 rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 p-6 text-center">
          <p className="text-sm font-medium text-foreground">Don't see your skill?</p>
          <p className="mt-1 text-xs text-muted-foreground">Start by registering something to offer and find matches nearby.</p>
          <button className="cta-gradient mt-3 rounded-full px-6 py-2 text-xs font-semibold text-primary-foreground">
            Post a Skill
          </button>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
