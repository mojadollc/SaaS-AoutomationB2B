import Link from "next/link";
import { Bot, ArrowRight } from "lucide-react";

export default function Footer() {
  return (
    <>
      {/* Final CTA */}
      <section className="py-24 bg-gray-950 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[400px] bg-indigo-600/20 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 text-white text-sm font-semibold px-4 py-2 rounded-full mb-6">
            🚀 Ready to Automate?
          </div>
          <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight tracking-tight">
            Your AI Agents Are
            <br />
            <span className="gradient-text">Waiting to Work</span>
          </h2>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Join 10,000+ businesses that never miss a lead, booking, or order. Start free — no credit card, no setup fees.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold px-8 py-4 rounded-2xl hover:opacity-90 transition-all shadow-2xl shadow-indigo-900 text-lg"
            >
              Start for Free <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white font-semibold px-8 py-4 rounded-2xl hover:bg-white/20 transition-all text-lg"
            >
              Log In
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-8 mt-10 text-sm text-gray-500">
            <span>✅ Free plan forever</span>
            <span>✅ No credit card required</span>
            <span>✅ Cancel anytime</span>
            <span>✅ Setup in 5 minutes</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-10 mb-10">
            <div>
              <div className="flex items-center gap-2 font-bold text-lg mb-3">
                <div className="w-7 h-7 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-lg flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <span className="gradient-text">AgentFlow</span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed">
                AI agents that automate your business — 24/7, across every channel.
              </p>
            </div>

            <div>
              <p className="text-white font-semibold text-sm mb-4">Product</p>
              <div className="space-y-2.5">
                {["Features", "Pricing", "Integrations", "Templates", "API Docs"].map((item) => (
                  <p key={item}><a href="#" className="text-gray-500 text-sm hover:text-gray-300 transition-colors">{item}</a></p>
                ))}
              </div>
            </div>

            <div>
              <p className="text-white font-semibold text-sm mb-4">Industries</p>
              <div className="space-y-2.5">
                {["Hotels", "Restaurants", "Clinics", "Salons & Spas", "Real Estate"].map((item) => (
                  <p key={item}><a href="#" className="text-gray-500 text-sm hover:text-gray-300 transition-colors">{item}</a></p>
                ))}
              </div>
            </div>

            <div>
              <p className="text-white font-semibold text-sm mb-4">Company</p>
              <div className="space-y-2.5">
                {["About", "Blog", "Careers", "Privacy Policy", "Terms of Service"].map((item) => (
                  <p key={item}><a href="#" className="text-gray-500 text-sm hover:text-gray-300 transition-colors">{item}</a></p>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-600 text-sm">© 2025 AgentFlow. All rights reserved.</p>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>🇵🇭 Proudly serving Philippine businesses</span>
              <span>·</span>
              <span>Pay via GCash, Maya & more</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
