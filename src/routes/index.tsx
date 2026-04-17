import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useInView, useMotionValue, useSpring, useTransform, animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  Code2, Sparkles, MessageSquare, ShieldCheck, ArrowRight, Star, Zap, Network,
  GitBranch, Cpu, Layers, Terminal, CheckCircle2, Github, Twitter, Linkedin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { AVATARS } from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "The Exchange — Trade Engineering Skills, Level Up Together" },
      { name: "description", content: "A premium peer-to-peer network where senior software engineers exchange skills in system design, ML, DevOps, security, and more." },
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
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };

const LOGOS = ["STRIPE", "VERCEL", "OPENAI", "DATABRICKS", "FIGMA", "NETFLIX", "AIRBNB", "DATADOG", "LINEAR", "NOTION"];

function CountUp({ to, suffix = "", duration = 1.6 }: { to: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setVal(v),
    });
    return () => controls.stop();
  }, [inView, to, duration]);
  const display = to >= 1000 ? Math.round(val).toLocaleString() : val.toFixed(to % 1 === 0 ? 0 : 2);
  return <span ref={ref}>{display}{suffix}</span>;
}

function TypingCode() {
  const lines = [
    { t: "$ ", c: "import { exchange } from \"@theexchange/sdk\";", color: "text-white/85" },
    { t: "", c: "", color: "" },
    { t: "", c: "const match = await exchange.match({", color: "text-blue-300" },
    { t: "", c: "  skill: \"system-design\",", color: "text-emerald-300" },
    { t: "", c: "  level: \"senior\",", color: "text-emerald-300" },
    { t: "", c: "  city: \"Bengaluru\",", color: "text-emerald-300" },
    { t: "", c: "});", color: "text-blue-300" },
    { t: "", c: "", color: "" },
    { t: "→ ", c: "matched: Arjun Mehta · 4.92★ · 1.2km", color: "text-fuchsia-300" },
  ];
  const [shown, setShown] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setShown((s) => (s >= lines.length ? lines.length : s + 1)), 320);
    return () => clearInterval(id);
  }, []);
  return (
    <pre className="font-mono text-[12.5px] leading-relaxed text-white/70">
      {lines.slice(0, shown).map((l, i) => (
        <div key={i} className="min-h-[1.1em]">
          <span className="text-white/30 select-none mr-3">{String(i + 1).padStart(2, "0")}</span>
          <span className="text-white/40">{l.t}</span>
          <span className={l.color}>{l.c}</span>
          {i === shown - 1 && <span className="animate-blink ml-0.5 inline-block h-3 w-1.5 translate-y-0.5 bg-blue-300" />}
        </div>
      ))}
    </pre>
  );
}

function LandingPage() {
  const { isAuthenticated } = useAuth();
  const heroRef = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 20 });
  const sy = useSpring(my, { stiffness: 60, damping: 20 });
  const orb1X = useTransform(sx, (v) => v * 30);
  const orb1Y = useTransform(sy, (v) => v * 30);
  const orb2X = useTransform(sx, (v) => v * -45);
  const orb2Y = useTransform(sy, (v) => v * -25);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const w = window.innerWidth, h = window.innerHeight;
      mx.set((e.clientX - w / 2) / (w / 2));
      my.set((e.clientY - h / 2) / (h / 2));
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [mx, my]);

  const headlineWords = ["Trade", "engineering", "skills."];

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#050813] text-white antialiased">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#13203b_0%,#070b1a_55%,#03060f_100%)]" />
        <div className="absolute inset-0 aurora animate-aurora" />
        <div className="absolute inset-0 grid-bg radial-fade animate-grid-pan opacity-30" />
        <motion.div style={{ x: orb1X, y: orb1Y }} className="absolute -top-40 -left-40 h-[560px] w-[560px] rounded-full bg-blue-600/30 blur-[130px] animate-float-slow" />
        <motion.div style={{ x: orb2X, y: orb2Y }} className="absolute top-1/3 -right-40 h-[520px] w-[520px] rounded-full bg-fuchsia-500/20 blur-[130px] animate-float-slower" />
        <div className="absolute bottom-0 left-1/3 h-[440px] w-[440px] rounded-full bg-cyan-400/15 blur-[130px] animate-float-slow" />
        <div className="absolute inset-0 noise" />
      </div>

      {/* Nav */}
      <nav className="relative z-30">
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
            <a href="#network" className="hover:text-white transition-colors">Network</a>
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
                  <Button className="bg-white text-slate-900 hover:bg-white/90 shadow-lg shadow-white/10">Sign up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section ref={heroRef} className="relative z-10 mx-auto max-w-7xl px-6 pt-12 pb-24 md:pt-20 md:pb-28">
        <div className="grid items-center gap-10 lg:grid-cols-12">
          <motion.div initial="hidden" animate="visible" variants={stagger} className="lg:col-span-7">
            <motion.div variants={fadeUp} className="mb-6 inline-flex items-center gap-2 rounded-full glass px-3.5 py-1.5 text-xs font-medium text-white/85">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-pulse-ring" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              847 engineers online · 24 cities
            </motion.div>

            <h1 className="text-balance text-5xl font-semibold tracking-tight md:text-7xl">
              {headlineWords.map((w, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ duration: 0.7, delay: 0.1 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                  className="mr-3 inline-block"
                >
                  {w}
                </motion.span>
              ))}
              <br />
              <motion.span
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.55 }}
                className="text-shimmer"
              >
                Level up together.
              </motion.span>
            </h1>

            <motion.p variants={fadeUp} className="mt-6 max-w-xl text-balance text-base text-white/65 md:text-lg">
              The Exchange is a private network where senior engineers swap deep expertise — system design, ML, distributed infra, security — through 1:1 sessions. No money. Just signal.
            </motion.p>

            <motion.div variants={fadeUp} className="mt-8 flex flex-wrap items-center gap-3">
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

            <motion.p variants={fadeUp} className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-white/45">
              <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-400/80" /> No credit card</span>
              <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-400/80" /> 60-second signup</span>
              <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-400/80" /> 3,800+ verified engineers</span>
            </motion.p>
          </motion.div>

          {/* Floating preview card */}
          <motion.div
            initial={{ opacity: 0, y: 40, rotate: -3 }}
            animate={{ opacity: 1, y: 0, rotate: -3 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative hidden lg:col-span-5 lg:block"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative mx-auto max-w-md"
            >
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-blue-500/40 via-fuchsia-500/30 to-cyan-400/40 blur-xl" />
              <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-[#0a0f1f]/90 p-6 shadow-2xl backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-1 text-[10px] font-medium text-emerald-300 ring-1 ring-emerald-400/30">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> NEW MATCH
                  </span>
                  <span className="text-[10px] uppercase tracking-widest text-white/40">98% fit</span>
                </div>
                <div className="mt-5 flex items-center gap-3">
                  <img src={AVATARS.arjun} alt="Arjun Mehta" className="h-12 w-12 rounded-full object-cover ring-2 ring-white/10" />
                  <div>
                    <p className="text-sm font-semibold text-white">Arjun Mehta</p>
                    <p className="text-xs text-white/50">Staff Engineer · Distributed Systems</p>
                  </div>
                </div>
                <p className="mt-4 text-xs text-white/60">Offers <span className="text-white/90">System Design</span> in exchange for <span className="text-white/90">PyTorch fundamentals</span>.</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {["System Design", "Go", "Kafka", "K8s"].map((t) => (
                    <span key={t} className="rounded-md bg-white/5 px-2 py-0.5 text-[10px] text-white/70 ring-1 ring-white/10">{t}</span>
                  ))}
                </div>
                <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
                  <div className="flex items-center gap-1 text-xs text-amber-300">
                    <Star className="h-3 w-3 fill-current" /> 4.92 · 87 reviews
                  </div>
                  <Button size="sm" className="h-7 bg-white text-[11px] text-slate-900 hover:bg-white/90">Request →</Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Marquee logos */}
      <section className="relative z-10 border-y border-white/5 bg-white/[0.015] py-8 marquee-pause">
        <p className="mb-6 text-center text-[11px] uppercase tracking-[0.2em] text-white/40">Engineers from teams at</p>
        <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
          <div className="marquee-track flex w-max gap-14 whitespace-nowrap px-4 text-lg font-semibold tracking-wide text-white/55">
            {[...LOGOS, ...LOGOS].map((l, i) => (
              <span key={i} className="transition-colors hover:text-white">{l}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 py-24">
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={stagger}
          className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur md:grid-cols-4"
        >
          {[
            { v: 12400, suffix: "+", l: "Skills exchanged" },
            { v: 3800, suffix: "", l: "Verified engineers" },
            { v: 47000, suffix: "", l: "Hours mentored" },
            { v: 4.92, suffix: "★", l: "Average rating" },
          ].map((s) => (
            <motion.div key={s.l} variants={fadeUp} className="bg-[#070b1a] p-8 text-center">
              <p className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
                <CountUp to={s.v} suffix={s.suffix} />
              </p>
              <p className="mt-2 text-xs uppercase tracking-wider text-white/50">{s.l}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Live network */}
      <section id="network" className="relative z-10 mx-auto max-w-7xl px-6 pb-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.p variants={fadeUp} className="text-[11px] uppercase tracking-[0.2em] text-blue-300/80">A live network</motion.p>
            <motion.h2 variants={fadeUp} className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
              Real engineers.<br /><span className="gradient-text">Real exchanges.</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-5 text-white/65">
              Every node is a verified engineer. Every line is a skill traded — happening right now across Bengaluru, Berlin, Bangkok, San Francisco, and beyond.
            </motion.p>
            <motion.div variants={fadeUp} className="mt-8 grid grid-cols-3 gap-4">
              {[
                { v: "24", l: "Active cities" },
                { v: "61", l: "Skill domains" },
                { v: "<2h", l: "Avg match time" },
              ].map((s) => (
                <div key={s.l} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-2xl font-semibold text-white">{s.v}</p>
                  <p className="mt-0.5 text-[11px] uppercase tracking-wider text-white/45">{s.l}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="relative">
            <div className="relative aspect-square w-full overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#0a0f1f] to-[#070b1a] p-6">
              <svg viewBox="0 0 400 400" className="h-full w-full">
                <defs>
                  <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#60a5fa" stopOpacity="0" />
                  </radialGradient>
                </defs>
                {/* connecting lines */}
                {[
                  ["200,200", "80,90"], ["200,200", "320,80"], ["200,200", "340,260"],
                  ["200,200", "70,300"], ["200,200", "210,60"], ["200,200", "60,200"],
                  ["80,90", "320,80"], ["320,80", "340,260"], ["70,300", "340,260"],
                ].map(([a, b], i) => {
                  const [x1, y1] = a.split(",").map(Number);
                  const [x2, y2] = b.split(",").map(Number);
                  return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(96,165,250,0.35)" strokeWidth="1.2" className="animate-dash-flow" />;
                })}
                {[
                  { x: 200, y: 200, r: 26, c: "#3b82f6", label: "You" },
                  { x: 80, y: 90, r: 18, c: "#8b5cf6" },
                  { x: 320, y: 80, r: 16, c: "#06b6d4" },
                  { x: 340, y: 260, r: 20, c: "#ec4899" },
                  { x: 70, y: 300, r: 17, c: "#10b981" },
                  { x: 210, y: 60, r: 14, c: "#f59e0b" },
                  { x: 60, y: 200, r: 15, c: "#6366f1" },
                ].map((n, i) => (
                  <g key={i}>
                    <circle cx={n.x} cy={n.y} r={n.r + 12} fill="url(#nodeGlow)" />
                    <circle cx={n.x} cy={n.y} r={n.r} fill={n.c} fillOpacity="0.85" stroke="white" strokeOpacity="0.4" strokeWidth="1.5" />
                    {n.label && <text x={n.x} y={n.y + 4} textAnchor="middle" className="fill-white text-[10px] font-semibold">{n.label}</text>}
                  </g>
                ))}
              </svg>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features bento */}
      <section id="features" className="relative z-10 mx-auto max-w-7xl px-6 pb-24">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="mx-auto max-w-2xl text-center">
          <motion.p variants={fadeUp} className="text-[11px] uppercase tracking-[0.2em] text-blue-300/80">What you get</motion.p>
          <motion.h2 variants={fadeUp} className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">Built for serious engineers.</motion.h2>
          <motion.p variants={fadeUp} className="mt-4 text-white/60">Every feature designed around real practice — not passive consumption.</motion.p>
        </motion.div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="mt-14 grid gap-5 md:grid-cols-3 md:grid-rows-2">
          {/* Big card 1 */}
          <motion.div variants={fadeUp} className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-7 md:col-span-2 md:row-span-1">
            <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-blue-500/20 blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <div className="relative flex h-full flex-col">
              <div className="icon-chip-navy flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 ring-1 ring-white/10">
                <Network className="h-5 w-5 text-blue-300" />
              </div>
              <h3 className="mt-5 text-xl font-semibold text-white">Skill Marketplace</h3>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-white/60">Discover engineers nearby offering the exact expertise you need — Kubernetes, ML inference, low-latency systems.</p>
              <div className="mt-6 flex flex-wrap gap-1.5">
                {["System Design", "Distributed Systems", "Rust", "ML Ops", "Security", "GraphQL", "Postgres"].map((t) => (
                  <span key={t} className="rounded-md bg-white/5 px-2.5 py-1 text-[11px] text-white/75 ring-1 ring-white/10">{t}</span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Small card */}
          <motion.div variants={fadeUp} className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-7">
            <div className="icon-chip-navy flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 ring-1 ring-white/10">
              <ShieldCheck className="h-5 w-5 text-emerald-300" />
            </div>
            <h3 className="mt-5 text-lg font-semibold text-white">Verified Engineers</h3>
            <p className="mt-2 text-sm leading-relaxed text-white/60">Every profile vetted via GitHub, employer & peer reviews.</p>
            <div className="mt-5 flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] p-2.5">
              <Github className="h-4 w-4 text-white/60" />
              <span className="text-xs text-white/70">github.com/arjunm</span>
              <CheckCircle2 className="ml-auto h-4 w-4 text-emerald-400" />
            </div>
          </motion.div>

          {/* Small */}
          <motion.div variants={fadeUp} className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-7">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-500/20 to-pink-500/20 ring-1 ring-white/10">
              <MessageSquare className="h-5 w-5 text-fuchsia-300" />
            </div>
            <h3 className="mt-5 text-lg font-semibold text-white">AI-Powered Chat</h3>
            <p className="mt-2 text-sm leading-relaxed text-white/60">Each profile augmented with a domain-aware AI persona.</p>
            <div className="mt-5 space-y-1.5">
              <div className="ml-auto w-fit max-w-[80%] rounded-lg rounded-br-sm bg-blue-600/30 px-3 py-1.5 text-[11px] text-white/90 ring-1 ring-blue-400/20">How do you shard at 100k QPS?</div>
              <div className="w-fit max-w-[80%] rounded-lg rounded-bl-sm bg-white/5 px-3 py-1.5 text-[11px] text-white/80 ring-1 ring-white/10">Consistent hashing + read replicas...</div>
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-7">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 ring-1 ring-white/10">
              <Cpu className="h-5 w-5 text-amber-300" />
            </div>
            <h3 className="mt-5 text-lg font-semibold text-white">Deep Domains</h3>
            <p className="mt-2 text-sm leading-relaxed text-white/60">From compilers to CRDTs — only CS & engineering, no fluff.</p>
          </motion.div>

          <motion.div variants={fadeUp} className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-7">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 ring-1 ring-white/10">
              <Layers className="h-5 w-5 text-cyan-300" />
            </div>
            <h3 className="mt-5 text-lg font-semibold text-white">Structured Sessions</h3>
            <p className="mt-2 text-sm leading-relaxed text-white/60">60–90 min focused exchanges with shared agendas.</p>
          </motion.div>
        </motion.div>
      </section>

      {/* Code panel */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-24">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.p variants={fadeUp} className="text-[11px] uppercase tracking-[0.2em] text-blue-300/80">Built by engineers</motion.p>
            <motion.h2 variants={fadeUp} className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">An API for skill exchange.</motion.h2>
            <motion.p variants={fadeUp} className="mt-5 text-white/65">First-class SDK. Webhooks for matches. CLI for scheduling. Treat your career growth like infrastructure — declarative, observable, version-controlled.</motion.p>
            <motion.ul variants={fadeUp} className="mt-6 space-y-2.5 text-sm text-white/70">
              {["Match by skill, level, city, availability", "Webhooks for new matches & session events", "OAuth via GitHub — zero friction signup"].map((t) => (
                <li key={t} className="flex items-start gap-2.5"><CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-400" /><span>{t}</span></li>
              ))}
            </motion.ul>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="relative">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-blue-500/30 via-fuchsia-500/20 to-cyan-400/30 blur-xl" />
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#070b1a] shadow-2xl">
              <div className="flex items-center gap-2 border-b border-white/10 bg-white/[0.02] px-4 py-2.5">
                <span className="h-3 w-3 rounded-full bg-red-500/70" />
                <span className="h-3 w-3 rounded-full bg-amber-500/70" />
                <span className="h-3 w-3 rounded-full bg-emerald-500/70" />
                <div className="ml-3 flex items-center gap-2 text-xs text-white/50">
                  <Terminal className="h-3.5 w-3.5" /> exchange.ts
                </div>
              </div>
              <div className="p-5">
                <TypingCode />
              </div>
            </div>
          </motion.div>
        </div>
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
            { n: "02", icon: GitBranch, t: "Match & chat", d: "Request an exchange. Use AI chat to align expectations & scope." },
            { n: "03", icon: Zap, t: "Trade & review", d: "Run focused 60–90 min sessions. Both sides leave a verified review." },
          ].map((s) => (
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
          ].map((t) => (
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
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 p-12 md:p-16"
        >
          <div className="absolute inset-0 grid-bg opacity-20" />
          <div className="absolute inset-0 noise" />
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/20 blur-3xl" />
          <div className="relative mx-auto max-w-2xl text-center">
            <h2 className="text-balance text-4xl font-semibold tracking-tight text-white md:text-5xl">
              <span className="text-shimmer">Your next skill is one exchange away.</span>
            </h2>
            <p className="mt-4 text-white/80">Join 3,800+ engineers trading the kind of expertise you can't get from a course.</p>
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
      <footer className="relative z-10 border-t border-white/10 bg-[#03060f]/60">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <div className="grid gap-10 md:grid-cols-5">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600">
                  <Code2 className="h-4.5 w-4.5 text-white" />
                </div>
                <p className="text-sm font-semibold tracking-tight">The Exchange</p>
              </div>
              <p className="mt-4 max-w-xs text-sm text-white/55">A private peer-to-peer network for senior software engineers. Trade skills. Level up together.</p>
              <div className="mt-5 flex items-center gap-3">
                {[Github, Twitter, Linkedin].map((Icon, i) => (
                  <a key={i} href="#" className="flex h-8 w-8 items-center justify-center rounded-md border border-white/10 text-white/60 transition-colors hover:border-white/30 hover:text-white">
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
            {[
              { h: "Product", l: ["Marketplace", "AI Chat", "Verified profiles", "Pricing"] },
              { h: "Company", l: ["About", "Careers", "Press", "Contact"] },
              { h: "Resources", l: ["Docs", "API", "Changelog", "Status"] },
            ].map((c) => (
              <div key={c.h}>
                <p className="text-[11px] font-semibold uppercase tracking-widest text-white/45">{c.h}</p>
                <ul className="mt-4 space-y-2.5 text-sm text-white/70">
                  {c.l.map((i) => <li key={i}><a href="#" className="hover:text-white transition-colors">{i}</a></li>)}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-white/45">
            <span>© 2025 The Exchange · Engineering Skill Network</span>
            <div className="flex items-center gap-5">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Security</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
