"use client";
import { useState, useEffect } from "react";
import { Check, RotateCcw, Eye, EyeOff, Save, RefreshCw, Power, Webhook, Plus, ToggleLeft, ToggleRight, Copy, ExternalLink } from "lucide-react";
import { applyTheme, loadTheme, saveTheme, THEME_DEFAULTS, AdminTheme } from "@/components/admin/ThemeProvider";

// ─── Appearance data ───────────────────────────────────────────────────────────
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

// ─── API key groups ────────────────────────────────────────────────────────────
const API_GROUPS = [
  {
    label: "System",
    color: "#ef4444",
    warning: "Changing these requires a server restart to take effect.",
    keys: [
      { key: "NEXTAUTH_URL", label: "App URL (NEXTAUTH_URL)", secret: false },
      { key: "NEXT_PUBLIC_APP_URL", label: "Public App URL", secret: false },
      { key: "NEXTAUTH_SECRET", label: "NextAuth Secret", secret: true },
      { key: "DATABASE_URL", label: "Database URL", secret: true },
    ],
  },
  {
    label: "OpenAI",
    color: "#10a37f",
    keys: [{ key: "OPENAI_API_KEY", label: "API Key", secret: true }],
  },
  {
    label: "Stripe",
    color: "#635bff",
    keys: [
      { key: "STRIPE_SECRET_KEY", label: "Secret Key", secret: true },
      { key: "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY", label: "Publishable Key", secret: false },
      { key: "STRIPE_WEBHOOK_SECRET", label: "Webhook Secret", secret: true },
      { key: "STRIPE_STARTER_PRICE_ID", label: "Starter Price ID", secret: false },
      { key: "STRIPE_PRO_PRICE_ID", label: "Pro Price ID", secret: false },
      { key: "STRIPE_AGENCY_PRICE_ID", label: "Agency Price ID", secret: false },
    ],
  },
  {
    label: "PayMongo",
    color: "#0070f3",
    keys: [
      { key: "PAYMONGO_SECRET_KEY", label: "Secret Key", secret: true },
      { key: "PAYMONGO_PUBLIC_KEY", label: "Public Key", secret: false },
      { key: "PAYMONGO_WEBHOOK_SECRET", label: "Webhook Secret", secret: true },
    ],
  },
  {
    label: "Xendit",
    color: "#003d79",
    keys: [
      { key: "XENDIT_SECRET_KEY", label: "Secret Key", secret: true },
      { key: "XENDIT_WEBHOOK_TOKEN", label: "Webhook Token", secret: true },
    ],
  },
  {
    label: "Slack",
    color: "#4a154b",
    keys: [{ key: "SLACK_SIGNING_SECRET", label: "Signing Secret", secret: true }],
  },
  {
    label: "WhatsApp / Twilio",
    color: "#25d366",
    keys: [
      { key: "TWILIO_AUTH_TOKEN", label: "Auth Token", secret: true },
      { key: "WHATSAPP_DEFAULT_AGENT_ID", label: "Default Agent ID", secret: false },
    ],
  },
  {
    label: "Facebook Messenger",
    color: "#0084ff",
    keys: [
      { key: "MESSENGER_VERIFY_TOKEN", label: "Verify Token", secret: true },
      { key: "MESSENGER_PAGE_ACCESS_TOKEN", label: "Page Access Token", secret: true },
      { key: "MESSENGER_DEFAULT_AGENT_ID", label: "Default Agent ID", secret: false },
    ],
  },
  {
    label: "Google OAuth",
    color: "#ea4335",
    keys: [
      { key: "GOOGLE_CLIENT_ID", label: "Client ID", secret: false },
      { key: "GOOGLE_CLIENT_SECRET", label: "Client Secret Key", secret: true },
    ],
  },
  {
    label: "Email (Resend)",
    color: "#c9a84c",
    keys: [
      { key: "RESEND_API_KEY", label: "API Key", secret: true },
      { key: "FROM_EMAIL", label: "From Email", secret: false },
    ],
  },
];

// ─── Component ─────────────────────────────────────────────────────────────────
function ApiKeyInput({ value, onChange, isSecret, isRevealed, onToggle }: {
  value: string;
  onChange: (v: string) => void;
  isSecret: boolean;
  isRevealed: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <input
        type={isSecret && !isRevealed ? "password" : "text"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete="off"
        data-form-type="other"
        className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-500 font-mono"
      />
      {isSecret && (
        <button onClick={onToggle} className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-gray-800 transition-colors">
          {isRevealed ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      )}
    </div>
  );
}

export default function AdminSettingsPage() {
  const [tab, setTab] = useState<"appearance" | "api">("appearance");

  // Appearance state
  const [theme, setTheme] = useState<Partial<AdminTheme>>({});
  const [saved, setSaved] = useState(false);

  // API keys state
  const [configMap, setConfigMap] = useState<Record<string, string>>({});
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [apiSaving, setApiSaving] = useState(false);
  const [apiSaved, setApiSaved] = useState(false);
  const [apiLoading, setApiLoading] = useState(false);
  const [restarting, setRestarting] = useState(false);
  const [restartMsg, setRestartMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [gateways, setGateways] = useState({ stripe: true, paymongo: true, xendit: true });
  const [gatewaySaving, setGatewaySaving] = useState(false);

  // PayMongo webhook manager state
  const [pmWebhooks, setPmWebhooks] = useState<any[]>([]);
  const [pmWebhookUrl, setPmWebhookUrl] = useState("");
  const [pmWebhookLoading, setPmWebhookLoading] = useState(false);
  const [pmWebhookCreating, setPmWebhookCreating] = useState(false);
  const [pmWebhookMsg, setPmWebhookMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [pmSecretSaved, setPmSecretSaved] = useState(false);
  const [pmCopied, setPmCopied] = useState(false);

  const PM_EVENTS = [
    "payment.paid",
    "payment.failed",
    "link.payment.paid",
    "checkout_session.payment.paid",
    "checkout_session.payment.failed",
  ];

  async function loadPmWebhooks() {
    setPmWebhookLoading(true);
    try {
      const res = await fetch("/api/admin/paymongo/webhook");
      if (res.ok) {
        const data = await res.json();
        setPmWebhooks(data.webhooks ?? []);
        setPmSecretSaved(data.savedSecret ?? false);
      }
    } catch { /* ignore */ }
    setPmWebhookLoading(false);
  }

  async function createPmWebhook() {
    if (!pmWebhookUrl) return;
    setPmWebhookCreating(true);
    setPmWebhookMsg(null);
    try {
      const res = await fetch("/api/admin/paymongo/webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: pmWebhookUrl, events: PM_EVENTS }),
      });
      const data = await res.json();
      if (res.ok) {
        setPmWebhookMsg({ ok: true, text: `Webhook created! Secret key auto-saved to database. ✓` });
        setPmWebhookUrl("");
        setPmSecretSaved(true);
        loadPmWebhooks();
        loadApiKeys(); // refresh to show saved secret
      } else {
        setPmWebhookMsg({ ok: false, text: data.error ?? "Failed to create webhook" });
      }
    } catch (e: any) {
      setPmWebhookMsg({ ok: false, text: e.message });
    }
    setPmWebhookCreating(false);
  }

  async function togglePmWebhook(id: string, status: string) {
    const action = status === "enabled" ? "disable" : "enable";
    setPmWebhookMsg(null);
    const res = await fetch(`/api/admin/paymongo/webhook/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    const data = await res.json();
    if (!res.ok) {
      setPmWebhookMsg({ ok: false, text: data.error ?? `Failed to ${action} webhook` });
    } else {
      setPmWebhooks((prev) =>
        prev.map((wh) => (wh.id === id ? { ...wh, status: data.status } : wh))
      );
    }
  }

  function copyWebhookUrl(url: string) {
    navigator.clipboard.writeText(url);
    setPmCopied(true);
    setTimeout(() => setPmCopied(false), 2000);
  }

  useEffect(() => { setTheme(loadTheme()); }, []);

  useEffect(() => {
    if (tab === "api") { loadApiKeys(); loadGateways(); loadPmWebhooks(); }
  }, [tab]);

  async function loadGateways() {
    const res = await fetch("/api/payments");
    if (res.ok) setGateways(await res.json());
  }

  async function saveGateways(updated: typeof gateways) {
    setGatewaySaving(true);
    await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        PAYMENT_STRIPE_ENABLED: String(updated.stripe),
        PAYMENT_PAYMONGO_ENABLED: String(updated.paymongo),
        PAYMENT_XENDIT_ENABLED: String(updated.xendit),
      }),
    });
    // Re-read from DB to confirm persisted state
    const res = await fetch("/api/payments");
    if (res.ok) setGateways(await res.json());
    setGatewaySaving(false);
  }

  function toggleGateway(key: keyof typeof gateways) {
    const updated = { ...gateways, [key]: !gateways[key] };
    saveGateways(updated);
  }

  async function loadApiKeys() {
    setApiLoading(true);
    const [settingsRes, envRes] = await Promise.all([
      fetch("/api/admin/settings"),
      fetch("/api/admin/settings/env"),
    ]);
    const dbVals: Record<string, string> = settingsRes.ok ? await settingsRes.json() : {};
    const envVals: Record<string, string> = envRes.ok ? await envRes.json() : {};
    // DB wins — env only fills keys that have no DB value at all
    const merged: Record<string, string> = { ...envVals };
    for (const [k, v] of Object.entries(dbVals)) {
      if (v && v.trim() !== "") merged[k] = v;
    }
    setConfigMap(merged);
    const appUrl = merged["NEXTAUTH_URL"] || merged["NEXT_PUBLIC_APP_URL"] || "";
    if (appUrl) setPmWebhookUrl(`${appUrl.replace(/\/$/, "")}/api/paymongo/webhook`);
    setApiLoading(false);
  }

  async function autoFillFromEnv() {
    const res = await fetch("/api/admin/settings/env");
    if (res.ok) {
      const envVals = await res.json();
      setConfigMap((prev) => {
        const merged = { ...prev };
        for (const [k, v] of Object.entries(envVals as Record<string, string>)) {
          if (v && (!merged[k] || merged[k] === "")) merged[k] = v;
        }
        return merged;
      });
    }
  }

  function updateTheme(patch: Partial<AdminTheme>) {
    const next = { ...theme, ...patch };
    setTheme(next);
    applyTheme(next);
  }

  function handleSaveTheme() {
    saveTheme(theme);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleResetTheme() {
    setTheme({});
    applyTheme({});
    saveTheme({});
  }

  async function handleSaveApi() {
    setApiSaving(true);
    await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(configMap),
    });
    setApiSaving(false);
    setApiSaved(true);
    setTimeout(() => setApiSaved(false), 2000);
  }

  async function handleRestart() {
    if (!confirm("Restart the server now? The app will be unavailable for a few seconds.")) return;
    setRestarting(true);
    setRestartMsg(null);
    try {
      const res = await fetch("/api/admin/restart", { method: "POST" });
      const data = await res.json();
      setRestartMsg({ ok: data.ok, text: data.ok ? "Server restarted successfully." : (data.error ?? "Restart failed.") });
    } catch {
      setRestartMsg({ ok: false, text: "Could not reach the server." });
    }
    setRestarting(false);
    setTimeout(() => setRestartMsg(null), 5000);
  }

  const current = { ...THEME_DEFAULTS, ...theme };

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-gray-400 text-sm mt-1">Manage appearance and API integrations.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-8 bg-gray-900 border border-gray-800 rounded-xl p-1 w-fit">
        {(["appearance", "api"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="px-5 py-2 rounded-lg text-sm font-semibold transition-all"
            style={{
              background: tab === t ? current.primaryColor : "transparent",
              color: tab === t ? "#fff" : "#6b7280",
            }}
          >
            {t === "appearance" ? "Appearance" : "API Keys"}
          </button>
        ))}
      </div>

      {/* ── Appearance Tab ── */}
      {tab === "appearance" && (
        <div className="space-y-8">
          {/* Navbar Color */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h2 className="text-white font-semibold mb-1">Navbar Background</h2>
            <p className="text-gray-500 text-xs mb-5">Choose the top navigation bar color.</p>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {NAVBAR_PRESETS.map((p) => (
                <button
                  key={p.value}
                  onClick={() => updateTheme({ navbarBg: p.value, navbarStyle: p.style as any })}
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
              <input type="color" value={current.navbarBg} onChange={(e) => updateTheme({ navbarBg: e.target.value })}
                className="w-10 h-8 rounded cursor-pointer border border-gray-700 bg-transparent" />
              <span className="text-xs text-gray-500 font-mono">{current.navbarBg}</span>
            </div>
          </div>

          {/* Primary Color */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h2 className="text-white font-semibold mb-1">Primary Color</h2>
            <p className="text-gray-500 text-xs mb-5">Used for buttons, active states, highlights, and accents.</p>
            <div className="flex flex-wrap gap-3 mb-4">
              {PRIMARY_PRESETS.map((p) => (
                <button key={p.value} onClick={() => updateTheme({ primaryColor: p.value, accentColor: p.value })}
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
              <input type="color" value={current.primaryColor}
                onChange={(e) => updateTheme({ primaryColor: e.target.value, accentColor: e.target.value })}
                className="w-10 h-8 rounded cursor-pointer border border-gray-700 bg-transparent" />
              <span className="text-xs text-gray-500 font-mono">{current.primaryColor}</span>
            </div>
            <div className="mt-5 flex items-center gap-3">
              <button className="px-4 py-2 rounded-lg text-sm font-bold text-white" style={{ background: current.primaryColor }}>
                Button Preview
              </button>
              <span className="text-xs font-semibold px-3 py-1 rounded-full"
                style={{ background: `${current.primaryColor}22`, color: current.primaryColor, border: `1px solid ${current.primaryColor}44` }}>
                Badge Preview
              </span>
            </div>
          </div>

          {/* Sidebar Color */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h2 className="text-white font-semibold mb-1">Sidebar Background</h2>
            <p className="text-gray-500 text-xs mb-5">Choose the left sidebar color.</p>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {SIDEBAR_PRESETS.map((p) => (
                <button key={p.value} onClick={() => updateTheme({ sidebarBg: p.value })}
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
              <input type="color" value={current.sidebarBg} onChange={(e) => updateTheme({ sidebarBg: e.target.value })}
                className="w-10 h-8 rounded cursor-pointer border border-gray-700 bg-transparent" />
              <span className="text-xs text-gray-500 font-mono">{current.sidebarBg}</span>
            </div>
          </div>

          {/* Live Preview */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h2 className="text-white font-semibold mb-4">Live Preview</h2>
            <div className="rounded-xl overflow-hidden border border-gray-700" style={{ height: "180px" }}>
              <div className="flex items-center justify-between px-4 py-2.5" style={{ background: current.navbarBg }}>
                <span className="text-sm font-bold" style={{ color: current.navbarBg === "#ffffff" || current.navbarBg === "#f8fafc" ? "#111" : "#fff" }}>
                  Aurex Admin
                </span>
                <div className="flex gap-2">
                  {[1,2,3].map(i => <div key={i} className="w-12 h-2 rounded-full opacity-40" style={{ background: current.navbarBg === "#ffffff" ? "#333" : "#fff" }} />)}
                </div>
              </div>
              <div className="flex h-full">
                <div className="w-28 px-3 py-3 space-y-1.5" style={{ background: current.sidebarBg }}>
                  {["Overview","Users","Orders","Settings"].map((item, i) => (
                    <div key={item} className="text-xs px-2 py-1 rounded-md"
                      style={{
                        background: i === 0 ? `${current.primaryColor}22` : "transparent",
                        color: i === 0 ? current.primaryColor : current.sidebarBg === "#ffffff" || current.sidebarBg === "#f8fafc" ? "#666" : "#888",
                      }}>
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

          <div className="flex items-center gap-3">
            <button onClick={handleSaveTheme}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all"
              style={{ background: current.primaryColor, color: "#fff" }}>
              {saved ? <><Check className="w-4 h-4" /> Saved!</> : "Save Changes"}
            </button>
            <button onClick={handleResetTheme}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors">
              <RotateCcw className="w-4 h-4" /> Reset to Default
            </button>
          </div>
        </div>
      )}

      {/* ── API Keys Tab ── */}
      {tab === "api" && (
        <div className="space-y-6">
          {/* Payment Gateway Toggles */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
              <h2 className="text-white font-semibold">Payment Gateways</h2>
              {gatewaySaving && <span className="text-xs text-gray-500 ml-auto">Saving...</span>}
            </div>
            <p className="text-gray-500 text-xs mb-5">Enable or disable payment methods shown to users on the billing page.</p>
            <div className="space-y-3">
              {([
                { key: "stripe",   label: "Stripe",   desc: "Credit / Debit Card (USD)",                    color: "#635bff" },
                { key: "paymongo", label: "PayMongo", desc: "GCash · Maya · Cards · OTC (PHP)",             color: "#0070f3" },
                { key: "xendit",   label: "Xendit",   desc: "GCash · Maya · Bank Transfer (PHP)",           color: "#003d79" },
              ] as { key: keyof typeof gateways; label: string; desc: string; color: string }[]).map(({ key, label, desc, color }) => (
                <div key={key} className="flex items-center justify-between px-4 py-3 bg-gray-800 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full" style={{ background: color }} />
                    <div>
                      <p className="text-sm font-medium text-white">{label}</p>
                      <p className="text-xs text-gray-500">{desc}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleGateway(key)}
                    className={`relative w-11 h-6 rounded-full transition-colors ${
                      gateways[key] ? "bg-green-500" : "bg-gray-600"
                    }`}
                  >
                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      gateways[key] ? "translate-x-5" : "translate-x-0"
                    }`} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* ── PayMongo Webhook Manager ── */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <Webhook className="w-4 h-4 text-blue-400" />
                <h2 className="text-white font-semibold">PayMongo Webhooks</h2>
                {pmSecretSaved && (
                  <span className="text-xs bg-green-900 text-green-300 px-2 py-0.5 rounded-full font-medium">Secret saved ✓</span>
                )}
              </div>
              <button onClick={loadPmWebhooks} className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-gray-800 transition-colors">
                <RefreshCw className={`w-3.5 h-3.5 ${pmWebhookLoading ? "animate-spin" : ""}`} />
              </button>
            </div>
            <p className="text-gray-500 text-xs mb-4">
              Register your webhook URL on PayMongo. The <code className="text-blue-400">secret_key</code> is auto-saved to the database — no manual copy needed.
            </p>

            {/* Webhook URL info box */}
            <div className="mb-4 bg-gray-800 border border-gray-700 rounded-xl p-4">
              <p className="text-xs text-gray-400 mb-2 font-semibold uppercase tracking-wide">Your Webhook Receiver URL</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-xs text-blue-300 font-mono bg-gray-900 px-3 py-2 rounded-lg truncate">
                  {(configMap["NEXTAUTH_URL"] || configMap["NEXT_PUBLIC_APP_URL"] || "https://yourdomain.com").replace(/\/$/, "")}/api/paymongo/webhook
                </code>
                <button
                  onClick={() => copyWebhookUrl(`${(configMap["NEXTAUTH_URL"] || configMap["NEXT_PUBLIC_APP_URL"] || "https://yourdomain.com").replace(/\/$/, "")}/api/paymongo/webhook`)}
                  className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors shrink-0"
                  title="Copy URL"
                >
                  {pmCopied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Events to subscribe: <span className="text-gray-300">payment.paid · payment.failed · link.payment.paid · checkout_session.payment.paid · checkout_session.payment.failed</span>
              </p>
            </div>

            {/* Create webhook form */}
            <div className="flex gap-2 mb-4">
              <input
                value={pmWebhookUrl}
                onChange={(e) => setPmWebhookUrl(e.target.value)}
                placeholder="https://yourdomain.com/api/paymongo/webhook"
                className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
              />
              <button
                onClick={createPmWebhook}
                disabled={pmWebhookCreating || !pmWebhookUrl}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-colors disabled:opacity-50 shrink-0"
              >
                <Plus className="w-4 h-4" />
                {pmWebhookCreating ? "Creating..." : "Register"}
              </button>
            </div>

            {/* Status message */}
            {pmWebhookMsg && (
              <div className={`mb-4 px-3 py-2.5 rounded-lg text-xs font-medium ${
                pmWebhookMsg.ok
                  ? "bg-green-950 border border-green-800 text-green-300"
                  : "bg-red-950 border border-red-800 text-red-300"
              }`}>
                {pmWebhookMsg.ok ? "✓" : "✗"} {pmWebhookMsg.text}
              </div>
            )}

            {/* Registered webhooks list */}
            {pmWebhooks.length > 0 ? (
              <div className="space-y-2">
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-2">Registered Webhooks</p>
                {pmWebhooks.map((wh) => (
                  <div key={wh.id} className="flex items-center justify-between bg-gray-800 rounded-xl px-4 py-3 gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-mono text-gray-300 truncate">{wh.url}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{wh.events?.join(" · ")}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        wh.status === "enabled" ? "bg-green-900 text-green-300" : "bg-gray-700 text-gray-400"
                      }`}>
                        {wh.status}
                      </span>
                      <button
                        onClick={() => togglePmWebhook(wh.id, wh.status)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                        title={wh.status === "enabled" ? "Disable" : "Enable"}
                      >
                        {wh.status === "enabled"
                          ? <ToggleRight className="w-4 h-4 text-green-400" />
                          : <ToggleLeft className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              !pmWebhookLoading && (
                <div className="text-center py-6 text-gray-600">
                  <Webhook className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p className="text-xs">No webhooks registered yet. Enter your URL above and click Register.</p>
                </div>
              )
            )}

            <a
              href="https://docs.paymongo.com/reference/create-a-webhook"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 mt-4"
            >
              <ExternalLink className="w-3 h-3" /> PayMongo Webhook Docs
            </a>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-gray-400 text-sm">Keys are stored securely in the database and override environment variables.</p>
            <div className="flex items-center gap-2">
              <button
                onClick={autoFillFromEnv}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors"
                title="Auto-fill empty fields from .env"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Auto-fill from ENV
              </button>
              <button onClick={loadApiKeys} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors" title="Refresh">
                <RefreshCw className={`w-4 h-4 ${apiLoading ? "animate-spin" : ""}`} />
              </button>
            </div>
          </div>

          {API_GROUPS.map((group) => (
            <div key={group.label} className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: group.color }} />
                <h2 className="text-white font-semibold">{group.label}</h2>
              </div>
              {(group as any).warning && (
                <div className="mb-4 px-3 py-2.5 rounded-lg bg-red-950 border border-red-800 flex items-center justify-between gap-3">
                  <span className="text-xs text-red-300">⚠️ {(group as any).warning}</span>
                  <button
                    onClick={handleRestart}
                    disabled={restarting}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-800 hover:bg-red-700 text-white transition-colors disabled:opacity-60 shrink-0"
                  >
                    <Power className={`w-3.5 h-3.5 ${restarting ? "animate-spin" : ""}`} />
                    {restarting ? "Restarting..." : "Restart Server"}
                  </button>
                </div>
              )}
              {restartMsg && (group as any).warning && (
                <div className={`mb-4 px-3 py-2 rounded-lg text-xs font-medium ${
                  restartMsg.ok ? "bg-green-950 border border-green-800 text-green-300" : "bg-red-950 border border-red-800 text-red-300"
                }`}>
                  {restartMsg.ok ? "✓" : "✗"} {restartMsg.text}
                </div>
              )}
              <div className="space-y-3">
                {group.keys.map(({ key, label, secret }) => (
                  <div key={key}>
                    <label className="text-xs text-gray-400 mb-1 block">{label}</label>
                    <ApiKeyInput
                      value={configMap[key] ?? ""}
                      onChange={(v) => setConfigMap((prev) => ({ ...prev, [key]: v }))}
                      isSecret={secret}
                      isRevealed={!!revealed[key]}
                      onToggle={() => setRevealed((r) => ({ ...r, [key]: !r[key] }))}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handleSaveApi}
              disabled={apiSaving}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all disabled:opacity-60"
              style={{ background: current.primaryColor, color: "#fff" }}
            >
              {apiSaved ? <><Check className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> Save All Keys</>}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
