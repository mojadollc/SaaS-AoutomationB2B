const steps = [
  {
    number: "01",
    title: "Pick a Template",
    desc: "Choose from 30+ ready-made AI agent templates for your industry. Or write your own custom prompt from scratch.",
    detail: "No coding. No AI expertise needed.",
  },
  {
    number: "02",
    title: "Connect Your Channels",
    desc: "Embed on your website, connect WhatsApp, Messenger, Slack, or plug into any system via REST API.",
    detail: "Live in under 5 minutes.",
  },
  {
    number: "03",
    title: "Watch It Work",
    desc: "Your AI agent handles conversations 24/7. Every booking, order, and lead tracked in real time.",
    detail: "You stay in control. Always.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-32 bg-[#0a0a0a] relative overflow-hidden">

      {/* Subtle grid */}
      <div className="absolute inset-0"
        style={{ backgroundImage: "linear-gradient(rgba(201,168,76,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.04) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

      {/* Gold glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full pointer-events-none"
        style={{ width: "600px", height: "300px", background: "radial-gradient(ellipse, rgba(201,168,76,0.08) 0%, transparent 70%)", filter: "blur(60px)" }} />

      <div className="relative max-w-7xl mx-auto px-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-24">
          <div>
            <p className="text-xs font-semibold text-[#c9a84c] uppercase tracking-[0.3em] mb-4">How It Works</p>
            <h2 className="text-5xl md:text-6xl font-black text-white leading-[1] tracking-tighter">
              Up and running<br />
              <span className="gradient-text">in 3 steps.</span>
            </h2>
          </div>
          <p className="text-white/30 max-w-xs text-sm leading-relaxed md:text-right">
            No developers. No complicated setup. Just results from day one.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-px bg-white/5 rounded-3xl overflow-hidden">
          {steps.map((step, i) => (
            <div key={step.number} className="bg-[#0a0a0a] p-10 relative group hover:bg-[#111] transition-colors">
              {/* Step number — large background */}
              <div className="text-[120px] font-black text-white/3 leading-none absolute top-4 right-6 select-none">
                {step.number}
              </div>

              <div className="relative">
                <span className="text-xs font-bold text-[#c9a84c] tracking-widest mb-8 block">{step.number}</span>
                <h3 className="text-2xl font-bold text-white mb-4">{step.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed mb-8">{step.desc}</p>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-[#c9a84c] rounded-full" />
                  <span className="text-[#c9a84c] text-xs font-semibold">{step.detail}</span>
                </div>
              </div>

              {/* Connector arrow (not on last) */}
              {i < 2 && (
                <div className="hidden md:block absolute top-1/2 -right-3 -translate-y-1/2 z-10 w-6 h-6 bg-[#c9a84c] rounded-full flex items-center justify-center text-[#0a0a0a] text-xs font-bold">
                  →
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <a href="/register"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-[#c9a84c] to-[#e8c97a] text-[#0a0a0a] font-bold px-8 py-4 rounded-xl hover:opacity-90 transition-opacity text-sm">
            Create Your First Agent Free →
          </a>
          <p className="text-white/20 text-xs mt-3">No credit card required</p>
        </div>
      </div>
    </section>
  );
}
