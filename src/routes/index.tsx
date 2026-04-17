import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Code2, Sparkles, Users, MessageSquare, ShieldCheck, ArrowRight, Star, Zap, Network, GitBranch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { AVATARS } from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "The Exchange — Trade Engineering Skills, Level Up Together" },
      { name: "description", content: "A premium peer-to-peer network where software engineers exchange skills in system design, ML, DevOps, security, and more." },
      { property: "og:title", content: "The Exchange — Engineering Skill Network" },
      { property: "og:description", content: "Trade engineering skills with verified peers. System design, ML, DevOps, security, and beyond." },
    ],
  }),
  component: LandingPage,
});

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

function LandingPage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#070b1a] text-white antialiased">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#1e293b_0%,#070b1a_55%,#03060f_100%)]" />
        <div className="absolute inset-0 grid-bg radial-fade animate-grid-pan opacity-40" />
        <div className="absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full bg-blue-600/30 blur-[120px] animate-float-slow" />
        <div className="absolute top-1/3 -right-40 h-[480px] w-[480px] rounded-full bg-fuchsia-500/20 blur-[120px] animate-float-slower" />
        <div className="absolute bottom-0 left-1/3 h-[420px] w-[420px] rounded-full bg-cyan-400/15 blur-[120px] animate-float-slow" />
      </div>

      {/* Nav */}
      <nav className="relative z-20">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30">
              <Code2 className="h-4.5 w-4.5 text-white" />
            </div>
            <div className="leading-tight">
              <p className="text-sm font-semibold tracking-tight">The Exchange</p>
              <p className="text-[10px] font-medium text-white/50">Engineering Skill Network</p>
            </div>
          </Link>
          <div className="hidden items-center gap-7 text-sm text-white/70 md:flex">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how" className="hover:text-white transition-colors">How it works</a>
            <a href="#testimonials" className="hover:text-white transition-colors">Engineers</a>
          </div>
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <Link to="/dashboard">
                <Button className="bg-white text-slate-900 hover:bg-white/90">Go to Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" className="text-white hover:bg-white/10 hover:text-white">Log in</Button>
                </Link>
                <Link to="/login">
                  <Button className="bg-white text-slate-900 hover:bg-white/90 shadow-lg shadow-white/10">
                    Sign up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 pt-16 pb-24 md:pt-24 md:pb-32">
        <motion.div initial="hidden" animate="visible" variants={stagger} className="mx-auto max-w-4xl text-center">
          <motion.div variants={fadeUp} className="mb-6 inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-medium text-white/80">
            <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_2px_rgba(52,211,153,0.6)]" />
            Now matching engineers across 24 cities
          </motion.div>
          <motion.h1 variants={fadeUp} className="text-balance text-5xl font-semibold tracking-tight md:text-7xl">
            Trade engineering skills.
            <br />
            <span className="gradient-text">Level up together.</span>
          </motion.h1>
          <motion.p variants={fadeUp} className="mx-auto mt-6 max-w-2xl text-balance text-base text-white/65 md:text-lg">
            The Exchange is a private network where senior engineers swap deep expertise — system design, ML, distributed infra, security — through 1:1 sessions. No money. Just signal.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link to="/login">
              <Button size="lg" className="h-12 bg-white px-7 text-slate-900 hover:bg-white/90 shadow-xl shadow-blue-500/20">
                Get started <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="h-12 border-white/15 bg-white/5 px-7 text-white hover:bg-white/10 hover:text-white">
                Log in
              </Button>
            </Link>
          </motion.div>

          <motion.div variants={fadeUp} className="mt-14">
            <p className="text-[11px] uppercase tracking-[0.2em] text-white/40">Engineers from</p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-sm font-semibold text-white/55">
              <span>STRIPE</span>
              <span>AIRBNB</span>
              <span>NETFLIX</span>
              <span>FIGMA</span>
              <span>VERCEL</span>
              <span>DATABRICKS</span>
              <span>OPENAI</span>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
          className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur md:grid-cols-4"
        >
          {[
            { v: "12,400+", l: "Skills exchanged" },
            { v: "3,800", l: "Verified engineers" },
            { v: "47k", l: "Hours mentored" },
            { v: "4.92★", l: "Average rating" },
          ].map(s => (
            <motion.div key={s.l} variants={fadeUp} className="bg-[#070b1a] p-8 text-center">
              <p className="text-3xl font-semibold tracking-tight text-white md:text-4xl">{s.v}</p>
              <p className="mt-2 text-xs uppercase tracking-wider text-white/50">{s.l}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="relative z-10 mx-auto max-w-7xl px-6 pb-24">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="mx-auto max-w-2xl text-center">
          <motion.p variants={fadeUp} className="text-[11px] uppercase tracking-[0.2em] text-blue-300/80">What you get</motion.p>
          <motion.h2 variants={fadeUp} className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
            Built for serious engineers.
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-4 text-white/60">
            Every feature is designed around real practice — not passive consumption.
          </motion.p>
        </motion.div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="mt-14 grid gap-6 md:grid-cols-3">
          {[
            { icon: Network, title: "Skill Marketplace", body: "Discover engineers near you offering exactly the expertise you need — from Kubernetes to ML inference." },
            { icon: MessageSquare, title: "AI-Powered Chat", body: "Each engineer's profile is augmented with an AI persona that answers in their domain — practice anytime." },
            { icon: ShieldCheck, title: "Verified Engineers", body: "Every profile is vetted via GitHub, employer, and peer reviews. Quality signal, no noise." },
          ].map(f => (
            <motion.div key={f.title} variants={fadeUp} className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-7 transition-all hover:border-white/20 hover:bg-white/[0.06]">
              <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-blue-500/20 blur-3xl transition-opacity duration-500 opacity-0 group-hover:opacity-100" />
              <div className="relative">
                <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 ring-1 ring-white/10">
                  <f.icon className="h-5 w-5 text-blue-300" />
                </div>
                <h3 className="text-lg font-semibold text-white">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60">{f.body}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* How it works */}
      <section id="how" className="relative z-10 mx-auto max-w-7xl px-6 pb-24">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="mx-auto max-w-2xl text-center">
          <motion.p variants={fadeUp} className="text-[11px] uppercase tracking-[0.2em] text-blue-300/80">Process</motion.p>
          <motion.h2 variants={fadeUp} className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">Three steps to your next skill.</motion.h2>
        </motion.div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="relative mt-14 grid gap-6 md:grid-cols-3">
          <div className="absolute left-0 right-0 top-12 hidden h-px bg-gradient-to-r from-transparent via-white/15 to-transparent md:block" />
          {[
            { n: "01", icon: Sparkles, t: "Post or browse", d: "List a skill you can teach, or browse what local engineers offer." },
            { n: "02", icon: GitBranch, t: "Match & chat", d: "Request an exchange. Use AI chat to clarify scope and align expectations." },
            { n: "03", icon: Zap, t: "Trade & review", d: "Run focused 60–90 min sessions. Both sides leave a verified review." },
          ].map(s => (
            <motion.div key={s.n} variants={fadeUp} className="relative rounded-2xl border border-white/10 bg-[#0a0f1f] p-7">
              <div className="mb-4 flex items-center justify-between">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white/5 ring-1 ring-white/10">
                  <s.icon className="h-5 w-5 text-blue-300" />
                </div>
                <span className="text-xs font-semibold tracking-widest text-white/30">{s.n}</span>
              </div>
              <h3 className="text-lg font-semibold text-white">{s.t}</h3>
              <p className="mt-1.5 text-sm text-white/60">{s.d}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="relative z-10 mx-auto max-w-7xl px-6 pb-24">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="mx-auto max-w-2xl text-center">
          <motion.p variants={fadeUp} className="text-[11px] uppercase tracking-[0.2em] text-blue-300/80">Trusted by engineers</motion.p>
          <motion.h2 variants={fadeUp} className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">A network with signal.</motion.h2>
        </motion.div>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="mt-14 grid gap-6 md:grid-cols-3">
          {[
            { name: "Priya Sharma", role: "ML Engineer · OpenAI alum", avatar: AVATARS.priya, q: "I traded a PyTorch deep-dive for a Go concurrency primer. Both sides walked away genuinely better. Real signal, no fluff." },
            { name: "David Kim", role: "Senior Frontend · Vercel", avatar: AVATARS.david, q: "The AI chat lets me prep before live sessions. By the time we met, we skipped the basics and went straight to architecture." },
            { name: "Liam O'Brien", role: "Security Engineer", avatar: AVATARS.liam, q: "Verified profiles change everything. I know the person across from me has shipped what they're teaching." },
          ].map(t => (
            <motion.div key={t.name} variants={fadeUp} className="rounded-2xl border border-white/10 bg-white/[0.03] p-7">
              <div className="flex gap-1 text-amber-300">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-current" />)}
              </div>
              <p className="mt-4 text-sm leading-relaxed text-white/80">"{t.q}"</p>
              <div className="mt-6 flex items-center gap-3">
                <img src={t.avatar} alt={t.name} className="h-10 w-10 rounded-full object-cover ring-1 ring-white/10" />
                <div>
                  <p className="text-sm font-semibold text-white">{t.name}</p>
                  <p className="text-xs text-white/50">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Final CTA */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 p-12 md:p-16"
        >
          <div className="absolute inset-0 grid-bg opacity-20" />
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/20 blur-3xl" />
          <div className="relative mx-auto max-w-2xl text-center">
            <h2 className="text-balance text-4xl font-semibold tracking-tight text-white md:text-5xl">
              Your next skill is one exchange away.
            </h2>
            <p className="mt-4 text-white/80">
              Join 3,800+ engineers trading the kind of expertise you can't get from a course.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link to="/login">
                <Button size="lg" className="h-12 bg-white px-7 text-slate-900 hover:bg-white/90">
                  Create your account <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="h-12 border-white/30 bg-transparent px-7 text-white hover:bg-white/10 hover:text-white">
                  I already have an account
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-8 text-xs text-white/50">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-white/10">
              <Code2 className="h-3 w-3" />
            </div>
            <span>© 2025 The Exchange · Engineering Skill Network</span>
          </div>
          <div className="flex items-center gap-5">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
