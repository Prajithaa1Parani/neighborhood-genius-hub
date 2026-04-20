// ─── DSA USED IN THIS FILE ─────────────────────────────────────
// • PriorityQueue / Min-Heap (src/lib/dsa/priorityQueue.ts)
//   Used to order notifications by combined (priority + recency)
//   score so the most important unread notification surfaces first.
// ───────────────────────────────────────────────────────────────

import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { LayoutGrid, Store, MessageCircle, UserCircle, Bell, Code2, LogOut, CheckCheck, Trash2, FileText, History, Inbox } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useExchanges } from "@/lib/exchanges-context";
import { notifications as initialNotifications } from "@/lib/mock-data";
import { PriorityQueue } from "@/lib/dsa";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
  useSidebar,
} from "@/components/ui/sidebar";

const navItems = [
  { to: "/dashboard" as const, icon: LayoutGrid, label: "Dashboard" },
  { to: "/market" as const, icon: Store, label: "Market" },
  { to: "/my-posts" as const, icon: FileText, label: "My Posts" },
  { to: "/requests" as const, icon: Inbox, label: "Requests" },
  { to: "/history" as const, icon: History, label: "History" },
  { to: "/chat" as const, icon: MessageCircle, label: "Chat" },
  { to: "/profile" as const, icon: UserCircle, label: "Profile" },
];

interface NotificationItem {
  id: string;
  title: string;
  body: string;
  time: string;
  route: "/chat" | "/market" | "/dashboard" | "/profile";
  priority: number; // 1 = highest
  read: boolean;
  recencyScore: number; // lower = more recent
}

// Convert "5m" / "1h" / "1d" to a comparable number (smaller = newer)
function parseRecency(time: string): number {
  const num = parseInt(time, 10) || 0;
  if (time.endsWith("m")) return num;
  if (time.endsWith("h")) return num * 60;
  if (time.endsWith("d")) return num * 60 * 24;
  return 99999;
}

function NotificationBell() {
  const navigate = useNavigate();
  const [items, setItems] = useState<NotificationItem[]>(() =>
    initialNotifications.map(n => ({ ...n, read: false, recencyScore: parseRecency(n.time) }))
  );

  // ─── DSA: order via priority queue (min-heap) ───
  // Lower score = surfaces first. Score blends priority (1..3) and recency.
  const ordered = useMemo(() => {
    const pq = new PriorityQueue<NotificationItem>();
    for (const n of items) {
      const readPenalty = n.read ? 1000 : 0;
      const score = n.priority * 100 + n.recencyScore + readPenalty;
      pq.push(n, score);
    }
    return pq.drain();
  }, [items]);

  const unreadCount = items.filter(n => !n.read).length;

  const markRead = (id: string) =>
    setItems(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

  const markAllRead = () =>
    setItems(prev => prev.map(n => ({ ...n, read: true })));

  const clearAll = () => setItems([]);

  const handleClick = (n: NotificationItem) => {
    markRead(n.id);
    navigate({ to: n.route });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="relative rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground" aria-label="Notifications">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
              {unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <p className="text-sm font-semibold text-foreground">Notifications</p>
          {items.length > 0 && (
            <button
              onClick={markAllRead}
              className="flex items-center gap-1 text-[11px] font-medium text-primary hover:underline"
              disabled={unreadCount === 0}
            >
              <CheckCheck className="h-3 w-3" /> Mark all read
            </button>
          )}
        </div>
        {ordered.length === 0 ? (
          <div className="px-4 py-8 text-center text-xs text-muted-foreground">
            You're all caught up.
          </div>
        ) : (
          <ul className="max-h-80 divide-y divide-border overflow-y-auto">
            {ordered.map(n => (
              <li key={n.id}>
                <button
                  onClick={() => handleClick(n)}
                  className={`block w-full px-4 py-3 text-left transition-colors hover:bg-muted/50 ${!n.read ? "bg-primary/5" : ""}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium text-foreground">
                      {!n.read && <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-primary align-middle" />}
                      {n.title}
                    </p>
                    <span className="shrink-0 text-[10px] text-muted-foreground">{n.time}</span>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">{n.body}</p>
                </button>
              </li>
            ))}
          </ul>
        )}
        {items.length > 0 && (
          <div className="border-t border-border p-2">
            <Button onClick={clearAll} variant="ghost" size="sm" className="w-full text-xs text-muted-foreground">
              <Trash2 className="h-3 w-3" /> Clear all
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

function AppSidebar() {
  const location = useLocation();
  const pathname = location.pathname;
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  const handleLogout = () => {
    logout();
    navigate({ to: "/" });
  };

  const firstName = user?.name?.split(" ")[0] ?? "";

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarHeader className="border-b border-border">
        <Link to="/" className="flex items-center gap-2 px-2 py-2" title="Back to home">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-navy text-navy-foreground">
            <Code2 className="h-4 w-4" />
          </div>
          {!collapsed && (
            <div className="leading-tight">
              <p className="text-sm font-semibold tracking-tight text-foreground">The Exchange</p>
              <p className="text-[10px] font-medium text-muted-foreground">Engineering Skill Network</p>
            </div>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map(({ to, icon: Icon, label }) => {
                const isActive = pathname === to;
                return (
                  <SidebarMenuItem key={to}>
                    <SidebarMenuButton asChild isActive={isActive} tooltip={label}>
                      <Link to={to}>
                        <Icon className="h-4 w-4" />
                        <span>{label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border">
        {user && !collapsed && (
          <div className="flex items-center gap-3 rounded-md px-2 py-2">
            <img src={user.avatar} alt={firstName} className="h-9 w-9 rounded-full object-cover" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-foreground">{firstName}</p>
              <p className="truncate text-[10px] text-muted-foreground">Online</p>
            </div>
          </div>
        )}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout} tooltip="Sign out">
              <LogOut className="h-4 w-4" />
              <span>Sign out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

function TopBar() {
  const { user } = useAuth();
  const location = useLocation();
  const pageTitle =
    location.pathname.startsWith("/dashboard") ? "Dashboard" :
    location.pathname.startsWith("/market") ? "Skill Market" :
    location.pathname.startsWith("/chat") ? "Conversations" :
    location.pathname.startsWith("/mentor") ? "Mentor Profile" :
    location.pathname.startsWith("/profile") ? "Profile" : "";

  const firstName = user?.name?.split(" ")[0] ?? "";

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-border bg-card px-4 md:px-6">
      <SidebarTrigger className="-ml-1" />
      <div className="h-5 w-px bg-border" />
      <p className="text-sm font-semibold text-foreground">{pageTitle}</p>
      <div className="ml-auto flex items-center gap-2">
        <NotificationBell />
        {user && (
          <Link to="/profile" className="flex items-center gap-2 rounded-full border border-border bg-card pl-1 pr-3 py-1 transition-colors hover:bg-muted">
            <img src={user.avatar} alt={firstName} className="h-7 w-7 rounded-full object-cover" />
            <span className="hidden text-xs font-medium text-foreground sm:inline">{firstName}</span>
          </Link>
        )}
      </div>
    </header>
  );
}

/**
 * PageShell — provides the collapsible sidebar shell.
 * Sidebar defaults to *collapsed* (icon-only). Hovering the sidebar
 * region expands it; leaving collapses it again. On mobile, normal
 * sheet behaviour is preserved.
 */
export function PageShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false); // controlled: collapsed by default

  return (
    <SidebarProvider open={open} onOpenChange={setOpen} defaultOpen={false}>
      <div className="flex min-h-screen w-full bg-background">
        <div
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
          className="contents"
        >
          <AppSidebar />
        </div>
        <SidebarInset className="flex min-w-0 flex-1 flex-col">
          <TopBar />
          <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 md:px-6 md:py-8">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
