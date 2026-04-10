import { Link, useLocation } from "@tanstack/react-router";
import { LayoutGrid, Store, MessageCircle, UserCircle, Bell } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

const navItems = [
  { to: "/dashboard" as const, icon: LayoutGrid, label: "Dashboard" },
  { to: "/market" as const, icon: Store, label: "Market" },
  { to: "/chat" as const, icon: MessageCircle, label: "Chat" },
  { to: "/profile" as const, icon: UserCircle, label: "Profile" },
];

export function AppHeader() {
  const { user } = useAuth();
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between bg-nav-bg px-4 py-3">
      <div className="flex items-center gap-2">
        <div className="grid grid-cols-2 gap-0.5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-1.5 w-1.5 rounded-sm bg-primary" />
          ))}
        </div>
        <span className="text-lg font-bold text-primary">The Exchange</span>
      </div>
      <div className="flex items-center gap-3">
        <button className="relative text-nav-foreground transition-colors hover:text-primary">
          <Bell className="h-5 w-5" />
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">3</span>
        </button>
        {user && (
          <img src={user.avatar} alt={user.name} className="h-8 w-8 rounded-full border-2 border-primary" />
        )}
      </div>
    </header>
  );
}

export function BottomNav() {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card">
      <div className="mx-auto flex max-w-lg items-center justify-around py-2">
        {navItems.map(({ to, icon: Icon, label }) => {
          const isActive = pathname === to || (to === "/dashboard" && pathname === "/");
          return (
            <Link key={to} to={to} className="flex flex-col items-center gap-0.5 px-3 py-1">
              <Icon className={`h-5 w-5 transition-colors ${isActive ? "text-primary" : "text-muted-foreground"}`} />
              <span className={`text-[10px] font-medium transition-colors ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                {label.toUpperCase()}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
