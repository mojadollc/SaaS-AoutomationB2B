import Link from "next/link";
import { ArrowRight, Zap, Shield, Users } from "lucide-react";

const agents = [
  { name: "Customer Support", industry: "E-commerce", status: "active", handled: "1,284", icon: "💬" },
  { name: "Lead Follow-up", industry: "Real Estate", status: "active", handled: "847", icon: "🎯" },
  { name: "Appointment Booking", industry: "Healthcare", status: "active", handled: "2,103", icon: "📅" },
  { name: "Report Generator", industry: "Finance", status: "idle", handled: "412", icon: "📊" },
];

const trust = [
  { icon: <Zap className="w-3.5 h-3.5" />, label: "0.3s avg response" },
  { icon: <Shield className="w-3.5 h-3.5" />, label: "99.9% uptime SLA" },
  { icon: <Users className="w-3.5 h-3.5" />, label: "10K+ businesses" },
];

export default function Hero() {
  return (
    <section
      className="aurora-bg relative min-h-screen flex flex-col overflow-hidden"
    >
      {/* Soft center glow on top of aurora */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 40%, rgba(201,168,76,0.18) 0%, transparent 60%)" }}
      />

      {/* Edge vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 50%, transparent 35%, rgba(0,0,0,0.7) 100%)" }}
      />

      {/* Noise grain */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ opacity: 0.03, backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-8 pt-36 pb-28 flex-1 flex flex-col justify-center w-full">
        <div className="grid lg:grid-cols-[1fr_1.05fr] gap-20 items-center">

          {/* ── LEFT ── */}
          <div>
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 mb-10 px-3.5 py-1.5 rounded-full" style={{ border: "1px solid rgba(201,168,76,0.25)", background: "rgba(201,168,76,0.05)" }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#c9a84c" }} />
              <span className="text-xs font-semibold tracking-[0.18em] uppercase" style={{ color: "#c9a84c" }}>AI Automation Platform</span>
            </div>

            {/* Headline */}
            <h1 className="font-black leading-tight tracking-tighter mb-6" style={{ fontSize: "clamp(2.4rem, 4.5vw, 3.8rem)", color: "#fff" }}>
              Your Business,{" "}
              <span className="shimmer-text">On Autopilot.</span>
            </h1>

            <p className="text-base leading-relaxed mb-10 max-w-[420px] font-light" style={{ color: "rgba(255,255,255,0.42)" }}>
              Deploy AI agents that handle support, bookings, leads, and reports — across every channel, 24 / 7, without hiring a single extra person.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 mb-10">
              <Link
                href="/register"
                className="group inline-flex items-center gap-2.5 font-bold px-6 py-3.5 rounded-xl text-sm transition-opacity hover:opacity-85"
                style={{ background: "linear-gradient(135deg, #c9a84c, #e8c97a)", color: "#080808" }}
              >
                Start Free — No Card Needed
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:text-white"
                style={{ color: "rgba(255,255,255,0.38)" }}
              >
                See how it works
                <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs" style={{ border: "1px solid rgba(255,255,255,0.14)" }}>↓</span>
              </a>
            </div>

            {/* Trust bar */}
            <div className="flex items-center gap-6 flex-wrap">
              {trust.map((t) => (
                <div key={t.label} className="flex items-center gap-2" style={{ color: "rgba(255,255,255,0.3)" }}>
                  <span style={{ color: "rgba(201,168,76,0.7)" }}>{t.icon}</span>
                  <span className="text-xs font-medium">{t.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT — Dashboard card ── */}
          <div className="relative">
            {/* Glow behind */}
            <div
              className="absolute inset-0 rounded-3xl"
              style={{ background: "rgba(201,168,76,0.06)", filter: "blur(50px)", transform: "scale(0.92)" }}
            />

            {/* Card */}
            <div
              className="relative rounded-2xl overflow-hidden"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(201,168,76,0.18)",
                boxShadow: "0 0 0 1px rgba(255,255,255,0.04), 0 32px 64px rgba(0,0,0,0.5)",
              }}
            >
              {/* Titlebar */}
              <div className="flex items-center justify-between px-5 py-3.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.02)" }}>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    {["#ff5f57","#febc2e","#28c840"].map((c) => (
                      <span key={c} className="w-3 h-3 rounded-full" style={{ background: c, opacity: 0.8 }} />
                    ))}
                  </div>
                  <span className="text-xs ml-2 font-medium" style={{ color: "rgba(255,255,255,0.25)" }}>Aurex — Active Agents</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>3 running</span>
                </div>
              </div>

              {/* Column headers */}
              <div className="grid grid-cols-[auto_1fr_auto_auto] gap-4 px-5 py-2.5 text-xs font-semibold tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.18)", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <span>Agent</span>
                <span>Industry</span>
                <span className="text-right">Handled</span>
                <span className="text-right">Status</span>
              </div>

              {/* Agent rows */}
              <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
                {agents.map((a, i) => (
                  <div
                    key={a.name}
                    className="grid grid-cols-[auto_1fr_auto_auto] gap-4 items-center px-5 py-4 transition-colors"
                    style={{ animationDelay: `${i * 80}ms`, background: i === 0 ? "rgba(201,168,76,0.04)" : "transparent" }}
                  >
                    {/* Icon + name */}
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0"
                        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)" }}
                      >
                        {a.icon}
                      </div>
                      <span className="text-sm font-semibold text-white whitespace-nowrap">{a.name}</span>
                    </div>

                    {/* Industry */}
                    <span className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>{a.industry}</span>

                    {/* Handled */}
                    <span className="text-sm font-bold text-right" style={{ color: "#c9a84c" }}>{a.handled}</span>

                    {/* Status */}
                    <div className="flex items-center justify-end gap-1.5">
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: a.status === "active" ? "#34d399" : "rgba(255,255,255,0.2)" }}
                      />
                      <span className="text-xs capitalize" style={{ color: a.status === "active" ? "rgba(52,211,153,0.8)" : "rgba(255,255,255,0.25)" }}>
                        {a.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer bar */}
              <div className="px-5 py-3.5 flex items-center justify-between" style={{ borderTop: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.015)" }}>
                <span className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>4,646 conversations handled today</span>
                <div
                  className="text-xs font-semibold px-3 py-1 rounded-lg"
                  style={{ background: "rgba(201,168,76,0.12)", color: "#c9a84c", border: "1px solid rgba(201,168,76,0.2)" }}
                >
                  + New Agent
                </div>
              </div>
            </div>

            {/* Floating chip — response time */}
            <div
              className="absolute -top-4 -right-4 flex items-center gap-2 px-3.5 py-2.5 rounded-xl animate-float"
              style={{ background: "rgba(14,14,14,0.96)", border: "1px solid rgba(201,168,76,0.22)", backdropFilter: "blur(12px)" }}
            >
              <span className="text-base">⚡</span>
              <div>
                <p className="text-white text-xs font-bold leading-none mb-0.5">Replies in 0.3s</p>
                <p className="text-xs leading-none" style={{ color: "rgba(255,255,255,0.3)" }}>Always online</p>
              </div>
            </div>

            {/* Floating chip — savings */}
            <div
              className="absolute -bottom-4 -left-4 flex items-center gap-2 px-3.5 py-2.5 rounded-xl animate-float"
              style={{ background: "rgba(14,14,14,0.96)", border: "1px solid rgba(201,168,76,0.22)", backdropFilter: "blur(12px)", animationDelay: "1.8s" }}
            >
              <span className="text-base">💰</span>
              <div>
                <p className="text-white text-xs font-bold leading-none mb-0.5">Save 40 hrs/week</p>
                <p className="text-xs leading-none" style={{ color: "rgba(255,255,255,0.3)" }}>per business</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-28 pointer-events-none"
        style={{ background: "linear-gradient(to top, #ffffff, transparent)" }}
      />
    </section>
  );
}
