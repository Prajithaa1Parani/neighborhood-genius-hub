// ─── DSA USED IN THIS FILE ─────────────────────────────────────
// • Quicksort (src/lib/dsa/quickSort.ts) — sorts your posts by
//   newest, most viewed, or most requested in O(n log n) avg.
// ───────────────────────────────────────────────────────────────

import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useExchanges } from "@/lib/exchanges-context";
import { quickSort } from "@/lib/dsa";
import { PageShell } from "@/components/AppLayout";
import { PostSkillDialog } from "@/components/PostSkillDialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, Users, Trash2, FileText, Plus } from "lucide-react";
import { toast } from "sonner";
import type { Skill } from "@/lib/mock-data";

type SortKey = "newest" | "views" | "requests";

export const Route = createFileRoute("/my-posts")({
  head: () => ({
    meta: [
      { title: "My Posts — The Exchange" },
      { name: "description", content: "Manage skills you've posted to the marketplace." },
    ],
  }),
  component: MyPostsPage,
});

function MyPostsPage() {
  const { isAuthenticated, user } = useAuth();
  const { skills, deleteSkill } = useExchanges();
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState<SortKey>("newest");

  useEffect(() => {
    if (!isAuthenticated) navigate({ to: "/login" });
  }, [isAuthenticated, navigate]);

  const myPosts = useMemo(() => {
    const mine = skills.filter(s => s.postedBy === user?.id);
    const cmp = (() => {
      switch (sortBy) {
        case "views": return (a: Skill, b: Skill) => (b.views ?? 0) - (a.views ?? 0);
        case "requests": return (a: Skill, b: Skill) => (b.requestCount ?? 0) - (a.requestCount ?? 0);
        default: return (a: Skill, b: Skill) => (b.postedAt ?? "").localeCompare(a.postedAt ?? "");
      }
    })();
    return quickSort(mine, cmp); // DSA: quicksort
  }, [skills, user?.id, sortBy]);

  const totalViews = myPosts.reduce((s, p) => s + (p.views ?? 0), 0);
  const totalReq = myPosts.reduce((s, p) => s + (p.requestCount ?? 0), 0);

  if (!isAuthenticated) return null;

  const handleDelete = (s: Skill) => {
    deleteSkill(s.id);
    toast.success(`"${s.title}" removed from the marketplace`);
  };

  return (
    <PageShell>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Your listings</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">My Posts</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Skills you've offered to the community. These won't appear in your own Market view.
          </p>
        </div>
        <PostSkillDialog />
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Active posts</p><p className="mt-1 text-2xl font-semibold text-foreground">{myPosts.length}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Total views</p><p className="mt-1 text-2xl font-semibold text-foreground">{totalViews}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Requests received</p><p className="mt-1 text-2xl font-semibold text-foreground">{totalReq}</p></CardContent></Card>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{myPosts.length} post{myPosts.length === 1 ? "" : "s"}</p>
        <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortKey)}>
          <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest first</SelectItem>
            <SelectItem value="views">Most viewed</SelectItem>
            <SelectItem value="requests">Most requested</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {myPosts.length === 0 ? (
        <Card className="border-dashed bg-card text-center">
          <CardContent className="p-12">
            <FileText className="mx-auto h-10 w-10 text-muted-foreground/50" />
            <p className="mt-3 text-sm font-medium text-foreground">No posts yet</p>
            <p className="mt-1 text-xs text-muted-foreground">Share a skill and engineers nearby can request it.</p>
            <PostSkillDialog
              trigger={
                <Button className="mt-4"><Plus className="h-4 w-4" /> Post your first skill</Button>
              }
            />
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {myPosts.map(p => (
            <Card key={p.id} className="overflow-hidden">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant={p.status === "Paused" ? "secondary" : "default"}>{p.status ?? "Active"}</Badge>
                      <Badge variant="outline" className="text-[10px]">{p.category}</Badge>
                      <Badge variant="outline" className="text-[10px]">{p.level}</Badge>
                    </div>
                    <h3 className="mt-2 text-base font-semibold text-foreground">{p.title}</h3>
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{p.description}</p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1"><Eye className="h-3.5 w-3.5" /> {p.views ?? 0} views</span>
                  <span className="inline-flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {p.requestCount ?? 0} requests</span>
                  <span className="ml-auto font-medium text-foreground">{p.pricePerHour === 0 ? "Free swap" : `₹${p.pricePerHour}/hr`}</span>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-[11px] text-muted-foreground">
                  <span>Posted {p.postedAt ?? "recently"}</span>
                  <div className="flex gap-2">
                    <Button asChild variant="outline" size="sm" className="text-xs">
                      <Link to="/market">View in market</Link>
                    </Button>
                    <Button onClick={() => handleDelete(p)} variant="ghost" size="sm" className="text-xs text-destructive hover:text-destructive">
                      <Trash2 className="h-3.5 w-3.5" /> Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </PageShell>
  );
}
