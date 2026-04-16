import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { reviews } from "@/lib/mock-data";
import { AppHeader, BottomNav } from "@/components/AppLayout";
import { Star, MapPin, Calendar, Shield, LogOut, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile — The Exchange" },
      { name: "description", content: "Your skill exchange profile" },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate({ to: "/login" });
    }
  }, [isAuthenticated, user, navigate]);

  if (!isAuthenticated || !user) return null;

  const handleLogout = () => {
    logout();
    navigate({ to: "/login" });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <AppHeader />
      <main className="mx-auto max-w-lg px-4 py-6">
        {/* Profile Header */}
        <div className="mb-6 text-center">
          <div className="relative mx-auto mb-3 h-24 w-24">
            <img src={user.avatar} alt={user.name} className="h-24 w-24 rounded-full border-4 border-card shadow-lg" />
            {user.isVerified && (
              <div className="absolute -right-1 bottom-0 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Shield className="h-4 w-4" />
              </div>
            )}
          </div>
          <span className="inline-block rounded-full bg-stat-green/15 px-3 py-0.5 text-[10px] font-semibold text-stat-green mb-2">Pro Member</span>
          <h1 className="text-xl font-bold text-foreground">{user.name}</h1>
          <p className="text-sm text-muted-foreground">{user.title}</p>
          <div className="mt-2 flex items-center justify-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{user.location}</span>
            <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />Joined {user.joinedDate}</span>
          </div>
          <div className="mt-2 flex items-center justify-center gap-1">
            <Star className="h-4 w-4 fill-warning text-warning" />
            <span className="text-sm font-semibold text-foreground">{user.rating}</span>
            <span className="text-xs text-muted-foreground">({user.reviewCount} reviews)</span>
          </div>
          <div className="mt-4 flex justify-center gap-3">
            <button className="cta-gradient rounded-full px-6 py-2 text-sm font-semibold text-primary-foreground">Swap Skills</button>
            <button className="rounded-full border border-border bg-card px-6 py-2 text-sm font-semibold text-foreground">Share</button>
          </div>
        </div>

        {/* About */}
        <section className="mb-6">
          <h2 className="mb-2 text-xs font-semibold tracking-widest text-primary">ABOUT</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">{user.bio}</p>
        </section>

        {/* Reviews */}
        <section className="mb-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xs font-semibold tracking-widest text-primary">RECENT REVIEWS</h2>
            <button className="text-xs font-medium text-primary">View All</button>
          </div>
          <div className="space-y-3">
            {reviews.map(review => (
              <div key={review.id} className="rounded-xl border border-border bg-card p-4">
                <div className="mb-2 flex items-center gap-2">
                  <img src={review.avatar} alt={review.author} className="h-8 w-8 rounded-full" />
                  <div>
                    <p className="text-sm font-semibold text-card-foreground">{review.author}</p>
                    <div className="flex items-center gap-1">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-warning text-warning" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground">{review.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Skills Offered */}
        <section className="mb-6">
          <h2 className="mb-3 text-xs font-semibold tracking-widest text-primary">SKILLS OFFERED</h2>
          <div className="flex flex-wrap gap-2">
            {user.skillsOffered.map(skill => (
              <span key={skill.id} className="rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">
                {skill.title}
              </span>
            ))}
          </div>
        </section>

        {/* Skills Needed */}
        <section className="mb-6">
          <h2 className="mb-3 text-xs font-semibold tracking-widest text-primary">SKILLS NEEDED</h2>
          <div className="flex flex-wrap gap-2">
            {user.skillsNeeded.map(skill => (
              <span key={skill} className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground">
                {skill}
              </span>
            ))}
          </div>
        </section>

        {/* Stats */}
        <section className="mb-6">
          <h2 className="mb-3 text-xs font-semibold tracking-widest text-primary">SKILL COMPLETION</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-primary/5 p-4 text-center">
              <p className="text-2xl font-bold text-primary">{user.skillsExchanged}</p>
              <p className="text-[10px] text-muted-foreground">Skills Exchanged</p>
            </div>
            <div className="rounded-xl bg-stat-green/10 p-4 text-center">
              <p className="text-2xl font-bold text-stat-green">98%</p>
              <p className="text-[10px] text-muted-foreground">Completion Rate</p>
            </div>
          </div>
        </section>

        {/* Verified Badge */}
        {user.isVerified && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-stat-green/30 bg-stat-green/5 p-4">
            <Shield className="h-8 w-8 text-stat-green" />
            <div>
              <p className="text-sm font-semibold text-foreground">Exchange Verified</p>
              <p className="text-xs text-muted-foreground">Identity, accuracy, community standards confirmed</p>
            </div>
          </div>
        )}

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-destructive/30 bg-destructive/5 py-3 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </main>
      <BottomNav />
    </div>
  );
}
