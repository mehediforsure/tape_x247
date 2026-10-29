"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";
const KEY = "tape-theme-v1";

export default function FloatingThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const sync = () => setTheme(document.documentElement.dataset.theme === "light" ? "light" : "dark");
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    let timer: number;
    const schedule = () => {
      timer = window.setTimeout(() => {
        if (document.hidden) { schedule(); return; }
        setShown(true);
        timer = window.setTimeout(() => { setShown(false); schedule(); }, 10000);
      }, 30000 + Math.random() * 60000);
    };
    schedule();
    return () => { window.clearTimeout(timer); observer.disconnect(); };
  }, []);
  const toggle = () => {
    const next = document.documentElement.dataset.theme === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = next;
    setTheme(next);
    try { localStorage.setItem(KEY, next); } catch {}
    window.dispatchEvent(new Event("tape:theme-change"));
  };
  return <button type="button" className={`floating-theme-toggle ${shown ? "" : "is-hidden"}`} inert={!shown} aria-hidden={!shown} aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`} title="Toggle theme" onClick={toggle}><span aria-hidden="true">{theme === "light" ? "☼" : "◐"}</span></button>;
}
