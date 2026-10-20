import Link from "next/link";
import { Bot, Zap, Users, BarChart3, CheckCircle, ArrowRight } from "lucide-react";
import Button from "@/components/ui/Button";

const features = [
  { icon: Bot, title: "Customer Support Agent", desc: "Answers FAQs, handles complaints, escalates complex issues to humans automatically." },
  { icon: Zap, title: "Lead Follow-Up Agent", desc: "Re-engages cold leads, answers objections, and books calls — 24/7 without a sales rep." },
  { icon: Users, title: "Appointment Booking", desc: "Collects details, checks availability, and confirms bookings for clinics, salons, and more." },
  { icon: BarChart3, title: "Report Generator", desc: "Turns raw data into structured business reports with insights and recommendations." },
];

const plans = [
  { name: "Free", price: 0, agents: 1, convos: 50, cta: "Get Started", href: "/register", highlight: false },
  { name: "Starter", price: 29, agents: 3, convos: 500, cta: "Start Free Trial", href: "/register?plan=STARTER", highlight: false },
  { name: "Pro", price: 99, agents: 10, convos: 5000, cta: "Start Free Trial", href: "/register?plan=PRO", highlight: true },
  { name: "Agency", price: 299, agents: -1, convos: -1, cta: "Contact Sales", href: "/register?plan=AGENCY", highlight: false },
];

const testimonials = [
  { name: "Sarah M.", role: "Real Estate Agent", text: "AgentFlow follows up with every lead automatically. I closed 3 extra deals last month." },
  { name: "Dr. James K.", role: "Clinic Owner", text: "Appointment bookings are fully automated now. My receptionist focuses on in-person patients." },
  { name: "Tina R.", role: "E-commerce Store Owner", text: "Customer support response time went from hours to seconds. Refund requests dropped 40%." },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-gray-100 px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-2 font-bold text-xl text-indigo-600">
          <Bot className="w-6 h-6" /> AgentFlow
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-gray-600">
          <a href="#features" className="hover:text-gray-900">Features</a>
          <a href="#pricing" className="hover:text-gray-900">Pricing</a>
          <a href="#testimonials" className="hover:text-gray-900">Testimonials</a>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login"><Button variant="ghost" size="sm">Log in</Button></Link>
          <Link href="/register"><Button size="sm">Get Started</Button></Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 py-24 text-center">
        <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
          <Zap className="w-4 h-4" /> AI agents that work while you sleep
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
          Automate Your Business<br />
          <span className="text-indigo-600">With AI Agents</span>
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10">
          Deploy AI agents that handle customer support, follow up with leads, book appointments,
          and generate reports — so you can focus on growing your business.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link href="/register">
            <Button size="lg" className="gap-2">
              Start for Free <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="#features">
            <Button size="lg" variant="secondary">See How It Works</Button>
          </Link>
        </div>
        <p className="text-sm text-gray-400 mt-4">No credit card required · Free plan available</p>
      </section>

      {/* Features */}
      <section id="features" className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Four Agents, Endless Automation</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Each agent is purpose-built for a specific business workflow, with custom prompts you control.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-indigo-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-16">Trusted by Growing Businesses</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div key={t.name} className="bg-gray-50 rounded-xl p-6 border border-gray-100">
              <p className="text-gray-700 mb-4">"{t.text}"</p>
              <div>
                <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                <p className="text-gray-500 text-xs">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
            <p className="text-gray-500">Start free. Scale as you grow.</p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`bg-white rounded-xl p-6 border-2 ${plan.highlight ? "border-indigo-500 shadow-lg" : "border-gray-200"}`}
              >
                {plan.highlight && (
                  <div className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full inline-block mb-3">Most Popular</div>
                )}
                <h3 className="font-bold text-gray-900 text-lg">{plan.name}</h3>
                <div className="my-3">
                  <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                  <span className="text-gray-500 text-sm">/mo</span>
                </div>
                <ul className="space-y-2 mb-6 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                    {plan.agents === -1 ? "Unlimited agents" : `${plan.agents} AI agent${plan.agents > 1 ? "s" : ""}`}
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                    {plan.convos === -1 ? "Unlimited conversations" : `${plan.convos.toLocaleString()} conversations/mo`}
                  </li>
                </ul>
                <Link href={plan.href}>
                  <Button variant={plan.highlight ? "primary" : "secondary"} className="w-full">
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-10 text-center text-sm text-gray-400">
        <div className="flex items-center justify-center gap-2 font-bold text-gray-700 mb-2">
          <Bot className="w-4 h-4 text-indigo-600" /> AgentFlow
        </div>
        <p>© 2025 AgentFlow. All rights reserved.</p>
      </footer>
    </div>
  );
}
