import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Footer() {
  return (
    <>
      {/* Final CTA */}
      <section className="py-32 bg-[#0a0a0a] relative overflow-hidden">
        {/* Gold glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[800px] h-[400px] rounded-full" style={{ background: "radial-gradient(ellipse, rgba(201,168,76,0.1) 0%, transparent 70%)", filter: "blur(80px)" }} />
        </div>

        {/* Grid */}
        <div className="absolute inset-0"
          style={{ backgroundImage: "linear-gradient(rgba(201,168,76,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.03) 1px, transparent 1px)", backgroundSize: "80px 80px" }} />

        <div className="relative max-w-5xl mx-auto px-8 text-center">
          <p className="text-xs font-semibold text-[#c9a84c] uppercase tracking-[0.3em] mb-8">Get Started Today</p>

          <h2 className="text-6xl md:text-8xl font-black text-white leading-[0.9] tracking-tighter mb-8">
            Your agents are<br />
            <span className="shimmer-text">ready to work.</span>
          </h2>

          <p className="text-white/30 text-lg max-w-xl mx-auto mb-12 font-light">
            Join 10,000+ businesses that never miss a lead, booking, or order. Start free — no credit card, no setup fees.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
            <Link href="/register"
              className="group inline-flex items-center gap-3 bg-gradient-to-r from-[#c9a84c] to-[#e8c97a] text-[#0a0a0a] font-bold px-8 py-4 rounded-xl hover:opacity-90 transition-all text-base">
              Start for Free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/login"
              className="inline-flex items-center gap-3 border border-white/10 text-white/50 hover:text-white hover:border-white/30 font-semibold px-8 py-4 rounded-xl transition-all text-base">
              Sign In
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-8 text-xs text-white/20">
            <span>✓ Free plan forever</span>
            <span>✓ No credit card required</span>
            <span>✓ Cancel anytime</span>
            <span>✓ Setup in 5 minutes</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#050505] border-t border-white/5 py-16">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid md:grid-cols-5 gap-12 mb-16">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="mb-4">
                <span className="font-bold text-white text-lg">Aurex</span>
                <span className="block text-[10px] text-white/30 tracking-wide mt-0.5">AI Agentsflow</span>
              </div>
              <p className="text-white/25 text-sm leading-relaxed max-w-xs">
                AI agents that automate your business — 24/7, across every channel.
              </p>
              <div className="mt-6 flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-white/20 text-xs">All systems operational</span>
              </div>
            </div>

            {/* Links */}
            {[
              { title: "Product", links: [["Features", "#features"], ["Pricing", "#pricing"], ["Integrations", "#"], ["Templates", "/dashboard/templates"], ["API Docs", "/api-docs"]] },
              { title: "Industries", links: [["Hotels", "#"], ["Restaurants", "#"], ["Clinics", "#"], ["Salons & Spas", "#"], ["Real Estate", "#"]] },
            ].map((col) => (
              <div key={col.title}>
                <p className="text-white/50 font-semibold text-xs uppercase tracking-widest mb-5">{col.title}</p>
                <div className="space-y-3">
                  {col.links.map(([item, href]) => (
                    <p key={item}>
                      <a href={href} className="text-white/25 text-sm hover:text-white/60 transition-colors">{item}</a>
                    </p>
                  ))}
                </div>
              </div>
            ))}

            <div>
              <p className="text-white/50 font-semibold text-xs uppercase tracking-widest mb-5">Company</p>
              <div className="space-y-3">
                {[["About", "/about"], ["Blog", "/blog"], ["Careers", "/careers"], ["Privacy Policy", "/privacy"], ["Terms of Service", "/terms"]].map(([item, href]) => (
                  <p key={item}>
                    <a href={href} className="text-white/25 text-sm hover:text-white/60 transition-colors">{item}</a>
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* Gold divider */}
          <div className="gold-line mb-8" />

          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/15 text-xs">© 2025 Aurex. All rights reserved.</p>
            <div className="flex items-center gap-2 text-white/15 text-xs">
              <span>🇵🇭 Proudly serving Philippine businesses</span>
              <span>·</span>
              <span>GCash · Maya · Cards</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
