"use client";
import { useState, useEffect } from "react";
import { Check, RotateCcw } from "lucide-react";
import { applyTheme, loadTheme, saveTheme, THEME_DEFAULTS, AdminTheme } from "@/components/admin/ThemeProvider";

const NAVBAR_PRESETS = [
  { label: "Dark Black", value: "#111111", style: "dark", text: "white" },
  { label: "Golden Amber", value: "#c9a84c", style: "gold", text: "dark" },
  { label: "Pure White", value: "#ffffff", style: "white", text: "dark" },
  { label: "Deep Navy", value: "#0f172a", style: "dark", text: "white" },
  { label: "Slate Gray", value: "#1e293b", style: "dark", text: "white" },
  { label: "Warm Bronze", value: "#9a7a2e", style: "gold", text: "white" },
];

const PRIMARY_PRESETS = [
  { label: "Golden Amber", value: "#c9a84c" },
  { label: "Light Gold", value: "#e8c97a" },
  { label: "Deep Bronze", value: "#9a7a2e" },
  { label: "Emerald", value: "#10b981" },
  { label: "Sky Blue", value: "#3b82f6" },
  { label: "Violet", value: "#8b5cf6" },
  { label: "Rose", value: "#f43f5e" },
  { label: "Orange", value: "#f97316" },
];

const SIDEBAR_PRESETS = [
  { label: "Near Black", value: "#111111" },
  { label: "Dark Gray", value: "#1a1a1a" },
  { label: "Charcoal", value: "#1e293b" },
  { label: "Dark Gold", value: "#1a1400" },
  { label: "White", value: "#ffffff" },
  { label: "Light Gray", value: "#f8fafc" },
];

export default function AdminSettingsPage() {
  const [theme, setTheme] = useState<Partial<AdminTheme>>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setTheme(loadTheme());
  }, []);

  function update(patch: Partial<AdminTheme>) {
    const next = { ...theme, ...patch };
    setTheme(next);
    applyTheme(next);
  }

  function handleSave() {
    saveTheme(theme);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleReset() {
    setTheme({});
    applyTheme({});
    saveTheme({});
  }

  const current = { ...THEME_DEFAULTS, ...theme };

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Appearance Settings</h1>
        <p className="text-gray-400 text-sm mt-1">Customize the look of your admin panel.</p>
      </div>

      <div className="space-y-8">

        {/* Navbar Color */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-white font-semibold mb-1">Navbar Background</h2>
          <p className="text-gray-500 text-xs mb-5">Choose the top navigation bar color.</p>
          <div className="grid grid-cols-3 gap-3 mb-4">
            {NAVBAR_PRESETS.map((p) => (
              <button
                key={p.value}
                onClick={() => update({ navbarBg: p.value, navbarStyle: p.style as any })}
                className="flex items-center gap-3 px-4 py-3 rounded-xl border transition-all"
                style={{
                  background: p.value,
                  borderColor: current.navbarBg === p.value ? "#c9a84c" : "rgba(255,255,255,0.08)",
                  boxShadow: current.navbarBg === p.value ? "0 0 0 2px #c9a84c" : "none",
                }}
              >
                <span className="text-xs font-medium" style={{ color: p.text === "white" ? "#fff" : "#111" }}>
                  {p.label}
                </span>
                {current.navbarBg === p.value && (
                  <Check className="w-3.5 h-3.5 ml-auto" style={{ color: p.text === "white" ? "#fff" : "#111" }} />
                )}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <label className="text-xs text-gray-400">Custom color</label>
            <input
              type="color"
              value={current.navbarBg}
              onChange={(e) => update({ navbarBg: e.target.value })}
              className="w-10 h-8 rounded cursor-pointer border border-gray-700 bg-transparent"
            />
            <span className="text-xs text-gray-500 font-mono">{current.navbarBg}</span>
          </div>
        </div>

        {/* Primary / Accent Color */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-white font-semibold mb-1">Primary Color</h2>
          <p className="text-gray-500 text-xs mb-5">Used for buttons, active states, highlights, and accents.</p>
          <div className="flex flex-wrap gap-3 mb-4">
            {PRIMARY_PRESETS.map((p) => (
              <button
                key={p.value}
                onClick={() => update({ primaryColor: p.value, accentColor: p.value })}
                title={p.label}
                className="w-10 h-10 rounded-xl border-2 transition-all flex items-center justify-center"
                style={{
                  background: p.value,
                  borderColor: current.primaryColor === p.value ? "#fff" : "transparent",
                  boxShadow: current.primaryColor === p.value ? `0 0 0 3px ${p.value}` : "none",
                }}
              >
                {current.primaryColor === p.value && <Check className="w-4 h-4 text-white drop-shadow" />}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <label className="text-xs text-gray-400">Custom color</label>
            <input
              type="color"
              value={current.primaryColor}
              onChange={(e) => update({ primaryColor: e.target.value, accentColor: e.target.value })}
              className="w-10 h-8 rounded cursor-pointer border border-gray-700 bg-transparent"
            />
            <span className="text-xs text-gray-500 font-mono">{current.primaryColor}</span>
          </div>

          {/* Live preview */}
          <div className="mt-5 flex items-center gap-3">
            <button
              className="px-4 py-2 rounded-lg text-sm font-bold text-white"
              style={{ background: current.primaryColor }}
            >
              Button Preview
            </button>
            <span
              className="text-xs font-semibold px-3 py-1 rounded-full"
              style={{ background: `${current.primaryColor}22`, color: current.primaryColor, border: `1px solid ${current.primaryColor}44` }}
            >
              Badge Preview
            </span>
            <div className="w-4 h-4 rounded-full" style={{ background: current.primaryColor }} />
          </div>
        </div>

        {/* Sidebar Color */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-white font-semibold mb-1">Sidebar Background</h2>
          <p className="text-gray-500 text-xs mb-5">Choose the left sidebar color.</p>
          <div className="grid grid-cols-3 gap-3 mb-4">
            {SIDEBAR_PRESETS.map((p) => (
              <button
                key={p.value}
                onClick={() => update({ sidebarBg: p.value })}
                className="flex items-center gap-3 px-4 py-3 rounded-xl border transition-all"
                style={{
                  background: p.value,
                  borderColor: current.sidebarBg === p.value ? "#c9a84c" : "rgba(255,255,255,0.08)",
                  boxShadow: current.sidebarBg === p.value ? "0 0 0 2px #c9a84c" : "none",
                }}
              >
                <span className="text-xs font-medium" style={{ color: p.value === "#ffffff" || p.value === "#f8fafc" ? "#111" : "#fff" }}>
                  {p.label}
                </span>
                {current.sidebarBg === p.value && (
                  <Check className="w-3.5 h-3.5 ml-auto" style={{ color: p.value === "#ffffff" || p.value === "#f8fafc" ? "#111" : "#fff" }} />
                )}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <label className="text-xs text-gray-400">Custom color</label>
            <input
              type="color"
              value={current.sidebarBg}
              onChange={(e) => update({ sidebarBg: e.target.value })}
              className="w-10 h-8 rounded cursor-pointer border border-gray-700 bg-transparent"
            />
            <span className="text-xs text-gray-500 font-mono">{current.sidebarBg}</span>
          </div>
        </div>

        {/* Live Preview */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-white font-semibold mb-4">Live Preview</h2>
          <div className="rounded-xl overflow-hidden border border-gray-700" style={{ height: "180px" }}>
            {/* Mock navbar */}
            <div className="flex items-center justify-between px-4 py-2.5" style={{ background: current.navbarBg }}>
              <span className="text-sm font-bold" style={{ color: current.navbarBg === "#ffffff" || current.navbarBg === "#f8fafc" ? "#111" : "#fff" }}>
                Aurex Admin
              </span>
              <div className="flex gap-2">
                {[1,2,3].map(i => (
                  <div key={i} className="w-12 h-2 rounded-full opacity-40" style={{ background: current.navbarBg === "#ffffff" ? "#333" : "#fff" }} />
                ))}
              </div>
            </div>
            {/* Mock body */}
            <div className="flex h-full">
              <div className="w-28 px-3 py-3 space-y-1.5" style={{ background: current.sidebarBg }}>
                {["Overview","Users","Orders","Settings"].map((item, i) => (
                  <div
                    key={item}
                    className="text-xs px-2 py-1 rounded-md"
                    style={{
                      background: i === 0 ? `${current.primaryColor}22` : "transparent",
                      color: i === 0 ? current.primaryColor : current.sidebarBg === "#ffffff" || current.sidebarBg === "#f8fafc" ? "#666" : "#888",
                    }}
                  >
                    {item}
                  </div>
                ))}
              </div>
              <div className="flex-1 bg-gray-950 p-3 flex gap-2">
                {[1,2,3].map(i => (
                  <div key={i} className="flex-1 bg-gray-900 rounded-lg p-2">
                    <div className="w-8 h-8 rounded-lg mb-1.5" style={{ background: `${current.primaryColor}33` }} />
                    <div className="h-1.5 bg-gray-700 rounded w-3/4 mb-1" />
                    <div className="h-1.5 bg-gray-800 rounded w-1/2" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all"
            style={{ background: current.primaryColor, color: "#fff" }}
          >
            {saved ? <><Check className="w-4 h-4" /> Saved!</> : "Save Changes"}
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors"
          >
            <RotateCcw className="w-4 h-4" /> Reset to Default
          </button>
        </div>

      </div>
    </div>
  );
}
