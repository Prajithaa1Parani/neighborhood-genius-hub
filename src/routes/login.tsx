import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { DEMO_CREDENTIALS } from "@/lib/mock-data";
import { Eye, EyeOff, Code2, ArrowLeft, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in or sign up — The Exchange" },
      { name: "description", content: "Sign in or create an account on The Exchange — the engineering skill network." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { login, signup, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate({ to: "/dashboard" });
  }, [isAuthenticated, navigate]);

  if (isAuthenticated) return null;

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left brand panel */}
      <div className="relative hidden overflow-hidden bg-[#070b1a] text-white lg:block">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,#1e293b_0%,#070b1a_60%,#03060f_100%)]" />
        <div className="absolute inset-0 grid-bg radial-fade opacity-40" />
        <div className="absolute -top-40 -left-20 h-[420px] w-[420px] rounded-full bg-blue-600/30 blur-[120px] animate-float-slow" />
        <div className="absolute bottom-0 right-0 h-[360px] w-[360px] rounded-full bg-fuchsia-500/20 blur-[120px] animate-float-slower" />

        <div className="relative z-10 flex h-full flex-col p-12">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30">
              <Code2 className="h-4.5 w-4.5 text-white" />
            </div>
            <div className="leading-tight">
              <p className="text-sm font-semibold tracking-tight">The Exchange</p>
              <p className="text-[10px] font-medium text-white/50">Engineering Skill Network</p>
            </div>
          </Link>

          <div className="my-auto max-w-md">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs text-white/80">
              <Sparkles className="h-3 w-3" />
              Trusted by 3,800+ engineers
            </div>
            <h1 className="text-balance text-4xl font-semibold tracking-tight md:text-5xl">
              Your network is your <span className="gradient-text">unfair advantage.</span>
            </h1>
            <p className="mt-5 text-white/65">
              Sign in to trade deep engineering expertise — system design, ML, infra, security — with verified peers.
            </p>

            <figure className="mt-10 rounded-xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur">
              <p className="text-sm leading-relaxed text-white/85">
                "Two sessions on The Exchange taught me more about Kafka than three months of YouTube ever did."
              </p>
              <figcaption className="mt-3 text-xs text-white/55">— Rohan D., DevOps Architect</figcaption>
            </figure>
          </div>

          <Link to="/" className="inline-flex w-fit items-center gap-1.5 text-xs text-white/60 transition-colors hover:text-white">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to homepage
          </Link>
        </div>
      </div>

      {/* Right form panel */}
      <div className="relative flex items-center justify-center bg-background px-4 py-10">
        <Link to="/" className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to home
        </Link>
        <div className="w-full max-w-md">
          <div className="mb-6 lg:hidden">
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy text-navy-foreground">
                <Code2 className="h-4 w-4" />
              </div>
              <span className="text-sm font-semibold">The Exchange</span>
            </Link>
          </div>

          <Card className="border-border shadow-sm">
            <CardContent className="p-6 md:p-8">
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Log in</TabsTrigger>
                  <TabsTrigger value="signup">Sign up</TabsTrigger>
                </TabsList>

                <TabsContent value="login" className="mt-6">
                  <LoginForm
                    onSuccess={() => navigate({ to: "/dashboard" })}
                    login={login}
                  />
                </TabsContent>

                <TabsContent value="signup" className="mt-6">
                  <SignupForm
                    onSuccess={() => {
                      toast.success("Account created — welcome aboard!");
                      navigate({ to: "/dashboard" });
                    }}
                    signup={signup}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            By continuing you agree to our terms and privacy policy.
          </p>
        </div>
      </div>
    </div>
  );
}

function LoginForm({ login, onSuccess }: { login: (e: string, p: string) => { success: boolean; error?: string }; onSuccess: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    await new Promise(r => setTimeout(r, 500));
    const result = login(email, password);
    if (result.success) onSuccess();
    else setError(result.error || "Login failed");
    setIsLoading(false);
  };

  const fillDemo = () => {
    setEmail(DEMO_CREDENTIALS.email);
    setPassword(DEMO_CREDENTIALS.password);
  };

  return (
    <>
      <h2 className="text-xl font-semibold text-foreground">Welcome back</h2>
      <p className="mt-1 text-sm text-muted-foreground">Sign in to continue exchanging skills.</p>

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
    </>
  );
}

function SignupForm({ signup, onSuccess }: { signup: (n: string, e: string, p: string) => { success: boolean; error?: string }; onSuccess: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    await new Promise(r => setTimeout(r, 600));
    const result = signup(name, email, password);
    if (result.success) onSuccess();
    else setError(result.error || "Sign up failed");
    setIsLoading(false);
  };

  return (
    <>
      <h2 className="text-xl font-semibold text-foreground">Create your account</h2>
      <p className="mt-1 text-sm text-muted-foreground">Join 3,800+ engineers trading expertise.</p>

      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="su-name">Full name</Label>
          <Input id="su-name" value={name} onChange={e => setName(e.target.value)} placeholder="Prajithaa Ramesh" required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="su-email">Work email</Label>
          <Input id="su-email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com" required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="su-password">Password</Label>
          <div className="relative">
            <Input id="su-password" type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="At least 6 characters" required className="pr-10" />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Creating account…" : "Create account"}
        </Button>
      </form>
    </>
  );
}
