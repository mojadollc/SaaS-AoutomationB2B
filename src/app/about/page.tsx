import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "About Aurex – AI Automation Company | Our Mission, Team & Story",
  description: "Learn about Aurex — the AI automation platform built for Southeast Asian businesses. Meet our team, discover our mission, and see how we help 10,000+ businesses automate customer support, bookings, and lead follow-ups.",
  keywords: ["about Aurex", "AI automation company Philippines", "AI startup Southeast Asia", "business automation team", "AI agents company"],
  alternates: { canonical: "https://aurex.io/about" },
  openGraph: { url: "https://aurex.io/about", title: "About Aurex – AI Automation Company", description: "Meet the team behind Aurex, the AI automation platform trusted by 10,000+ businesses in Southeast Asia." },
};

const team = [
  { name: "Marco Reyes", role: "CEO & Co-founder", bio: "Former VP of Engineering at a Fortune 500. Built AI systems for 10+ years.", emoji: "👨‍💼" },
  { name: "Sofia Lim", role: "CTO & Co-founder", bio: "Ex-Google engineer. Led ML infrastructure teams across Southeast Asia.", emoji: "👩‍💻" },
  { name: "James Tan", role: "Head of Product", bio: "Previously at Grab and Shopee. Obsessed with making AI accessible to SMEs.", emoji: "🧑‍🎨" },
  { name: "Ana Cruz", role: "Head of Growth", bio: "Scaled 3 SaaS companies from 0 to $1M ARR. Based in Manila.", emoji: "👩‍🚀" },
];

const values = [
  { title: "Automation for Everyone", desc: "We believe every business — from a sari-sari store to an enterprise — deserves access to AI that works.", icon: "⚡" },
  { title: "Built for Southeast Asia", desc: "We design for local payment methods, local languages, and local business realities first.", icon: "🌏" },
  { title: "Radical Transparency", desc: "No hidden fees, no lock-in, no dark patterns. We grow when our customers grow.", icon: "🔍" },
  { title: "Speed Over Perfection", desc: "We ship fast, learn from real users, and iterate relentlessly.", icon: "🚀" },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="bg-white pt-24">

        {/* Hero */}
        <section className="max-w-4xl mx-auto px-8 py-24 text-center">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-amber-600 mb-6">About Aurex</p>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-gray-900 leading-tight mb-8">
            We automate the work<br />
            <span className="text-amber-500">so you can do the work.</span>
          </h1>
          <p className="text-lg text-gray-500 leading-relaxed max-w-2xl mx-auto">
            Aurex was founded in 2024 with one mission: give every business owner an AI team that never sleeps, never calls in sick, and never misses a lead.
          </p>
        </section>

        {/* Stats */}
        <section className="border-y border-gray-100 bg-gray-50">
          <div className="max-w-5xl mx-auto px-8 py-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "10,000+", label: "Businesses served" },
              { value: "2M+", label: "Conversations handled" },
              { value: "99.9%", label: "Uptime SLA" },
              { value: "2024", label: "Founded" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-4xl font-black text-gray-900 mb-1">{s.value}</p>
                <p className="text-sm text-gray-400">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Story */}
        <section className="max-w-3xl mx-auto px-8 py-24">
          <h2 className="text-3xl font-black text-gray-900 mb-6">Our Story</h2>
          <div className="space-y-5 text-gray-500 leading-relaxed text-base">
            <p>
              It started with a frustration. Our founders watched small business owners in the Philippines spend hours every day answering the same questions on Facebook Messenger, manually booking appointments, and chasing leads that went cold overnight.
            </p>
            <p>
              The tools that existed were either too expensive, too complex, or built for Western markets. So we built Aurex — an AI automation platform designed from the ground up for businesses in Southeast Asia.
            </p>
            <p>
              Today, Aurex powers AI agents for restaurants, clinics, real estate agencies, e-commerce stores, and hundreds of other business types. Our agents handle customer support, bookings, lead follow-ups, and reports — 24/7, across every channel.
            </p>
            <p>
              We're headquartered in Manila, Philippines, with a remote team across Southeast Asia. We're backed by founders who've built and scaled technology companies across the region.
            </p>
          </div>
        </section>

        {/* Values */}
        <section className="bg-gray-950 py-24">
          <div className="max-w-5xl mx-auto px-8">
            <h2 className="text-3xl font-black text-white mb-12">What we believe</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {values.map((v) => (
                <div key={v.title} className="bg-white/5 border border-white/8 rounded-2xl p-8">
                  <span className="text-3xl mb-4 block">{v.icon}</span>
                  <h3 className="text-white font-bold text-lg mb-2">{v.title}</h3>
                  <p className="text-white/40 text-sm leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="max-w-5xl mx-auto px-8 py-24">
          <h2 className="text-3xl font-black text-gray-900 mb-12">The team</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((t) => (
              <div key={t.name} className="border border-gray-100 rounded-2xl p-6">
                <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-2xl mb-4">{t.emoji}</div>
                <p className="font-bold text-gray-900">{t.name}</p>
                <p className="text-xs text-amber-600 font-medium mb-3">{t.role}</p>
                <p className="text-sm text-gray-400 leading-relaxed">{t.bio}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-amber-50 border-t border-amber-100 py-20 text-center">
          <h2 className="text-3xl font-black text-gray-900 mb-4">Ready to automate your business?</h2>
          <p className="text-gray-500 mb-8">Start free. No credit card required.</p>
          <Link href="/register" className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold px-8 py-4 rounded-xl transition-colors">
            Get Started Free
          </Link>
        </section>

      </main>
      <Footer />
    </>
  );
}
