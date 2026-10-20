const industries = [
  {
    emoji: "🏨",
    name: "Hotels",
    agents: ["Room reservations", "Concierge requests", "Guest support"],
    color: "border-indigo-200 hover:border-indigo-400",
    badge: "bg-indigo-50 text-indigo-700",
  },
  {
    emoji: "🍽️",
    name: "Restaurants",
    agents: ["Table bookings", "Food order taking", "Customer support"],
    color: "border-orange-200 hover:border-orange-400",
    badge: "bg-orange-50 text-orange-700",
  },
  {
    emoji: "🏥",
    name: "Clinics",
    agents: ["Patient appointments", "Prescription refills", "Health FAQs"],
    color: "border-blue-200 hover:border-blue-400",
    badge: "bg-blue-50 text-blue-700",
  },
  {
    emoji: "💇",
    name: "Salons & Spas",
    agents: ["Service bookings", "Stylist selection", "Promotions"],
    color: "border-pink-200 hover:border-pink-400",
    badge: "bg-pink-50 text-pink-700",
  },
  {
    emoji: "🏠",
    name: "Real Estate",
    agents: ["Lead qualification", "Viewing bookings", "Property FAQs"],
    color: "border-emerald-200 hover:border-emerald-400",
    badge: "bg-emerald-50 text-emerald-700",
  },
  {
    emoji: "🛒",
    name: "E-Commerce",
    agents: ["Order tracking", "Returns & refunds", "Product questions"],
    color: "border-violet-200 hover:border-violet-400",
    badge: "bg-violet-50 text-violet-700",
  },
];

export default function Industries() {
  return (
    <section id="industries" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 text-sm font-semibold px-4 py-2 rounded-full mb-4">
            🏢 Built for Every Business
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Your Industry,{" "}
            <span className="gradient-text">Your Agent</span>
          </h2>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            22+ ready-made templates. Pick yours, customize it, and go live in minutes.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {industries.map((ind) => (
            <div key={ind.name} className={`card-hover border-2 ${ind.color} rounded-2xl p-6 transition-colors bg-white`}>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{ind.emoji}</span>
                <h3 className="font-bold text-gray-900 text-lg">{ind.name}</h3>
              </div>
              <div className="space-y-2">
                {ind.agents.map((agent) => (
                  <div key={agent} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full shrink-0" />
                    <span className="text-sm text-gray-600">{agent}</span>
                  </div>
                ))}
              </div>
              <div className={`mt-4 inline-block text-xs font-bold px-3 py-1 rounded-full ${ind.badge}`}>
                Template ready →
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-gray-400 text-sm mt-10">
          Also available: Gyms · Law Firms · Schools · Car Dealerships · Travel Agencies · Insurance · Financial Services · Property Management
        </p>
      </div>
    </section>
  );
}
