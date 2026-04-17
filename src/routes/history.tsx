// ─── DSA USED IN THIS FILE ─────────────────────────────────────
// • Quicksort (src/lib/dsa/quickSort.ts) — orders sessions by date.
// • Priority Queue / Min-Heap (src/lib/dsa/priorityQueue.ts) —
//   surfaces "needs review" sessions first (lower score = higher
//   priority). Sessions awaiting your review get the smallest score.
// ───────────────────────────────────────────────────────────────

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useExchanges } from "@/lib/exchanges-context";
import { quickSort, PriorityQueue } from "@/lib/dsa";
import { PageShell } from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, Calendar } from "lucide-react";
import { toast } from "sonner";
import type { CompletedSession } from "@/lib/mock-data";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "Session History — The Exchange" },
      { name: "description", content: "All your past skill exchange sessions." },
    ],
  }),
  component: HistoryPage,
});

function monthKey(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("en-US", { month: "long", year: "numeric" });
}

function HistoryPage() {
  const { isAuthenticated } = useAuth();
  const { history, leaveReview } = useExchanges();
  const navigate = useNavigate();
  const [tab, setTab] = useState<"all" | "needsReview">("all");

  useEffect(() => {
    if (!isAuthenticated) navigate({ to: "/login" });
  }, [isAuthenticated, navigate]);

  // DSA: priority queue — smallest score surfaces first.
  // needs-review (ratingGiven == null) gets score 0; others sorted by recency.
  const prioritized = useMemo(() => {
    const pq = new PriorityQueue<CompletedSession>();
    for (const h of history) {
      const reviewPenalty = h.ratingGiven === null ? 0 : 1000;
      const recency = -new Date(h.date).getTime() / 1e7; // newer = smaller
      pq.push(h, reviewPenalty + recency);
    }
    return pq.drain();
  }, [history]);

  // DSA: quicksort by date desc for the "all" tab grouping
  const sortedByDate = useMemo(
    () => quickSort(history, (a, b) => b.date.localeCompare(a.date)),
    [history]
  );

  if (!isAuthenticated) return null;

  const totalSessions = history.length;
  const totalHours = (history.reduce((s, h) => s + h.durationMin, 0) / 60).toFixed(1);
  const avgRating = (history.reduce((s, h) => s + h.ratingReceived, 0) / Math.max(1, history.length)).toFixed(2);
  const needsReview = history.filter(h => h.ratingGiven === null).length;

  const list = tab === "needsReview" ? prioritized.filter(h => h.ratingGiven === null) : sortedByDate;
  const grouped = list.reduce<Record<string, CompletedSession[]>>((acc, h) => {
    const k = monthKey(h.date);
    (acc[k] ||= []).push(h);
    return acc;
  }, {});

  const handleReview = (id: string) => {
    leaveReview(id, 5);
    toast.success("Thanks — review submitted!");
  };

  return (
    <PageShell>
      <div className="mb-6">
        <p className="eyebrow">Activity log</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">Session History</h1>
        <p className="mt-1 text-sm text-muted-foreground">Every past exchange, grouped by month.</p>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Total sessions</p><p className="mt-1 text-2xl font-semibold text-foreground">{totalSessions}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Total hours</p><p className="mt-1 text-2xl font-semibold text-foreground">{totalHours}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Avg rating received</p><p className="mt-1 text-2xl font-semibold text-foreground">{avgRating}★</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Awaiting your review</p><p className="mt-1 text-2xl font-semibold text-foreground">{needsReview}</p></CardContent></Card>
      </div>

      {/* Tabs */}
      <div className="mb-5 inline-flex rounded-md border border-border bg-card p-1">
        <button
          onClick={() => setTab("all")}
          className={`rounded px-3 py-1.5 text-xs font-medium transition-colors ${tab === "all" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
        >All sessions</button>
        <button
          onClick={() => setTab("needsReview")}
          className={`rounded px-3 py-1.5 text-xs font-medium transition-colors ${tab === "needsReview" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
        >Needs review {needsReview > 0 && `(${needsReview})`}</button>
      </div>

      {Object.keys(grouped).length === 0 ? (
        <Card className="border-dashed bg-card text-center">
          <CardContent className="p-12 text-sm text-muted-foreground">
            {tab === "needsReview" ? "All sessions reviewed — nice!" : "No sessions yet."}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([month, items]) => (
            <section key={month}>
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{month}</h2>
              <div className="space-y-3">
                {items.map(h => (
                  <Card key={h.id}>
                    <CardContent className="flex flex-wrap items-start gap-4 p-5">
                      <Link to="/mentor/$mentorId" params={{ mentorId: h.partnerId }} className="shrink-0">
                        <img src={h.partnerAvatar} alt={h.partner} className="h-12 w-12 rounded-full object-cover ring-2 ring-border transition-all hover:ring-primary" />
                      </Link>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-sm font-semibold text-foreground">{h.skill}</h3>
                          {h.ratingGiven === null && <Badge variant="destructive" className="text-[10px]">Needs review</Badge>}
                        </div>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          with{" "}
                          <Link to="/mentor/$mentorId" params={{ mentorId: h.partnerId }} className="font-medium text-foreground hover:underline">{h.partner}</Link>
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
                          <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" /> {new Date(h.date).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}</span>
                          <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {h.durationMin} min</span>
                          <span className="inline-flex items-center gap-1">
                            You gave: {h.ratingGiven === null ? <span className="text-destructive">— pending</span> : <><Star className="h-3 w-3 fill-yellow-500 text-yellow-500" /> {h.ratingGiven}</>}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            They gave: <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" /> {h.ratingReceived}
                          </span>
                        </div>
                        <p className="mt-2 text-xs italic text-muted-foreground">"{h.notes}"</p>
                      </div>
                      {h.ratingGiven === null && (
                        <Button onClick={() => handleReview(h.id)} size="sm" variant="outline" className="text-xs">
                          <Star className="h-3.5 w-3.5" /> Leave 5★ review
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </PageShell>
  );
}
