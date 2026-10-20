const steps = [
  {
    number: "01",
    title: "Pick a Template",
    desc: "Choose from 22+ ready-made AI agent templates for your industry — hotel, clinic, restaurant, salon, and more. Or build from scratch.",
    detail: "No coding. No AI expertise needed.",
    color: "from-indigo-500 to-violet-500",
  },
  {
    number: "02",
    title: "Connect Your Channels",
    desc: "Embed a chat widget on your website, connect WhatsApp, Facebook Messenger, Slack, or use our REST API to plug into any system.",
    detail: "Live in under 5 minutes.",
    color: "from-violet-500 to-blue-500",
  },
  {
    number: "03",
    title: "Watch It Work",
    desc: "Your AI agent handles conversations 24/7. Every booking, order, and lead is tracked in your dashboard in real time.",
    detail: "You stay in control. Always.",
    color: "from-blue-500 to-cyan-500",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-gray-950">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-white/10 text-white text-sm font-semibold px-4 py-2 rounded-full mb-4">
            🚀 Get Started in Minutes
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
            Up and Running in{" "}
            <span className="gradient-text">3 Simple Steps</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-xl mx-auto">
            No developers. No complicated setup. Just results.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div key={step.number} className="relative group">
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 h-full card-hover">
                <div className={`text-5xl font-black bg-gradient-to-r ${step.color} bg-clip-text text-transparent mb-6`}>
                  {step.number}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-gray-400 leading-relaxed mb-4">{step.desc}</p>
                <p className="text-sm font-semibold text-indigo-400">{step.detail}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA inside dark section */}
        <div className="mt-16 text-center">
          <a
            href="/register"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold px-8 py-4 rounded-2xl hover:opacity-90 transition-all shadow-2xl shadow-indigo-900 text-base"
          >
            Create Your First Agent Free →
          </a>
          <p className="text-gray-500 text-sm mt-3">No credit card required</p>
        </div>
      </div>
    </section>
  );
}
