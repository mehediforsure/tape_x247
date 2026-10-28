"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";
const key = "tape-theme-v1";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: light)");
    const apply = (value: Theme) => {
      document.documentElement.dataset.theme = value;
      setTheme(value);
    };
    const sync = () => {
      let stored: string | null = null;
      try { stored = localStorage.getItem(key); } catch {}
      apply(stored === "light" || stored === "dark" ? stored : media.matches ? "light" : "dark");
    };
    sync();
    media.addEventListener("change", sync);
    window.addEventListener("storage", sync);
    return () => {
      media.removeEventListener("change", sync);
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
      }}
    >
      <span className="theme-switch-track" aria-hidden="true">
        <span className="theme-switch-thumb" />
      </span>
    </button>
  );
}
