"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";
const key = "tape-theme-v1";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);
  useEffect(() => {
    const apply = (value: Theme) => {
      document.documentElement.dataset.theme = value;
      setTheme(value);
    };
    const sync = () => {
      let stored: string | null = null;
      try { stored = localStorage.getItem(key); } catch {}
      apply(stored === "light" || stored === "dark" ? stored : "dark");
    };
    sync();
    const onThemeChange = () => setTheme(document.documentElement.dataset.theme === "light" ? "light" : "dark");
    window.addEventListener("tape:theme-change", onThemeChange);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("tape:theme-change", onThemeChange);
      window.removeEventListener("storage", sync);
    };
  }, []);
  return (
    <button
      className="theme-toggle"
      type="button"
      role="switch"
      aria-label="Light theme"
      aria-checked={theme === "light"}
      title={theme === "light" ? "Switch to dark theme" : "Switch to light theme"}
      disabled={theme === null}
      onClick={() => {
        const value = theme === "light" ? "dark" : "light";
        document.documentElement.dataset.theme = value;
        setTheme(value);
        try { localStorage.setItem(key, value); } catch {}
        window.dispatchEvent(new Event("tape:theme-change"));
      }}
    >
      <span className="theme-switch-track" aria-hidden="true">
        <span className="theme-switch-thumb" />
      </span>
    </button>
  );
}
