import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useExchanges } from "@/lib/exchanges-context";
import { ArrowUpRight, Clock, Star, MessageSquare, ChevronRight } from "lucide-react";
import { PageShell } from "@/components/AppLayout";
import { StatCard } from "@/components/StatCard";
import { SkillCard } from "@/components/SkillCard";
import { PostSkillDialog } from "@/components/PostSkillDialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — The Exchange" },
      { name: "description", content: "Your engineering skill exchange dashboard" },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { user, isAuthenticated } = useAuth();
  const { exchanges, skills } = useExchanges();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || !user) navigate({ to: "/login" });
  }, [isAuthenticated, user, navigate]);

  if (!isAuthenticated || !user) return null;

  const activeOnes = exchanges.filter(e => e.status !== "Completed");
  const recommended = skills.slice(0, 3);

  return (
    <PageShell>
      {/* Page header */}
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Dashboard</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            Welcome back, {user.name.split(" ")[0]}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            You have {activeOnes.length} active exchange{activeOnes.length === 1 ? "" : "s"} and 3 new skill matches in your network.
          </p>
        </div>
        <PostSkillDialog />
      </div>

      {/* KPI cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard icon={ArrowUpRight} label="Skills Exchanged" value={user.skillsExchanged} sublabel="Lifetime total" tone="primary" />
        <StatCard icon={Clock} label="Hours Earned" value={user.hoursEarned} sublabel="Available balance" tone="success" />
        <StatCard icon={Star} label="Community Rating" value={user.communityRating.toFixed(2)} sublabel={`${user.reviewCount} reviews`} tone="warning" />
      </div>

      {/* 2-col layout for active exchanges + sidebar */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Active exchanges */}
        <section className="lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="eyebrow">Live Engagement</p>
              <h2 className="text-lg font-semibold text-foreground">Active Exchanges</h2>
            </div>
            <Link to="/market" className="text-xs font-medium text-primary hover:underline">View all</Link>
          </div>

          <Card className="border-border shadow-none">
            <ul className="divide-y divide-border">
              {activeOnes.length === 0 && (
                <li className="p-6 text-center text-sm text-muted-foreground">
                  No active exchanges. Browse the market to request one.
                </li>
              )}
              {activeOnes.map(ex => (
                <li key={ex.id} className="flex items-center gap-4 p-4">
                  <img src={ex.partnerAvatar} alt={ex.partner} className="h-11 w-11 rounded-full object-cover" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-medium text-foreground">{ex.skill}</p>
                      <Badge
                        variant="secondary"
                        className={
                          ex.status === "In Progress"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                        }
                      >
                        {ex.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">with {ex.partner}</p>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                      <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${ex.progress}%` }} />
                    </div>
                  </div>
                  <Link to="/chat" aria-label="Message">
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
        </section>

        {/* Side card — share / mentor CTA */}
        <aside>
          <p className="eyebrow mb-2">Mentorship</p>
          <Card className="border-border bg-navy text-navy-foreground shadow-none">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold">Ready to mentor?</h3>
              <p className="mt-1 text-sm text-white/70">
                Post a new skill and engineers nearby will request an exchange. Average match time: under 36 hours.
              </p>
              <PostSkillDialog
                trigger={
                  <Button className="mt-4 bg-white text-navy hover:bg-white/90">
                    Post a skill <ChevronRight className="h-4 w-4" />
                  </Button>
                }
              />
            </CardContent>
          </Card>
        </aside>
      </div>

      {/* Recommended */}
      <section className="mt-10">
        <div className="mb-3">
          <p className="eyebrow">Local Discovery</p>
          <h2 className="text-lg font-semibold text-foreground">Recommended for you</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {recommended.map(skill => (
            <SkillCard key={skill.id} skill={skill} />
          ))}
        </div>
      </section>
    </PageShell>
  );
}
