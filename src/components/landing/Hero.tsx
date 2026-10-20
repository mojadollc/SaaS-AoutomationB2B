import Link from "next/link";
import { ArrowRight, Zap, Star, TrendingUp, Clock } from "lucide-react";

const stats = [
  { value: "10,000+", label: "Businesses Automated", icon: TrendingUp },
  { value: "2M+", label: "Conversations Handled", icon: Zap },
  { value: "24/7", label: "Always Working", icon: Clock },
  { value: "4.9★", label: "Average Rating", icon: Star },
];

const chatMessages = [
  { role: "user", text: "Hi, I'd like to book a table for 4 this Saturday at 7pm" },
  { role: "bot", text: "Great! I have a table available this Saturday at 7:00 PM for 4 guests. May I have your name?" },
  { role: "user", text: "Maria Santos" },
  { role: "bot", text: "Perfect, Maria! Your table is confirmed for Saturday at 7:00 PM 🎉 We'll send a reminder 2 hours before. See you then!" },
];

export default function Hero() {
  return (
    <section className="hero-gradient pt-32 pb-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div>
            <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-semibold px-4 py-2 rounded-full mb-6">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              AI Agents Working Right Now
            </div>

            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-[1.1] mb-6 tracking-tight">
              Your Business,{" "}
              <span className="gradient-text">Automated</span>
              <br />
              While You Sleep
            </h1>

            <p className="text-xl text-gray-500 leading-relaxed mb-8 max-w-lg">
              Deploy AI agents in minutes that handle customer support, book appointments, take orders, and follow up with leads — across WhatsApp, Messenger, your website, and more.
            </p>

            <div className="flex flex-wrap gap-4 mb-10">
              <Link href="/register" className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold px-7 py-4 rounded-2xl hover:opacity-90 transition-all shadow-xl shadow-indigo-200 text-base">
                Start Free — No Card Needed <ArrowRight className="w-5 h-5" />
              </Link>
              <a href="#how-it-works" className="inline-flex items-center gap-2 bg-white border-2 border-gray-200 text-gray-700 font-semibold px-7 py-4 rounded-2xl hover:border-indigo-300 transition-all text-base">
                See How It Works
              </a>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400">
              <span className="flex items-center gap-1.5">✅ Free plan forever</span>
              <span className="flex items-center gap-1.5">✅ Setup in 5 minutes</span>
              <span className="flex items-center gap-1.5">✅ No coding needed</span>
            </div>
          </div>

          {/* Right — Live chat preview */}
          <div className="relative">
            {/* Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-violet-400 rounded-3xl blur-3xl opacity-20 scale-95" />

            <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
              {/* Chat header */}
              <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-4 flex items-center gap-3">
                <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center text-white font-bold text-sm">AF</div>
                <div>
                  <p className="text-white font-semibold text-sm">Restaurant Booking Agent</p>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                    <span className="text-white/70 text-xs">Online · Replies instantly</span>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="p-5 space-y-3 bg-gray-50 min-h-[280px]">
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-indigo-600 text-white rounded-br-sm"
                        : "bg-white border border-gray-200 text-gray-800 rounded-bl-sm shadow-sm"
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {/* Typing indicator */}
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>

              {/* Input bar */}
              <div className="px-5 py-4 bg-white border-t border-gray-100 flex items-center gap-3">
                <div className="flex-1 bg-gray-100 rounded-xl px-4 py-2.5 text-sm text-gray-400">Type a message...</div>
                <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center">
                  <ArrowRight className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>

            {/* Floating badges */}
            <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl border border-gray-100 px-4 py-3 flex items-center gap-2 animate-float">
              <span className="text-2xl">🎉</span>
              <div>
                <p className="text-xs font-bold text-gray-900">Booking Confirmed!</p>
                <p className="text-xs text-gray-400">Just now</p>
              </div>
            </div>

            <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl border border-gray-100 px-4 py-3 flex items-center gap-2 animate-float" style={{ animationDelay: "1.5s" }}>
              <span className="text-2xl">⚡</span>
              <div>
                <p className="text-xs font-bold text-gray-900">Response in 0.3s</p>
                <p className="text-xs text-gray-400">Powered by GPT-4o</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map(({ value, label, icon: Icon }) => (
            <div key={label} className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Icon className="w-4 h-4 text-indigo-500" />
                <p className="text-3xl font-extrabold text-gray-900">{value}</p>
              </div>
              <p className="text-sm text-gray-500">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
