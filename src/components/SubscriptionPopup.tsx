"use client";

import { FormEvent, useEffect, useState } from "react";

const CONSENT_KEY = "tape-cookie-consent-v1";
const SESSION_KEY = "tape-subscription-dismissed-v1";

export default function SubscriptionPopup() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let consentResolved = false;
    let arrived = false;
    let timer: number | undefined;
    const maybeOpen = () => {
      if (consentResolved && arrived && !sessionStorage.getItem(SESSION_KEY)) setOpen(true);
    };
    try { consentResolved = Boolean(localStorage.getItem(CONSENT_KEY)); } catch {}
    timer = window.setTimeout(() => { arrived = true; maybeOpen(); }, 5000);
    const onConsent = () => { consentResolved = true; maybeOpen(); };
    window.addEventListener("tape:media-consent", onConsent);
    return () => { if (timer) window.clearTimeout(timer); window.removeEventListener("tape:media-consent", onConsent); };
  }, []);

  const dismiss = () => {
    try { sessionStorage.setItem(SESSION_KEY, "dismissed"); } catch {}
    setOpen(false);
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    if (data.get("website")) return;
    setStatus("loading");
    setMessage("");
    try {
      const response = await fetch("/api/subscribe", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email, website: data.get("website"), startedAt: data.get("startedAt") }) });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body.error ?? "Subscription could not be completed.");
      setStatus("success");
      setMessage(body.message ?? "You’re on the list.");
      try { sessionStorage.setItem(SESSION_KEY, "subscribed"); } catch {}
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Subscription could not be completed.");
    }
  };

  if (!open) return null;
  return (
    <aside className="subscription-shell" role="dialog" aria-modal="false" aria-labelledby="subscription-title">
      <button type="button" className="subscription-dismiss" aria-label="Dismiss subscription invitation" onClick={dismiss}>×</button>
      <p id="subscription-title" className="headline-md">STAY IN THE LOOP.</p>
      <p className="mt-2 max-w-sm text-sm text-muted">Receive occasional updates from the archive.</p>
      {status === "success" ? <p className="mt-4 text-sm" role="status">{message}</p> : <form className="subscription-form" onSubmit={submit}>
        <label className="sr-only" htmlFor="subscription-email">Email address</label>
        <input id="subscription-email" name="email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" disabled={status === "loading"} />
        <input name="startedAt" type="hidden" value={String(Date.now())} readOnly />
        <label className="subscription-honeypot" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
        <button className="btn btn-primary" type="submit" disabled={status === "loading"}>{status === "loading" ? "Sending…" : "Subscribe"}</button>
        {message ? <p className="subscription-message" role="alert">{message}</p> : null}
      </form>}
    </aside>
  );
}
