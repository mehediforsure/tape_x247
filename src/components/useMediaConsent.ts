"use client";
import { useEffect, useState } from "react";
export function useMediaConsent() {
  const [allowed, setAllowed] = useState(false);
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("tape-cookie-consent-v1") ?? "null");
      setAllowed(stored?.media === true);
    } catch {}
    const onConsent = (event: Event) => setAllowed((event as CustomEvent<boolean>).detail === true);
    window.addEventListener("tape:media-consent", onConsent);
    return () => window.removeEventListener("tape:media-consent", onConsent);
  }, []);
  return allowed;
}
