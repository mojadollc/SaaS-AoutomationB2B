import { Bot, Zap, Calendar, BarChart3, ShoppingCart, Plug } from "lucide-react";

const features = [
  {
    icon: Bot,
    color: "from-indigo-500 to-indigo-600",
    bg: "bg-indigo-50",
    title: "Customer Support Agent",
    desc: "Answers FAQs, handles complaints, and escalates complex issues to humans — automatically, 24/7.",
    stat: "↓ 60% support tickets",
  },
  {
    icon: Zap,
    color: "from-violet-500 to-violet-600",
    bg: "bg-violet-50",
    title: "Lead Follow-Up Agent",
    desc: "Re-engages cold leads, handles objections, and books calls without a sales rep ever lifting a finger.",
    stat: "↑ 3x more conversions",
  },
  {
    icon: Calendar,
    color: "from-blue-500 to-blue-600",
    bg: "bg-blue-50",
    title: "Appointment Booking",
    desc: "Collects details, checks availability, and confirms bookings for clinics, salons, restaurants, and more.",
    stat: "↓ 80% no-shows",
  },
  {
    icon: ShoppingCart,
    color: "from-emerald-500 to-emerald-600",
    bg: "bg-emerald-50",
    title: "Order Taking Agent",
    desc: "Takes food, product, or service orders conversationally via chat — on any channel.",
    stat: "↑ 40% order volume",
  },
  {
    icon: BarChart3,
    color: "from-orange-500 to-orange-600",
    bg: "bg-orange-50",
    title: "Report Generator",
    desc: "Turns raw data into structured business reports with summaries, insights, and recommendations.",
    stat: "Save 5 hrs/week",
  },
  {
    icon: Plug,
    color: "from-pink-500 to-pink-600",
    bg: "bg-pink-50",
    title: "Works Everywhere",
    desc: "Connect to WhatsApp, Messenger, Slack, your website widget, Zapier, and any REST API.",
    stat: "5,000+ integrations",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 text-sm font-semibold px-4 py-2 rounded-full mb-4">
            ⚡ What AgentFlow Does
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
            One Platform,{" "}
            <span className="gradient-text">Every Automation</span>
          </h2>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            Five purpose-built AI agents that handle the repetitive work so your team can focus on what matters.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, color, bg, title, desc, stat }) => (
            <div key={title} className="card-hover bg-white border border-gray-100 rounded-2xl p-7 shadow-sm">
              <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center mb-5`}>
                <div className={`w-7 h-7 bg-gradient-to-br ${color} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">{title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-4">{desc}</p>
              <div className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 text-xs font-bold px-3 py-1.5 rounded-full">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                {stat}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
