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
    <section className="py-12 bg-gray-50 border-y border-gray-100 overflow-hidden">
      <p className="text-center text-sm font-semibold text-gray-400 uppercase tracking-widest mb-8">
        Trusted by businesses across every industry
      </p>
      <div className="flex gap-8 animate-marquee whitespace-nowrap">
        {industries.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 bg-white border border-gray-200 px-5 py-2.5 rounded-full shadow-sm shrink-0"
          >
            {item}
          </span>
        ))}
      </div>
    </section>
  );
}
