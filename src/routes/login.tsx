import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { DEMO_CREDENTIALS } from "@/lib/mock-data";
import { Eye, EyeOff } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login — The Exchange" },
      { name: "description", content: "Sign in to your Hyperlocal Skill Exchange account" },
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

  if (isAuthenticated) {
    navigate({ to: "/dashboard" });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    await new Promise(r => setTimeout(r, 800));
    
    const result = login(email, password);
    if (result.success) {
      navigate({ to: "/dashboard" });
    } else {
      setError(result.error || "Login failed");
    }
    setIsLoading(false);
  };

  const fillDemo = () => {
    setEmail(DEMO_CREDENTIALS.email);
    setPassword(DEMO_CREDENTIALS.password);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-nav-bg px-6">
      <div className="mb-8 text-center">
        <div className="mb-4 flex items-center justify-center gap-2">
          <div className="grid grid-cols-2 gap-1">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-2 w-2 rounded-sm bg-primary" />
            ))}
          </div>
          <span className="text-2xl font-bold text-primary">The Exchange</span>
        </div>
        <p className="text-nav-foreground">Hyperlocal Skill Exchange Platform</p>
      </div>

      <div className="w-full max-w-sm rounded-2xl bg-card p-6 shadow-xl">
        <h2 className="mb-1 text-xl font-bold text-card-foreground">Welcome back</h2>
        <p className="mb-6 text-sm text-muted-foreground">Sign in to continue exchanging skills</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">EMAIL</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">PASSWORD</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3 py-2.5 pr-10 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="••••••••"
                required
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="cta-gradient w-full rounded-lg py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="mt-4 rounded-lg border border-dashed border-primary/30 bg-primary/5 p-3">
          <p className="mb-2 text-center text-xs font-medium text-muted-foreground">DEMO CREDENTIALS</p>
          <p className="text-center text-xs text-muted-foreground">
            <span className="font-medium text-foreground">{DEMO_CREDENTIALS.email}</span><br />
            <span className="font-medium text-foreground">{DEMO_CREDENTIALS.password}</span>
          </p>
          <button onClick={fillDemo} className="mt-2 w-full rounded-md bg-primary/10 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/20">
            Auto-fill Demo Credentials
          </button>
        </div>
      </div>
    </div>
  );
}
