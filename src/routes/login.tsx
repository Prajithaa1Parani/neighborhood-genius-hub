import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { DEMO_CREDENTIALS } from "@/lib/mock-data";
import { Eye, EyeOff, Code2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — The Exchange" },
      { name: "description", content: "Sign in to The Exchange — the engineering skill network" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) navigate({ to: "/dashboard" });
  }, [isAuthenticated, navigate]);

  if (isAuthenticated) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    await new Promise(r => setTimeout(r, 600));
    const result = login(email, password);
    if (result.success) navigate({ to: "/dashboard" });
    else setError(result.error || "Login failed");
    setIsLoading(false);
  };

  const fillDemo = () => {
    setEmail(DEMO_CREDENTIALS.email);
    setPassword(DEMO_CREDENTIALS.password);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-navy text-navy-foreground">
            <Code2 className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">The Exchange</h1>
          <p className="mt-1 text-sm text-muted-foreground">Engineering Skill Network</p>
        </div>

        <Card className="border-border shadow-sm">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-foreground">Welcome back</h2>
            <p className="mt-0.5 text-sm text-muted-foreground">Sign in to continue exchanging skills.</p>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com" required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input id="password" type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required className="pr-10" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? "Signing in…" : "Sign in"}
              </Button>
            </form>

            <div className="mt-5 rounded-lg border border-dashed border-primary/30 bg-primary/5 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-primary">Demo credentials</p>
              <div className="mt-2 space-y-0.5 text-xs">
                <p className="font-mono text-foreground">{DEMO_CREDENTIALS.email}</p>
                <p className="font-mono text-foreground">{DEMO_CREDENTIALS.password}</p>
              </div>
              <Button onClick={fillDemo} variant="outline" size="sm" className="mt-3 w-full">
                Auto-fill demo credentials
              </Button>
            </div>
          </CardContent>
        </Card>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          By signing in you agree to our terms and privacy policy.
        </p>
      </div>
    </div>
  );
}
