import { Link, useLocation } from "@tanstack/react-router";
import { LayoutGrid, Store, MessageCircle, UserCircle, Bell, Code2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { notifications } from "@/lib/mock-data";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const navItems = [
  { to: "/dashboard" as const, icon: LayoutGrid, label: "Dashboard" },
  { to: "/market" as const, icon: Store, label: "Market" },
  { to: "/chat" as const, icon: MessageCircle, label: "Chat" },
  { to: "/profile" as const, icon: UserCircle, label: "Profile" },
];

function Logo() {
  return (
    <Link to="/dashboard" className="flex items-center gap-2">
      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-navy text-navy-foreground">
        <Code2 className="h-4 w-4" />
      </div>
      <div className="leading-tight">
        <p className="text-sm font-semibold tracking-tight text-foreground">The Exchange</p>
        <p className="text-[10px] font-medium text-muted-foreground">Engineering Skill Network</p>
      </div>
    </Link>
  );
}

function NotificationBell() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="relative rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
            {notifications.length}
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="border-b border-border px-4 py-3">
          <p className="text-sm font-semibold text-foreground">Notifications</p>
        </div>
        <ul className="divide-y divide-border">
          {notifications.map(n => (
            <li key={n.id} className="px-4 py-3 transition-colors hover:bg-muted/50">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-medium text-foreground">{n.title}</p>
                <span className="text-[10px] text-muted-foreground">{n.time}</span>
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">{n.body}</p>
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
}

export function AppHeader() {
  const { user } = useAuth();
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6">
        <Logo />

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map(({ to, icon: Icon, label }) => {
            const isActive = pathname === to || (to === "/dashboard" && pathname === "/");
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <NotificationBell />
          {user && (
            <Link to="/profile" className="flex items-center gap-2 rounded-full border border-border bg-card pl-1 pr-3 py-1 transition-colors hover:bg-muted">
              <img src={user.avatar} alt={user.name} className="h-7 w-7 rounded-full object-cover" />
              <span className="hidden text-xs font-medium text-foreground md:inline">{user.name.split(" ")[0]}</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export function BottomNav() {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card md:hidden">
      <div className="mx-auto flex max-w-lg items-center justify-around py-2">
        {navItems.map(({ to, icon: Icon, label }) => {
          const isActive = pathname === to || (to === "/dashboard" && pathname === "/");
          return (
            <Link key={to} to={to} className="flex flex-col items-center gap-0.5 px-3 py-1">
              <Icon className={`h-5 w-5 transition-colors ${isActive ? "text-primary" : "text-muted-foreground"}`} />
              <span className={`text-[10px] font-medium transition-colors ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background pb-20 md:pb-10">
      <AppHeader />
      <main className="mx-auto max-w-6xl px-4 py-6 md:px-6 md:py-8">{children}</main>
      <BottomNav />
    </div>
  );
}
