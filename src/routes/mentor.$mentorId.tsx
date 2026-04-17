// ─── DSA USED IN THIS FILE ─────────────────────────────────────
// • LRU Cache (src/lib/dsa/lru.ts) — caches the last 5 viewed
//   mentor profiles so back-navigation is instant (O(1) get/put).
// ───────────────────────────────────────────────────────────────

import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { mentors, type Mentor } from "@/lib/mock-data";
import { LRUCache } from "@/lib/dsa";
import { useAuth } from "@/lib/auth-context";
import { PageShell } from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Star, MapPin, BadgeCheck, Clock, IndianRupee,
  MessageCircle, ArrowRightLeft, Briefcase, GraduationCap,
  CalendarCheck, ArrowLeft,
} from "lucide-react";

// Module-level LRU cache shared across navigations
const mentorCache = new LRUCache<string, Mentor>(5);

export const Route = createFileRoute("/mentor/$mentorId")({
  head: ({ params }) => {
    const m = mentors[params.mentorId];
    const title = m ? `${m.name} — Mentor on The Exchange` : "Mentor — The Exchange";
    const desc = m ? `${m.title}. ${m.bio.slice(0, 140)}` : "Engineering mentor profile on The Exchange.";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
      ],
    };
  },
  loader: ({ params }) => {
    // Try cache first (DSA: LRU cache O(1) get)
    const cached = mentorCache.get(params.mentorId);
    if (cached) return { mentor: cached };
    const mentor = mentors[params.mentorId];
    if (!mentor) throw notFound();
    mentorCache.put(params.mentorId, mentor); // O(1) put
    return { mentor };
  },
  component: MentorProfilePage,
  errorComponent: ({ error, reset }) => (
    <PageShell>
      <Card className="border-border">
        <CardContent className="p-8 text-center">
          <p className="text-sm text-muted-foreground">Couldn't load this profile: {error.message}</p>
          <Button onClick={reset} className="mt-4">Retry</Button>
        </CardContent>
      </Card>
    </PageShell>
  ),
  notFoundComponent: () => (
    <PageShell>
      <Card className="border-border">
        <CardContent className="space-y-3 p-8 text-center">
          <p className="text-base font-semibold text-foreground">Mentor not found</p>
          <p className="text-sm text-muted-foreground">This profile doesn't exist or has been removed.</p>
          <Button asChild><Link to="/market">Back to Market</Link></Button>
        </CardContent>
      </Card>
    </PageShell>
  ),
});

function MentorProfilePage() {
  const { mentor } = Route.useLoaderData();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) navigate({ to: "/login" });
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  return (
    <PageShell>
      <Link to="/market" className="mb-4 inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-primary">
        <ArrowLeft className="h-3 w-3" /> Back to Market
      </Link>

      {/* HERO */}
      <Card className="overflow-hidden border-border">
        <div className="h-24 bg-gradient-to-r from-navy via-primary to-navy" />
        <CardContent className="-mt-12 space-y-4 p-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="flex items-end gap-4">
              <img
                src={mentor.avatar}
                alt={mentor.name}
                className="h-24 w-24 rounded-full border-4 border-card object-cover shadow-md"
              />
              <div className="pb-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-semibold tracking-tight text-foreground">{mentor.name}</h1>
                  {mentor.isVerified && <BadgeCheck className="h-5 w-5 fill-primary text-primary-foreground" />}
                  {mentor.isOnline && (
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 border border-emerald-200">
                      Online now
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-sm font-medium text-primary">{mentor.title}</p>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {mentor.location}</span>
                  <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-amber-400 text-amber-400" /> {mentor.rating} ({mentor.reviewCount} reviews)</span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Replies {mentor.responseTime}</span>
                  <span className="flex items-center gap-1"><Briefcase className="h-3 w-3" /> {mentor.yearsExperience} yrs exp</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button asChild variant="outline">
                <Link to="/chat"><MessageCircle className="h-4 w-4" /> Message</Link>
              </Button>
              <Button>
                <ArrowRightLeft className="h-4 w-4" /> Request Exchange
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 rounded-lg border border-border bg-muted/30 p-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Hourly rate</p>
              <p className="mt-0.5 flex items-center text-lg font-semibold text-foreground">
                {mentor.hourlyPrice === 0 ? (
                  <span className="text-emerald-600">Free skill swap</span>
                ) : (
                  <><IndianRupee className="h-4 w-4" />{mentor.hourlyPrice}<span className="ml-1 text-xs font-normal text-muted-foreground">/hr</span></>
                )}
              </p>
            </div>
            <div className="h-10 w-px bg-border" />
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Skills offered</p>
              <p className="mt-0.5 text-lg font-semibold text-foreground">{mentor.teaches.length}</p>
            </div>
            <div className="h-10 w-px bg-border" />
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Wants to learn</p>
              <p className="mt-0.5 text-lg font-semibold text-foreground">{mentor.wantsToLearn.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* BODY GRID */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* About */}
          <Card className="border-border">
            <CardContent className="p-6">
              <p className="eyebrow">About</p>
              <h2 className="mt-1 text-lg font-semibold text-foreground">Who is {mentor.name.split(" ")[0]}?</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{mentor.bio}</p>
            </CardContent>
          </Card>

          {/* Teaches */}
          <Card className="border-border">
            <CardContent className="p-6">
              <p className="eyebrow">What they teach</p>
              <h2 className="mt-1 text-lg font-semibold text-foreground">Skills offered</h2>
              <ul className="mt-4 divide-y divide-border">
                {mentor.teaches.map((s, i) => (
                  <li key={i} className="flex items-center justify-between gap-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-foreground">{s.title}</p>
                      <p className="text-[11px] text-muted-foreground">{s.level}</p>
                    </div>
                    <Badge variant="outline" className="font-semibold">
                      {s.price === 0 ? "Free swap" : `₹${s.price}/hr`}
                    </Badge>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Experience */}
          <Card className="border-border">
            <CardContent className="p-6">
              <p className="eyebrow">Background</p>
              <h2 className="mt-1 text-lg font-semibold text-foreground">Experience</h2>
              <ol className="mt-4 space-y-4 border-l border-border pl-5">
                {mentor.experience.map((e, i) => (
                  <li key={i} className="relative">
                    <span className="absolute -left-[26px] top-1.5 flex h-3 w-3 items-center justify-center rounded-full bg-primary" />
                    <p className="text-sm font-semibold text-foreground">{e.role}</p>
                    <p className="text-xs text-muted-foreground">{e.company} · {e.period}</p>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          {/* Reviews */}
          <Card className="border-border">
            <CardContent className="p-6">
              <p className="eyebrow">Social proof</p>
              <h2 className="mt-1 text-lg font-semibold text-foreground">Reviews ({mentor.reviewCount})</h2>
              <ul className="mt-4 space-y-4">
                {mentor.reviews.map(r => (
                  <li key={r.id} className="flex gap-3 rounded-lg border border-border bg-muted/30 p-4">
                    <img src={r.avatar} alt={r.author} className="h-9 w-9 rounded-full object-cover" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold text-foreground">{r.author}</p>
                        <span className="text-[10px] text-muted-foreground">{r.date}</span>
                      </div>
                      <div className="mt-0.5 flex items-center gap-0.5">
                        {Array.from({ length: r.rating }).map((_, i) => (
                          <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{r.text}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Side column */}
        <aside className="space-y-6">
          <Card className="border-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-primary" />
                <p className="text-sm font-semibold text-foreground">Wants to learn</p>
              </div>
              <ul className="mt-3 space-y-2">
                {mentor.wantsToLearn.map((w, i) => (
                  <li key={i}>
                    <Badge variant="secondary" className="rounded-md">{w}</Badge>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <CalendarCheck className="h-4 w-4 text-primary" />
                <p className="text-sm font-semibold text-foreground">Availability</p>
              </div>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                {mentor.availability.map((slot, i) => (
                  <li key={i} className="rounded-md border border-border bg-muted/30 px-3 py-2 text-xs">{slot}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </aside>
      </div>
    </PageShell>
  );
}
