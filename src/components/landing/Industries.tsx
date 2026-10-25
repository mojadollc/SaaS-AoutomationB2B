const industries = [
  { emoji: "🏨", name: "Hotels", agents: ["Room reservations", "Concierge requests", "Guest support"] },
  { emoji: "🍽️", name: "Restaurants", agents: ["Table bookings", "Food order taking", "Customer support"] },
  { emoji: "🏥", name: "Clinics", agents: ["Patient appointments", "Prescription refills", "Health FAQs"] },
  { emoji: "💇", name: "Salons & Spas", agents: ["Service bookings", "Stylist selection", "Promotions"] },
  { emoji: "🏠", name: "Real Estate", agents: ["Lead qualification", "Viewing bookings", "Property FAQs"] },
  { emoji: "🛒", name: "E-Commerce", agents: ["Order tracking", "Returns & refunds", "Product questions"] },
];

export default function Industries() {
  return (
    <section id="industries" className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-8">

        {/* Header */}
        <div className="max-w-2xl mb-20">
          <p className="text-xs font-semibold text-[#c9a84c] uppercase tracking-[0.3em] mb-4">Industries</p>
          <h2 className="text-5xl md:text-6xl font-black text-gray-900 leading-[1] tracking-tighter mb-6">
            Your industry.<br />
            <span className="gradient-text">Your agent.</span>
          </h2>
          <p className="text-gray-400 text-base leading-relaxed">
            30+ ready-made templates. Pick yours, customize it, and go live in minutes.
          </p>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {industries.map((ind) => (
            <div key={ind.name}
              className="group relative bg-[#faf8f3] border border-[#e8c97a]/20 rounded-3xl p-8 hover:border-[#c9a84c]/50 hover:shadow-xl hover:shadow-[#c9a84c]/5 transition-all duration-300 cursor-pointer overflow-hidden">

              {/* Background emoji watermark */}
              <div className="absolute -bottom-4 -right-4 text-8xl opacity-5 select-none group-hover:opacity-10 transition-opacity">
                {ind.emoji}
              </div>

              <div className="relative">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-3xl">{ind.emoji}</span>
                  <h3 className="font-bold text-gray-900 text-lg">{ind.name}</h3>
                </div>

                <div className="space-y-2.5 mb-6">
                  {ind.agents.map((agent) => (
                    <div key={agent} className="flex items-center gap-2.5">
                      <div className="w-1 h-1 bg-[#c9a84c] rounded-full shrink-0" />
                      <span className="text-sm text-gray-500">{agent}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2 text-[#c9a84c] text-xs font-semibold group-hover:gap-3 transition-all">
                  <span>Use this template</span>
                  <span>→</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* More industries */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          {["Gyms", "Law Firms", "Schools", "Car Dealerships", "Travel Agencies", "Insurance", "Financial Services", "Property Management"].map((item) => (
            <span key={item} className="text-xs text-gray-400 bg-gray-50 border border-gray-100 px-4 py-2 rounded-full">
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
