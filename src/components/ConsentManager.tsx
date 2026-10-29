"use client";

import { FormEvent, useEffect, useState } from "react";

const CONSENT_KEY = "tape-cookie-consent-v1";
const MEDIA_EVENT = "tape:media-consent";

type Consent = { media: boolean };

function readConsent(): Consent | null {
  try {
    const value = JSON.parse(localStorage.getItem(CONSENT_KEY) ?? "null") as Partial<Consent> | null;
    return value && typeof value.media === "boolean" ? { media: value.media } : null;
  } catch {
    return null;
  }
}

export default function ConsentManager() {
  const [visible, setVisible] = useState(false);
  const [preferences, setPreferences] = useState(false);
  const [media, setMedia] = useState(false);

  useEffect(() => {
    const existing = readConsent();
    if (existing) {
      setMedia(existing.media);
      window.dispatchEvent(new CustomEvent(MEDIA_EVENT, { detail: existing.media }));
      return;
    }
    const timer = window.setTimeout(() => setVisible(true), 1000);
    return () => window.clearTimeout(timer);
  }, []);

  const save = (next: Consent) => {
    try { localStorage.setItem(CONSENT_KEY, JSON.stringify(next)); } catch {}
    setVisible(false);
    setPreferences(false);
    window.dispatchEvent(new CustomEvent(MEDIA_EVENT, { detail: next.media }));
  };

  const submitPreferences = (event: FormEvent) => {
    event.preventDefault();
    save({ media });
  };

  if (!visible) return null;

  return (
    <aside className="consent-shell" role="dialog" aria-modal="false" aria-labelledby="consent-title">
      <div className="consent-copy">
        <p id="consent-title" className="kicker">Cookies</p>
        <p className="mt-2 text-sm text-muted">We use necessary storage for site preferences. Optional media cookies enable third-party embeds.</p>
      </div>
      {preferences ? (
        <form className="consent-preferences" onSubmit={submitPreferences}>
          <label className="consent-option"><span><strong>Necessary cookies</strong><small>Always enabled for core site preferences.</small></span><input type="checkbox" checked disabled aria-label="Necessary cookies always enabled" /></label>
          <label className="consent-option"><span><strong>Optional media cookies</strong><small>Allow YouTube and other non-essential media.</small></span><input type="checkbox" checked={media} onChange={(event) => setMedia(event.target.checked)} /></label>
          <div className="consent-actions"><button className="btn" type="button" onClick={() => save({ media: false })}>Reject optional</button><button className="btn btn-primary" type="submit">Save preferences</button></div>
        </form>
      ) : (
        <div className="consent-actions"><button className="btn" type="button" onClick={() => save({ media: false })}>Reject</button><button className="btn" type="button" onClick={() => setPreferences(true)}>Preferences</button><button className="btn btn-primary" type="button" onClick={() => save({ media: true })}>Accept</button></div>
      )}
    </aside>
  );
}
