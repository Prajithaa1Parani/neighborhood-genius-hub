import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { activeExchanges, allSkills } from "@/lib/mock-data";
import { ArrowUpRight, Clock, Star, Plus, ChevronRight } from "lucide-react";
import { AppHeader, BottomNav } from "@/components/AppLayout";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — The Exchange" },
      { name: "description", content: "Your skill exchange dashboard" },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate({ to: "/login" });
    }
  }, [isAuthenticated, user, navigate]);

  if (!isAuthenticated || !user) return null;

  const recommendedSkills = allSkills.slice(0, 3);

  return (
    <div className="min-h-screen bg-background pb-20">
      <AppHeader />
      <main className="mx-auto max-w-lg px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Welcome back,<br />{user.name.split(" ")[0]}.</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Your community contribution is growing. You've helped 4 neighbors this week through skill sharing.
          </p>
        </div>

        {/* Stats */}
        <div className="mb-6 space-y-3">
          <div className="stat-card-blue flex items-center justify-between rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-stat-blue/20">
                <ArrowUpRight className="h-5 w-5 text-stat-blue" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{user.skillsExchanged}</p>
                <p className="text-xs text-muted-foreground">Skills Exchanged</p>
              </div>
            </div>
            <span className="text-[10px] font-semibold tracking-wider text-muted-foreground">LIFETIME</span>
          </div>
          <div className="stat-card-green flex items-center justify-between rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-stat-green/20">
                <Clock className="h-5 w-5 text-stat-green" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{user.hoursEarned}</p>
                <p className="text-xs text-muted-foreground">Hours Earned</p>
              </div>
            </div>
            <span className="text-[10px] font-semibold tracking-wider text-muted-foreground">BALANCE</span>
          </div>
          <div className="stat-card-orange flex items-center justify-between rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-stat-orange/20">
                <Star className="h-5 w-5 text-stat-orange" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{user.communityRating}</p>
                <p className="text-xs text-muted-foreground">Community Rating</p>
              </div>
            </div>
            <span className="text-[10px] font-semibold tracking-wider text-muted-foreground">STATUS</span>
          </div>
        </div>

        {/* CTA */}
        <div className="cta-gradient mb-8 rounded-2xl p-5 text-center">
          <p className="mb-3 text-sm font-semibold text-primary-foreground">Ready to share a new skill?</p>
          <button className="inline-flex items-center gap-2 rounded-full bg-card px-6 py-2.5 text-sm font-semibold text-foreground shadow-md transition-transform hover:scale-105">
            Post Skill <Plus className="h-4 w-4" />
          </button>
        </div>

        {/* Active Exchanges */}
        <section className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-semibold tracking-widest text-primary">LIVE ENGAGEMENT</p>
              <h2 className="text-lg font-bold text-foreground">Active Exchanges</h2>
            </div>
            <button className="text-sm font-medium text-primary">View All</button>
          </div>
          <div className="space-y-3">
            {activeExchanges.filter(e => e.status !== "Completed").map(ex => (
              <div key={ex.id} className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-start gap-3">
                  <img src={ex.partnerAvatar} alt={ex.partner} className="h-12 w-12 rounded-full" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-card-foreground">{ex.skill}</h3>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${ex.status === "In Progress" ? "badge-progress" : "badge-scheduled"}`}>
                        {ex.status}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">Sharing with {ex.partner}</p>
                    {ex.progress > 0 && (
                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${ex.progress}%` }} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recommended Skills */}
        <section>
          <div className="mb-4">
            <p className="text-[10px] font-semibold tracking-widest text-primary">LOCAL DISCOVERY</p>
            <h2 className="text-lg font-bold text-foreground">Recommended Skills Nearby</h2>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {recommendedSkills.map(skill => (
              <div key={skill.id} className="min-w-[160px] overflow-hidden rounded-xl border border-border bg-card">
                <img src={skill.image} alt={skill.title} className="h-24 w-full object-cover" />
                <div className="p-3">
                  <h3 className="text-sm font-semibold text-card-foreground leading-tight">{skill.title}</h3>
                  <div className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground">
                    <span className="text-stat-green">● {skill.distance}</span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {skill.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="rounded-full bg-muted px-2 py-0.5 text-[9px] font-medium text-muted-foreground">
                        {tag.toUpperCase()}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* FAB */}
      <Link to="/market" className="fixed bottom-20 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary shadow-lg shadow-primary/30 text-primary-foreground transition-transform hover:scale-110">
        <Plus className="h-6 w-6" />
      </Link>

      <BottomNav />
    </div>
  );
}
