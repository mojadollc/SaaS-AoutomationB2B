const industries = [
  "🏨 Hotels", "🍽️ Restaurants", "🏥 Clinics", "💇 Salons & Spas",
  "🏠 Real Estate", "🛒 E-Commerce", "💪 Gyms", "⚖️ Law Firms",
  "🎓 Schools", "🚗 Car Dealerships", "✈️ Travel Agencies", "🛡️ Insurance",
  "🏨 Hotels", "🍽️ Restaurants", "🏥 Clinics", "💇 Salons & Spas",
  "🏠 Real Estate", "🛒 E-Commerce", "💪 Gyms", "⚖️ Law Firms",
  "🎓 Schools", "🚗 Car Dealerships", "✈️ Travel Agencies", "🛡️ Insurance",
];

export default function LogoBar() {
  return (
    <section className="py-16 bg-white border-b border-gray-100 overflow-hidden">
      <p className="text-center text-xs font-semibold text-gray-300 uppercase tracking-[0.3em] mb-8">
        Built for every industry
      </p>
      <div className="flex gap-6 animate-marquee whitespace-nowrap">
        {industries.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-2 text-sm text-gray-500 bg-[#faf8f3] border border-[#e8c97a]/40 px-5 py-2.5 rounded-full shrink-0 font-medium">
            {item}
          </span>
        ))}
      </div>
    </section>
  );
}
