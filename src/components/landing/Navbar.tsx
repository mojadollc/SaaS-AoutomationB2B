import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b" style={{ background: "rgba(8,8,8,0.92)", borderColor: "rgba(255,255,255,0.06)" }}>
      <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex flex-col leading-none">
          <span className="font-bold text-lg tracking-tight text-white">Aurex</span>
          <span className="text-[10px] text-white/30 tracking-wide mt-0.5">AI Agentsflow</span>
        </Link>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-10 text-sm text-white/50">
          <a href="#features" className="hover:text-white transition-colors duration-200">Features</a>
          <a href="#how-it-works" className="hover:text-white transition-colors duration-200">How It Works</a>
          <a href="#industries" className="hover:text-white transition-colors duration-200">Industries</a>
          <a href="#pricing" className="hover:text-white transition-colors duration-200">Pricing</a>
          <Link href="/api-docs" className="hover:text-white transition-colors duration-200">API</Link>
        </div>

        {/* CTA */}
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm text-white/50 hover:text-white transition-colors duration-200">
            Sign in
          </Link>
          <Link href="/register" className="text-sm font-semibold bg-gradient-to-r from-[#c9a84c] to-[#e8c97a] text-[#0a0a0a] px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity">
            Get Started Free
          </Link>
        </div>
      </div>
    </nav>
  );
}
