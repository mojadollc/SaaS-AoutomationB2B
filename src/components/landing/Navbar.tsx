import Link from "next/link";
import { Bot } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/60">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-xl">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-lg flex items-center justify-center">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <span className="gradient-text">AgentFlow</span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          <a href="#features" className="hover:text-indigo-600 transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-indigo-600 transition-colors">How It Works</a>
          <a href="#industries" className="hover:text-indigo-600 transition-colors">Industries</a>
          <a href="#pricing" className="hover:text-indigo-600 transition-colors">Pricing</a>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors px-3 py-2">
            Log in
          </Link>
          <Link href="/register" className="text-sm font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-indigo-200">
            Start Free →
          </Link>
        </div>
      </div>
    </nav>
  );
}
