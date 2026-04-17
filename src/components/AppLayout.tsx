import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { LayoutGrid, Store, MessageCircle, UserCircle, Bell, Code2, LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { notifications } from "@/lib/mock-data";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
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
  { to: "/chat" as const, icon: MessageCircle, label: "Chat" },
  { to: "/profile" as const, icon: UserCircle, label: "Profile" },
];

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

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarHeader className="border-b border-border">
        <Link to="/dashboard" className="flex items-center gap-2 px-2 py-2">
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
            <img src={user.avatar} alt={user.name} className="h-9 w-9 rounded-full object-cover" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-foreground">{user.name}</p>
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
    location.pathname.startsWith("/profile") ? "Profile" : "";

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-border bg-card/80 px-4 backdrop-blur md:px-6">
      <SidebarTrigger className="-ml-1" />
      <div className="h-5 w-px bg-border" />
      <p className="text-sm font-semibold text-foreground">{pageTitle}</p>
      <div className="ml-auto flex items-center gap-2">
        <NotificationBell />
        {user && (
          <Link to="/profile" className="flex items-center gap-2 rounded-full border border-border bg-card pl-1 pr-3 py-1 transition-colors hover:bg-muted">
            <img src={user.avatar} alt={user.name} className="h-7 w-7 rounded-full object-cover" />
            <span className="hidden text-xs font-medium text-foreground sm:inline">{user.name.split(" ")[0]}</span>
          </Link>
        )}
      </div>
    </header>
  );
}

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <SidebarInset className="flex min-w-0 flex-1 flex-col">
          <TopBar />
          <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 md:px-6 md:py-8">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
