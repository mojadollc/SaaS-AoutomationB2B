"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Check } from "lucide-react";

function getStrength(password: string): { score: number; label: string; color: string } {
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (score <= 1) return { score, label: "Weak", color: "#ef4444" };
  if (score <= 3) return { score, label: "Fair", color: "#f97316" };
  if (score === 4) return { score, label: "Good", color: "#eab308" };
  return { score, label: "Strong", color: "#22c55e" };
}

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const strength = getStrength(form.password);
  const passwordMatch = confirm.length > 0 && form.password === confirm;
  const passwordMismatch = confirm.length > 0 && form.password !== confirm;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.password !== confirm) { setError("Passwords do not match."); return; }
    setLoading(true);
    setError("");
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Something went wrong");
      setLoading(false);
    } else {
      router.push("/login?registered=true");
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 aurora-bg relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 30% 50%, rgba(201,168,76,0.15) 0%, transparent 60%)" }} />
        <Link href="/" className="relative font-black text-2xl tracking-tight text-white">Aurex</Link>
        <div className="relative">
          <p className="text-4xl font-black text-white leading-tight tracking-tighter mb-4">
            Start free.<br />
            <span className="shimmer-text">Automate everything.</span>
          </p>
          <p className="text-white/40 text-sm leading-relaxed max-w-sm mb-8">
            Join 10,000+ businesses using Aurex to handle support, bookings, and leads — 24/7, without extra staff.
          </p>
          <div className="space-y-3">
            {["Free plan, no credit card required", "Deploy your first agent in 5 minutes", "Cancel or upgrade anytime"].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ background: "rgba(201,168,76,0.2)" }}>
                  <Check className="w-3 h-3" style={{ color: "#c9a84c" }} />
                </div>
                <span className="text-white/50 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="relative text-white/20 text-xs">© 2025 Aurex. All rights reserved.</p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white overflow-y-auto">
        <div className="w-full max-w-sm">

          {/* Mobile logo */}
          <Link href="/" className="lg:hidden block text-center font-black text-2xl text-amber-600 mb-8">Aurex</Link>

          <h1 className="text-2xl font-black text-gray-900 mb-1">Create your account</h1>
          <p className="text-gray-400 text-sm mb-8">Already have one? <Link href="/login" className="text-amber-600 font-semibold hover:underline">Sign in</Link></p>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-6">
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
                  placeholder="Jane Smith"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  minLength={6}
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
                  placeholder="Min. 6 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {/* Strength bar */}
              {form.password.length > 0 && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className="h-1 flex-1 rounded-full transition-all duration-300"
                        style={{ background: i <= strength.score ? strength.color : "#e5e7eb" }}
                      />
                    ))}
                  </div>
                  <p className="text-xs" style={{ color: strength.color }}>{strength.label} password</p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                  className={`w-full pl-10 pr-10 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
                    passwordMismatch
                      ? "border-red-300 focus:ring-red-300"
                      : passwordMatch
                      ? "border-green-300 focus:ring-green-300"
                      : "border-gray-200 focus:ring-amber-400"
                  }`}
                  placeholder="Re-enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                {passwordMatch && (
                  <Check className="absolute right-9 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
                )}
              </div>
              {passwordMismatch && <p className="text-xs text-red-500 mt-1">Passwords do not match</p>}
              {passwordMatch && <p className="text-xs text-green-500 mt-1">Passwords match ✓</p>}
            </div>

            <button
              type="submit"
              disabled={loading || passwordMismatch}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all hover:opacity-90 disabled:opacity-60 mt-2"
              style={{ background: "linear-gradient(135deg, #c9a84c, #e8c97a)", color: "#0a0a0a" }}
            >
              {loading ? "Creating account..." : <><span>Create Account</span><ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-6">
            By signing up, you agree to our{" "}
            <Link href="/terms" className="text-amber-600 hover:underline">Terms</Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-amber-600 hover:underline">Privacy Policy</Link>.
          </p>

        </div>
      </div>
    </div>
  );
}
