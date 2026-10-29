"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";
const KEY = "tape-theme-v1";

export default function FloatingThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [phase, setPhase] = useState<"hidden" | "shown" | "fading">("hidden");
  useEffect(() => {
    let stored: string | null = null;
    try { stored = localStorage.getItem(KEY); } catch {}
    const initial = stored === "light" || stored === "dark" ? stored : document.documentElement.dataset.theme === "light" ? "light" : "dark";
    setTheme(initial);
    const show = window.setTimeout(() => setPhase("shown"), 3000);
    const fade = window.setTimeout(() => setPhase("fading"), 5000);
    const hide = window.setTimeout(() => setPhase("hidden"), 10000);
    return () => { window.clearTimeout(show); window.clearTimeout(fade); window.clearTimeout(hide); };
  }, []);
  const toggle = () => {
    const next = theme === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = next;
    setTheme(next);
    try { localStorage.setItem(KEY, next); } catch {}
  };
  return <button type="button" className={`floating-theme-toggle ${phase === "hidden" ? "is-hidden" : ""}`} aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`} title="Toggle theme" onClick={toggle}><span aria-hidden="true">{theme === "light" ? "☼" : "◐"}</span></button>;
}
