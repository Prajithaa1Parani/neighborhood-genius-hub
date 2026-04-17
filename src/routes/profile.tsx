import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { reviews } from "@/lib/mock-data";
import { PageShell } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Calendar, Shield, LogOut, MessageSquare, Share2 } from "lucide-react";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile — The Exchange" },
      { name: "description", content: "Your engineering skill exchange profile" },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || !user) navigate({ to: "/login" });
  }, [isAuthenticated, user, navigate]);

  if (!isAuthenticated || !user) return null;

  const handleLogout = () => {
    logout();
    navigate({ to: "/login" });
  };

  return (
    <PageShell>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left — sticky profile card */}
        <aside className="lg:col-span-1">
          <Card className="sticky top-20 border-border shadow-none">
            <CardContent className="p-6 text-center">
              <div className="relative mx-auto mb-4 h-24 w-24">
                <img src={user.avatar} alt={user.name} className="h-24 w-24 rounded-full border-4 border-card object-cover shadow-sm" />
                {user.isVerified && (
                  <div className="absolute -right-1 bottom-0 flex h-7 w-7 items-center justify-center rounded-full border-2 border-card bg-primary text-primary-foreground">
                    <Shield className="h-3.5 w-3.5" />
                  </div>
                )}
              </div>
              <h1 className="text-lg font-semibold text-foreground">{user.name}</h1>
              <p className="mt-0.5 text-sm text-muted-foreground">{user.title}</p>

              <div className="mt-3 flex items-center justify-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {user.location}</span>
                <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {user.joinedDate}</span>
              </div>

              <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 border border-amber-200">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                <span className="text-xs font-semibold text-amber-700">{user.rating}</span>
                <span className="text-xs text-amber-700/70">· {user.reviewCount} reviews</span>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-2 border-t border-border pt-4 text-center">
                <div>
                  <p className="text-lg font-semibold text-foreground">{user.skillsExchanged}</p>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Swaps</p>
                </div>
                <div>
                  <p className="text-lg font-semibold text-foreground">{user.hoursEarned}</p>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Hours</p>
                </div>
                <div>
                  <p className="text-lg font-semibold text-foreground">98%</p>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Complete</p>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-2">
                <Button className="w-full"><MessageSquare className="h-4 w-4" /> Message</Button>
                <Button variant="outline" className="w-full"><Share2 className="h-4 w-4" /> Share</Button>
              </div>

              <Button onClick={handleLogout} variant="ghost" className="mt-4 w-full text-destructive hover:bg-destructive/5 hover:text-destructive">
                <LogOut className="h-4 w-4" /> Sign out
              </Button>
            </CardContent>
          </Card>
        </aside>

        {/* Right column */}
        <div className="space-y-6 lg:col-span-2">
          <Card className="border-border shadow-none">
            <CardHeader>
              <p className="eyebrow">About</p>
              <CardTitle className="text-lg">Background</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-muted-foreground">{user.bio}</p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card className="border-border shadow-none">
              <CardHeader>
                <p className="eyebrow">Skills offered</p>
                <CardTitle className="text-base">What I teach</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {user.skillsOffered.map(s => (
                  <div key={s.id} className="rounded-md border border-border bg-card p-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-foreground">{s.title}</p>
                      <Badge variant="secondary" className="text-[10px]">{s.level}</Badge>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{s.category} · {s.duration}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-border shadow-none">
              <CardHeader>
                <p className="eyebrow">Skills wanted</p>
                <CardTitle className="text-base">What I want to learn</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {user.skillsNeeded.map(skill => (
                    <Badge key={skill} variant="outline" className="rounded-full px-3 py-1 text-xs font-medium">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-border shadow-none">
            <CardHeader>
              <p className="eyebrow">Reviews</p>
              <CardTitle className="text-lg">Recent feedback</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {reviews.map(r => (
                <div key={r.id} className="flex gap-3 border-b border-border pb-4 last:border-b-0 last:pb-0">
                  <img src={r.avatar} alt={r.author} className="h-9 w-9 rounded-full object-cover" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-foreground">{r.author}</p>
                      <span className="text-[11px] text-muted-foreground">{r.date}</span>
                    </div>
                    <div className="mt-0.5 flex items-center gap-0.5">
                      {[...Array(r.rating)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{r.text}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageShell>
  );
}
