const testimonials = [
  {
    name: "Sarah M.",
    role: "Real Estate Agent",
    avatar: "SM",
    color: "from-indigo-400 to-violet-500",
    stars: 5,
    text: "AgentFlow follows up with every lead automatically. I closed 3 extra deals last month without lifting a finger. It's like having a full-time sales assistant.",
  },
  {
    name: "Dr. James K.",
    role: "Clinic Owner",
    avatar: "JK",
    color: "from-blue-400 to-cyan-500",
    stars: 5,
    text: "Appointment bookings are fully automated now. My receptionist focuses on in-person patients. We reduced no-shows by 70% in the first month.",
  },
  {
    name: "Tina R.",
    role: "E-commerce Store Owner",
    avatar: "TR",
    color: "from-pink-400 to-rose-500",
    stars: 5,
    text: "Customer support response time went from hours to seconds. Refund requests dropped 40%. Our customers love the instant replies.",
  },
  {
    name: "Marco L.",
    role: "Restaurant Manager",
    avatar: "ML",
    color: "from-orange-400 to-amber-500",
    stars: 5,
    text: "We take 50+ orders a day through WhatsApp now. The order-taking agent handles everything — I just check the dashboard and prepare the food.",
  },
  {
    name: "Ana P.",
    role: "Salon Owner",
    avatar: "AP",
    color: "from-emerald-400 to-teal-500",
    stars: 5,
    text: "I used to spend 2 hours a day just booking appointments. Now the AI handles it all. My calendar is always full and I didn't have to hire anyone.",
  },
  {
    name: "Ben T.",
    role: "Gym Owner",
    avatar: "BT",
    color: "from-violet-400 to-purple-500",
    stars: 5,
    text: "The lead follow-up agent converted 40% of our free trial inquiries into paid memberships. Best investment I've made for the gym this year.",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-yellow-50 text-yellow-700 text-sm font-semibold px-4 py-2 rounded-full mb-4">
            ⭐ Real Results from Real Businesses
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Businesses Love{" "}
            <span className="gradient-text">AgentFlow</span>
          </h2>
          <p className="text-xl text-gray-500 max-w-xl mx-auto">
            Join thousands of businesses already automating with AI agents.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="card-hover bg-white rounded-2xl p-7 border border-gray-100 shadow-sm">
              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.stars }).map((_, i) => (
                  <span key={i} className="text-yellow-400 text-lg">★</span>
                ))}
              </div>

              <p className="text-gray-700 leading-relaxed mb-6 text-sm">"{t.text}"</p>

              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 bg-gradient-to-br ${t.color} rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                  {t.avatar}
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">{t.name}</p>
                  <p className="text-gray-400 text-xs">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
