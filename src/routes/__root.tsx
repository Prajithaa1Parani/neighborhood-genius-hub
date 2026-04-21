import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth-context";
import { ExchangesProvider } from "@/lib/exchanges-context";
import { Toaster } from "@/components/ui/sonner";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">The page you're looking for doesn't exist.</p>
        <div className="mt-6">
          <Link to="/" className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "The Exchange — Engineering Skill Network" },
      { name: "description", content: "Trade engineering skills with other software engineers. System design, ML, DevOps, security and more." },
      { property: "og:title", content: "The Exchange — Engineering Skill Network" },
      { property: "og:description", content: "Trade engineering skills with other software engineers. System design, ML, DevOps, security and more." },
      { property: "og:type", content: "website" },
      { name: "twitter:title", content: "The Exchange — Engineering Skill Network" },
      { name: "twitter:description", content: "Trade engineering skills with other software engineers. System design, ML, DevOps, security and more." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/d1c1509c-b693-4e1e-a45d-447f19d3f0fd/id-preview-f698efcd--6dc54afd-3aac-4eec-b5d4-f6467fadae58.lovable.app-1776792940027.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/d1c1509c-b693-4e1e-a45d-447f19d3f0fd/id-preview-f698efcd--6dc54afd-3aac-4eec-b5d4-f6467fadae58.lovable.app-1776792940027.png" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <AuthProvider>
      <ExchangesProvider>
        <Outlet />
        <Toaster position="top-right" richColors />
      </ExchangesProvider>
    </AuthProvider>
  );
}
