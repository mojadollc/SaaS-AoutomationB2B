const testimonials = [
  {
    name: "Sarah M.",
    role: "Real Estate Agent",
    initials: "SM",
    text: "Aurex follows up with every lead automatically. I closed 3 extra deals last month without lifting a finger.",
    metric: "+3 deals/month",
  },
  {
    name: "Dr. James K.",
    role: "Clinic Owner",
    initials: "JK",
    text: "Appointment bookings are fully automated. My receptionist focuses on in-person patients. No-shows dropped 70%.",
    metric: "↓ 70% no-shows",
  },
  {
    name: "Tina R.",
    role: "E-commerce Owner",
    initials: "TR",
    text: "Response time went from hours to seconds. Refund requests dropped 40%. Customers love the instant replies.",
    metric: "↓ 40% refunds",
  },
  {
    name: "Marco L.",
    role: "Restaurant Manager",
    initials: "ML",
    text: "We take 50+ orders a day through WhatsApp now. The agent handles everything — I just check the dashboard.",
    metric: "50+ orders/day",
  },
  {
    name: "Ana P.",
    role: "Salon Owner",
    initials: "AP",
    text: "I used to spend 2 hours a day booking appointments. Now the AI handles it all. My calendar is always full.",
    metric: "2 hrs saved/day",
  },
  {
    name: "Ben T.",
    role: "Gym Owner",
    initials: "BT",
    text: "The lead follow-up agent converted 40% of free trial inquiries into paid memberships. Best investment this year.",
    metric: "40% conversion",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-32 bg-[#0a0a0a] relative overflow-hidden">

      {/* Gold glow top right */}
      <div className="absolute top-0 right-0 rounded-full pointer-events-none"
        style={{ width: "500px", height: "400px", background: "radial-gradient(ellipse, rgba(201,168,76,0.07) 0%, transparent 70%)", filter: "blur(80px)" }} />

      <div className="relative max-w-7xl mx-auto px-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-20">
          <div>
            <p className="text-xs font-semibold text-[#c9a84c] uppercase tracking-[0.3em] mb-4">Testimonials</p>
            <h2 className="text-5xl md:text-6xl font-black text-white leading-[1] tracking-tighter">
              Real businesses.<br />
              <span className="gradient-text">Real results.</span>
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {[1,2,3,4,5].map((s) => (
              <span key={s} className="text-[#c9a84c] text-xl">★</span>
            ))}
            <span className="text-white/30 text-sm ml-2">4.9 average</span>
          </div>
        </div>

        {/* Testimonial grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {testimonials.map((t) => (
            <div key={t.name}
              className="glass-dark rounded-3xl p-8 hover:border-[#c9a84c]/30 transition-all duration-300 group">

              {/* Quote mark */}
              <div className="text-5xl text-[#c9a84c]/20 font-serif leading-none mb-4">"</div>

              <p className="text-white/60 text-sm leading-relaxed mb-8">{t.text}</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#c9a84c] to-[#9a7a2e] flex items-center justify-center text-white text-xs font-bold">
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">{t.name}</p>
                    <p className="text-white/30 text-xs">{t.role}</p>
                  </div>
                </div>
                <div className="bg-[#c9a84c]/10 border border-[#c9a84c]/20 px-3 py-1.5 rounded-full">
                  <span className="text-[#c9a84c] text-xs font-bold">{t.metric}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
