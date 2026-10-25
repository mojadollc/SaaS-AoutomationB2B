import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

const openRoles = [
  { title: "Senior Full-Stack Engineer", team: "Engineering", location: "Remote (PH/SEA)", type: "Full-time" },
  { title: "AI/ML Engineer", team: "Engineering", location: "Remote (PH/SEA)", type: "Full-time" },
  { title: "Product Designer", team: "Design", location: "Remote", type: "Full-time" },
  { title: "Growth Marketer", team: "Marketing", location: "Manila, PH", type: "Full-time" },
  { title: "Customer Success Manager", team: "Customer Success", location: "Manila, PH", type: "Full-time" },
  { title: "Sales Development Rep", team: "Sales", location: "Manila, PH", type: "Full-time" },
];

const perks = [
  { icon: "💰", title: "Competitive Pay", desc: "Market-rate salaries benchmarked against top tech companies in SEA." },
  { icon: "🌴", title: "Unlimited PTO", desc: "Take the time you need. We trust you to manage your own schedule." },
  { icon: "🏠", title: "Remote-First", desc: "Work from anywhere in Southeast Asia. We have hubs in Manila and Singapore." },
  { icon: "📈", title: "Equity", desc: "Every full-time employee gets meaningful equity. We win together." },
  { icon: "🎓", title: "Learning Budget", desc: "₱50,000/year for courses, books, conferences, and anything that makes you better." },
  { icon: "🏥", title: "Health Coverage", desc: "Full HMO coverage for you and your dependents from day one." },
];

export default function CareersPage() {
  return (
    <>
      <Navbar />
      <main className="bg-white pt-24">

        {/* Hero */}
        <section className="bg-gray-950 py-28 text-center">
          <div className="max-w-3xl mx-auto px-8">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-amber-500 mb-6">Careers at Aurex</p>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white leading-tight mb-8">
              Build the future of<br />
              <span className="text-amber-400">business automation.</span>
            </h1>
            <p className="text-white/40 text-lg leading-relaxed">
              We're a small, ambitious team building AI tools that help thousands of businesses across Southeast Asia run smarter. Come build with us.
            </p>
          </div>
        </section>

        {/* Perks */}
        <section className="max-w-5xl mx-auto px-8 py-24">
          <h2 className="text-3xl font-black text-gray-900 mb-12">Why Aurex</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {perks.map((p) => (
              <div key={p.title} className="border border-gray-100 rounded-2xl p-6">
                <span className="text-3xl mb-4 block">{p.icon}</span>
                <h3 className="font-bold text-gray-900 mb-2">{p.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Open roles */}
        <section className="bg-gray-50 border-y border-gray-100 py-24">
          <div className="max-w-4xl mx-auto px-8">
            <h2 className="text-3xl font-black text-gray-900 mb-3">Open Roles</h2>
            <p className="text-gray-400 mb-12">{openRoles.length} positions available</p>

            <div className="space-y-3">
              {openRoles.map((role) => (
                <div key={role.title} className="bg-white border border-gray-200 rounded-2xl px-6 py-5 flex items-center justify-between hover:border-amber-300 transition-colors group">
                  <div>
                    <h3 className="font-bold text-gray-900 group-hover:text-amber-600 transition-colors">{role.title}</h3>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-xs bg-amber-50 text-amber-700 px-2.5 py-0.5 rounded-full font-medium">{role.team}</span>
                      <span className="text-xs text-gray-400">{role.location}</span>
                      <span className="text-xs text-gray-400">{role.type}</span>
                    </div>
                  </div>
                  <button className="text-sm font-semibold text-amber-600 hover:text-amber-700 whitespace-nowrap">
                    Apply →
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-12 bg-amber-50 border border-amber-100 rounded-2xl p-8 text-center">
              <h3 className="font-bold text-gray-900 mb-2">Don't see your role?</h3>
              <p className="text-gray-500 text-sm mb-6">We're always looking for exceptional people. Send us your resume and tell us how you'd contribute.</p>
              <a href="mailto:careers@aurex.io" className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors">
                Send Open Application
              </a>
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="max-w-4xl mx-auto px-8 py-24">
          <h2 className="text-3xl font-black text-gray-900 mb-12">Our Hiring Process</h2>
          <div className="space-y-6">
            {[
              { step: "01", title: "Application Review", desc: "We review every application within 5 business days. No ghosting — ever." },
              { step: "02", title: "Intro Call", desc: "A 30-minute call with someone from the team to learn about each other." },
              { step: "03", title: "Skills Assessment", desc: "A short, paid take-home task relevant to the role. Max 3 hours." },
              { step: "04", title: "Team Interview", desc: "Meet 2–3 people you'd work with directly. No trick questions." },
              { step: "05", title: "Offer", desc: "We move fast. Expect an offer within 48 hours of your final interview." },
            ].map((s) => (
              <div key={s.step} className="flex gap-6 items-start">
                <span className="text-4xl font-black text-gray-100 w-16 shrink-0">{s.step}</span>
                <div className="pt-2">
                  <h3 className="font-bold text-gray-900 mb-1">{s.title}</h3>
                  <p className="text-gray-400 text-sm">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
