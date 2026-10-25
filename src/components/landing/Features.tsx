const features = [
  {
    number: "01",
    title: "Customer Support",
    desc: "Answers FAQs, resolves complaints, and escalates complex cases to humans — automatically, 24/7.",
    stat: "↓ 60% support tickets",
    size: "lg",
  },
  {
    number: "02",
    title: "Lead Follow-Up",
    desc: "Re-engages cold leads, handles objections, and books calls without a sales rep.",
    stat: "↑ 3× conversions",
    size: "sm",
  },
  {
    number: "03",
    title: "Appointment Booking",
    desc: "Collects details, checks availability, and confirms bookings for any service business.",
    stat: "↓ 80% no-shows",
    size: "sm",
  },
  {
    number: "04",
    title: "Order Taking",
    desc: "Takes food, product, or service orders conversationally via chat on any channel.",
    stat: "↑ 40% order volume",
    size: "sm",
  },
  {
    number: "05",
    title: "Report Generator",
    desc: "Turns raw data into structured business reports with insights and recommendations.",
    stat: "Save 5 hrs/week",
    size: "sm",
  },
  {
    number: "06",
    title: "Works Everywhere",
    desc: "WhatsApp, Messenger, Slack, website widget, Zapier, and any REST API.",
    stat: "5,000+ integrations",
    size: "lg",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-20">
          <div>
            <p className="text-xs font-semibold text-[#c9a84c] uppercase tracking-[0.3em] mb-4">What We Do</p>
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 leading-[1] tracking-tighter">
              One platform.<br />
              <span className="gradient-text">Every automation.</span>
            </h2>
          </div>
          <p className="text-gray-400 max-w-xs text-sm leading-relaxed md:text-right">
            Five purpose-built AI agents that handle the repetitive work so your team can focus on growth.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <div
              key={f.number}
              className={`group relative bg-[#faf8f3] border border-[#e8c97a]/20 rounded-3xl p-8 hover:border-[#c9a84c]/50 hover:bg-[#fdf6e3] transition-all duration-300 ${
                i === 0 || i === 5 ? "md:col-span-2" : ""
              }`}
            >
              {/* Number */}
              <span className="text-xs font-bold text-[#c9a84c]/50 tracking-widest mb-6 block">{f.number}</span>

              <h3 className="text-xl font-bold text-gray-900 mb-3">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">{f.desc}</p>

              {/* Stat pill */}
              <div className="inline-flex items-center gap-2 bg-white border border-[#e8c97a]/40 px-3 py-1.5 rounded-full">
                <span className="w-1.5 h-1.5 bg-[#c9a84c] rounded-full" />
                <span className="text-xs font-semibold text-gray-700">{f.stat}</span>
              </div>

              {/* Hover arrow */}
              <div className="absolute top-8 right-8 w-8 h-8 rounded-full border border-[#c9a84c]/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-[#c9a84c] text-xs">→</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
