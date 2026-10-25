import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "Aurex Blog – AI Automation Guides, Case Studies & Business Tips",
  description: "Explore AI automation guides, real business case studies, and practical tips for automating customer support, bookings, and lead follow-ups. Learn how businesses in the Philippines use Aurex to grow faster.",
  keywords: ["AI automation blog", "business automation tips", "AI chatbot guide", "customer support automation guide", "AI for small business Philippines", "automation case studies"],
  alternates: { canonical: "https://aurex.payroo.xyz/blog" },
  openGraph: { url: "https://aurex.payroo.xyz/blog", title: "Aurex Blog – AI Automation Guides & Case Studies", description: "Practical AI automation guides and case studies for business owners in Southeast Asia." },
};

const posts = [
  {
    slug: "#",
    category: "Product",
    title: "How AI Agents Are Replacing Customer Support Teams in 2025",
    excerpt: "We analyzed 500,000 conversations across our platform. Here's what we learned about AI vs. human support — and when each wins.",
    date: "Jan 15, 2025",
    readTime: "6 min read",
    featured: true,
  },
  {
    slug: "#",
    category: "Guide",
    title: "The Complete Guide to Automating Your Restaurant with AI",
    excerpt: "From table bookings to order follow-ups — a step-by-step playbook for restaurant owners in the Philippines.",
    date: "Jan 10, 2025",
    readTime: "8 min read",
    featured: false,
  },
  {
    slug: "#",
    category: "Case Study",
    title: "How a Manila Clinic Reduced No-Shows by 60% with Aurex",
    excerpt: "Dr. Santos' clinic was losing ₱80,000/month to no-shows. Here's how automated appointment reminders changed everything.",
    date: "Jan 5, 2025",
    readTime: "4 min read",
    featured: false,
  },
  {
    slug: "#",
    category: "Product",
    title: "Introducing Templates: Deploy an AI Agent in 60 Seconds",
    excerpt: "We built 30+ ready-made agent templates for every industry. Pick one, customize it, and go live instantly.",
    date: "Dec 28, 2024",
    readTime: "3 min read",
    featured: false,
  },
  {
    slug: "#",
    category: "Guide",
    title: "GCash, Maya, and Stripe: Accepting Payments in the Philippines",
    excerpt: "A practical guide to setting up local and international payment methods for your SaaS or e-commerce business.",
    date: "Dec 20, 2024",
    readTime: "5 min read",
    featured: false,
  },
  {
    slug: "#",
    category: "Case Study",
    title: "From 0 to 500 Leads/Month: A Real Estate Agency's AI Story",
    excerpt: "How Prestige Properties automated their lead follow-up and tripled their conversion rate in 90 days.",
    date: "Dec 15, 2024",
    readTime: "5 min read",
    featured: false,
  },
];

const categories = ["All", "Product", "Guide", "Case Study", "News"];

export default function BlogPage() {
  const featured = posts[0];
  const rest = posts.slice(1);

  return (
    <>
      <Navbar />
      <main className="bg-white pt-24">

        {/* Header */}
        <section className="max-w-5xl mx-auto px-8 py-16">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-amber-600 mb-4">Aurex Blog</p>
          <h1 className="text-5xl font-black tracking-tighter text-gray-900 mb-4">Insights, guides & stories</h1>
          <p className="text-gray-400 text-lg">Practical advice for business owners automating with AI.</p>
        </section>

        {/* Category filter */}
        <div className="border-y border-gray-100">
          <div className="max-w-5xl mx-auto px-8 py-4 flex items-center gap-2 overflow-x-auto">
            {categories.map((c, i) => (
              <button
                key={c}
                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${i === 0 ? "bg-gray-900 text-white" : "text-gray-500 hover:text-gray-900"}`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-8 py-16">

          {/* Featured post */}
          <Link href={featured.slug} className="group block mb-16 rounded-3xl border border-gray-100 overflow-hidden hover:border-amber-200 transition-colors">
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 h-64 flex items-center justify-center">
              <span className="text-7xl">📖</span>
            </div>
            <div className="p-8">
              <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">{featured.category}</span>
              <h2 className="text-2xl font-black text-gray-900 mt-2 mb-3 group-hover:text-amber-600 transition-colors">{featured.title}</h2>
              <p className="text-gray-400 leading-relaxed mb-4">{featured.excerpt}</p>
              <div className="flex items-center gap-3 text-xs text-gray-300">
                <span>{featured.date}</span>
                <span>·</span>
                <span>{featured.readTime}</span>
              </div>
            </div>
          </Link>

          {/* Post grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map((post) => (
              <Link key={post.title} href={post.slug} className="group block border border-gray-100 rounded-2xl overflow-hidden hover:border-amber-200 transition-colors">
                <div className="bg-gray-50 h-40 flex items-center justify-center">
                  <span className="text-4xl">
                    {post.category === "Guide" ? "📘" : post.category === "Case Study" ? "📊" : "🚀"}
                  </span>
                </div>
                <div className="p-5">
                  <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">{post.category}</span>
                  <h3 className="font-bold text-gray-900 mt-1.5 mb-2 text-sm leading-snug group-hover:text-amber-600 transition-colors">{post.title}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed mb-4 line-clamp-2">{post.excerpt}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-300">
                    <span>{post.date}</span>
                    <span>·</span>
                    <span>{post.readTime}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Newsletter */}
        <section className="bg-gray-950 py-20">
          <div className="max-w-xl mx-auto px-8 text-center">
            <h2 className="text-2xl font-black text-white mb-3">Get new posts in your inbox</h2>
            <p className="text-white/40 text-sm mb-8">No spam. Unsubscribe anytime.</p>
            <div className="flex gap-3">
              <input
                type="email"
                placeholder="you@example.com"
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-amber-500"
              />
              <button className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
