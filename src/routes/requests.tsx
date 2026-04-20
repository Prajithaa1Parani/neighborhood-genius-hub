// ─── DSA USED IN THIS FILE ─────────────────────────────────────
// • Priority Queue (src/lib/dsa/priorityQueue.ts) — surfaces the
//   OLDEST pending incoming request first (FIFO fairness): score
//   = createdAt timestamp (older = lower score = higher priority).
// ───────────────────────────────────────────────────────────────

import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { PageShell } from "@/components/AppLayout";
import { useExchanges } from "@/lib/exchanges-context";
import { useAuth } from "@/lib/auth-context";
import { PriorityQueue } from "@/lib/dsa";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Inbox, Send, Check, X, Clock, CheckCircle2, XCircle } from "lucide-react";
import type { ExchangeRequest } from "@/lib/mock-data";

export const Route = createFileRoute("/requests")({
  component: RequestsPage,
});

function timeAgo(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const m = Math.floor(ms / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

function statusBadge(status: ExchangeRequest["status"]) {
  if (status === "Pending") return <Badge variant="secondary" className="gap-1"><Clock className="h-3 w-3" /> Pending</Badge>;
  if (status === "Accepted") return <Badge className="gap-1 bg-emerald-600 text-white hover:bg-emerald-700"><CheckCircle2 className="h-3 w-3" /> Accepted</Badge>;
  return <Badge variant="destructive" className="gap-1"><XCircle className="h-3 w-3" /> Declined</Badge>;
}

function RequestsPage() {
  const { user } = useAuth();
  const { incomingRequests, outgoingRequests, acceptRequest, declineRequest } = useExchanges();

  // ─── DSA: priority queue (min-heap) — oldest pending first ───
  const orderedIncoming = useMemo(() => {
    const pq = new PriorityQueue<ExchangeRequest>();
    for (const r of incomingRequests) {
      const statusWeight = r.status === "Pending" ? 0 : 1e15; // Pending always first
      const score = statusWeight + new Date(r.createdAt).getTime();
      pq.push(r, score);
    }
    return pq.drain();
  }, [incomingRequests]);

  const orderedOutgoing = useMemo(
    () => [...outgoingRequests].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [outgoingRequests]
  );

  const pendingIn = incomingRequests.filter(r => r.status === "Pending").length;

  if (!user) {
    return (
      <PageShell>
        <div className="text-center text-muted-foreground">Please sign in to view requests.</div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div className="space-y-6">
        <header>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Exchange Requests</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Accept or decline requests from other engineers, and track the ones you've sent.
          </p>
        </header>

        <Tabs defaultValue="incoming" className="space-y-4">
          <TabsList>
            <TabsTrigger value="incoming" className="gap-2">
              <Inbox className="h-4 w-4" /> Incoming
              {pendingIn > 0 && (
                <span className="ml-1 rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-bold text-primary-foreground">
                  {pendingIn}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="outgoing" className="gap-2">
              <Send className="h-4 w-4" /> Outgoing ({outgoingRequests.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="incoming" className="space-y-3">
            {orderedIncoming.length === 0 ? (
              <EmptyState icon={Inbox} title="No incoming requests" body="When someone requests to exchange a skill you've posted, it will appear here." />
            ) : (
              orderedIncoming.map(req => (
                <Card key={req.id}>
                  <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-3">
                      <img src={req.fromUserAvatar} alt={req.fromUserName} className="h-11 w-11 rounded-full object-cover" />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground">
                          {req.fromUserName} <span className="font-normal text-muted-foreground">requested</span>{" "}
                          <span className="text-foreground">{req.skillTitle}</span>
                        </p>
                        {req.message && (
                          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">"{req.message}"</p>
                        )}
                        <div className="mt-2 flex items-center gap-2 text-[11px] text-muted-foreground">
                          <span>{timeAgo(req.createdAt)}</span>
                          <span>·</span>
                          {statusBadge(req.status)}
                        </div>
                      </div>
                    </div>

                    {req.status === "Pending" ? (
                      <div className="flex gap-2 sm:shrink-0">
                        <Button onClick={() => declineRequest(req.id)} variant="outline" size="sm">
                          <X className="h-4 w-4" /> Decline
                        </Button>
                        <Button onClick={() => acceptRequest(req.id)} size="sm">
                          <Check className="h-4 w-4" /> Accept
                        </Button>
                      </div>
                    ) : (
                      <Link to="/chat" className="text-xs font-medium text-primary hover:underline">
                        Open chat →
                      </Link>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="outgoing" className="space-y-3">
            {orderedOutgoing.length === 0 ? (
              <EmptyState icon={Send} title="No outgoing requests" body="Browse the Market and request a skill exchange — your sent requests will show up here." />
            ) : (
              orderedOutgoing.map(req => (
                <Card key={req.id}>
                  <CardContent className="flex items-center justify-between gap-4 p-5">
                    <div className="flex items-center gap-3">
                      <img src={req.toUserAvatar} alt={req.toUserName} className="h-11 w-11 rounded-full object-cover" />
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          To {req.toUserName} <span className="font-normal text-muted-foreground">for</span>{" "}
                          <span className="text-foreground">{req.skillTitle}</span>
                        </p>
                        <p className="mt-1 text-[11px] text-muted-foreground">{timeAgo(req.createdAt)}</p>
                      </div>
                    </div>
                    {statusBadge(req.status)}
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </PageShell>
  );
}

function EmptyState({ icon: Icon, title, body }: { icon: typeof Inbox; title: string; body: string }) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-2 px-6 py-12 text-center">
        <Icon className="h-8 w-8 text-muted-foreground" />
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="max-w-sm text-xs text-muted-foreground">{body}</p>
      </CardContent>
    </Card>
  );
}
