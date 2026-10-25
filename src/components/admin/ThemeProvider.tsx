"use client";
import { useEffect } from "react";

export const THEME_DEFAULTS = {
  navbarBg: "#1a1a1a",
  navbarStyle: "dark",   // dark | gold | white | frosted
  primaryColor: "#c9a84c",
  sidebarBg: "#111111",
  accentColor: "#c9a84c",
};

export type AdminTheme = typeof THEME_DEFAULTS;

export function applyTheme(theme: Partial<AdminTheme>) {
  const t = { ...THEME_DEFAULTS, ...theme };
  const root = document.documentElement;
  root.style.setProperty("--admin-navbar-bg", t.navbarBg);
  root.style.setProperty("--admin-sidebar-bg", t.sidebarBg);
  root.style.setProperty("--admin-primary", t.primaryColor);
  root.style.setProperty("--admin-accent", t.accentColor);
}

export function loadTheme(): Partial<AdminTheme> {
  try {
    const stored = localStorage.getItem("aurex-admin-theme");
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

export function saveTheme(theme: Partial<AdminTheme>) {
  localStorage.setItem("aurex-admin-theme", JSON.stringify(theme));
}

export default function AdminThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    applyTheme(loadTheme());
  }, []);

  return <>{children}</>;
}
