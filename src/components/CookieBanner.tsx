"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

const COOKIE_KEY = "inkotanyi_cookie_consent_v1";

type Consent = {
  acceptedAll?: boolean;
  analytics?: boolean;
  marketing?: boolean;
  email?: string;
};

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [prefs, setPrefs] = useState<Consent>({ analytics: false, marketing: false });
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    try {
      const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
      const debug = params.get('cookieDebug') === '1' || params.get('showCookieBanner') === '1';
      const raw = localStorage.getItem(COOKIE_KEY);
      if (debug || !raw) setVisible(true);
    } catch (e) {
      setVisible(true);
    }
  }, []);

  useEffect(() => {
    if (!visible) return;
    // hide typical dev overlays while modal is visible
    const selectors = ['#__next_dev_overlay', '#__next-dev-overlay', '.next-dev-overlay', '.react-dev-overlay', '#__next-overlay', '.next-overlay'];
    const hidden: HTMLElement[] = [];
    selectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => {
        const h = el as HTMLElement;
        if (h && h.style && h.style.display !== 'none') {
          hidden.push(h);
          h.style.display = 'none';
        }
      });
    });
    return () => hidden.forEach(h => (h.style.display = ''));
  }, [visible]);

  useEffect(() => {
    if (visible) setTimeout(() => inputRef.current?.focus(), 50);
    if (visible) document.body.style.paddingBottom = '220px';
    else document.body.style.paddingBottom = '';
    return () => { document.body.style.paddingBottom = ''; };
  }, [visible]);

  function saveConsent(c: Consent) {
    try { localStorage.setItem(COOKIE_KEY, JSON.stringify(c)); } catch (e) { /* ignore */ }
  }

  const decline = () => {
    const c: Consent = { acceptedAll: false, analytics: false, marketing: false };
    saveConsent(c);
    setPrefs(c);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-auto" style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}>
      {/* backdrop blur only */}
      <div
        className="fixed inset-0"
        onClick={decline}
        aria-hidden={true}
        style={{ backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', backgroundColor: 'transparent' }}
      />

      {/* modal centered */}
      <div style={{ position: 'fixed', left: '50%', transform: 'translateX(-50%)', bottom: 64, zIndex: 10000, width: '100%', maxWidth: 480 }}>
        <div style={{ background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)', boxShadow: '0 32px 90px rgba(0,0,0,0.18)', border: '1px solid rgba(255,255,255,0.72)', borderRadius: 10, overflow: 'hidden' }}>
          <div style={{ padding: 28, position: 'relative' }}>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, letterSpacing: '0.18em', color: '#111111', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Roboto Mono, monospace', textTransform: 'uppercase' }}>
              RECEIVE WEBSITE UPDATES
            </h3>

            <form
              onSubmit={async (ev) => {
                ev.preventDefault();
                if (loading) return;
                const email = (prefs as any).email;
                if (!email || typeof email !== 'string' || !/^\S+@\S+\.\S+$/.test(email)) {
                  setStatusMessage('Please enter a valid email address');
                  inputRef.current?.focus();
                  return;
                }
                try {
                  setLoading(true);
                  const res = await fetch('/api/subscribe', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) });
                  if (res.status === 201 || res.status === 409) {
                    saveConsent({ acceptedAll: true, analytics: prefs.analytics, marketing: prefs.marketing, email });
                    setStatusMessage(res.status === 201 ? 'Thanks — check your inbox.' : 'You are already subscribed.');
                    setTimeout(() => setVisible(false), 900);
                  } else {
                    const data = await res.json().catch(() => ({}));
                    setStatusMessage((data && (data as any).error) || 'Subscription failed.');
                  }
                } catch (err) {
                  console.error(err);
                  setStatusMessage('Subscription error. Try again later.');
                } finally { setLoading(false); }
              }}
            >
              <div style={{ marginTop: 18 }}>
                <input
                  ref={inputRef}
                  name="email"
                  type="email"
                  placeholder="EMAIL ADDRESS"
                  aria-label="Email address"
                  value={(prefs as any).email || ''}
                  onChange={(e) => setPrefs(s => ({ ...s, email: e.target.value }))}
                  className="subscribe-input-field"
                  style={{ width: '100%', border: '1px solid rgba(0,0,0,0.14)', background: 'rgba(255,255,255,0.96)', padding: '14px 16px', fontSize: 14, textTransform: 'uppercase', borderRadius: 0 }}
                />
              </div>

              <p style={{ marginTop: 12, marginBottom: 8, fontSize: 9, color: '#666666', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                <strong style={{ fontWeight: 600 }}>I CONSENT TO RECEIVE INKOTANYISINCE90 EMAIL MARKETING.</strong> CONSENT IS NOT REQUIRED FOR PURCHASE. READ OUR <Link href="/privacy" style={{ textDecoration: 'underline', color: '#666666' }}>PRIVACY POLICY</Link> TO LEARN ABOUT YOUR RIGHTS AND OUR USE OF YOUR PERSONAL INFORMATION.
              </p>

              <button type="submit" disabled={loading} aria-disabled={loading} className="subscribe-btn" style={{ width: '100%' }}>
                {loading ? 'SUBMITTING...' : 'SUBSCRIBE'}
              </button>
            </form>

            <button aria-label="Close cookie banner" onClick={decline} className="subscribe-close" style={{ position: 'absolute', right: 14, top: 14 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <path d="M18 6L6 18M6 6l12 12" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <div aria-live="polite" style={{ position: 'absolute', left: -9999 }}>{statusMessage}</div>
            {statusMessage && <div style={{ marginTop: 12, fontSize: 13, color: '#111' }} role="status">{statusMessage}</div>}
          </div>
        </div>
      </div>

      <style jsx>{`
        /* ensure monospace placeholder and sharp inputs */
        input::placeholder { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Roboto Mono, monospace; color: #bfbfbf; text-transform: uppercase; letter-spacing: 0.14em; }
        .subscribe-input-field { box-shadow: inset 0 -1px 0 rgba(0,0,0,0.02); transition: box-shadow .14s ease, border-color .12s ease; }
        .subscribe-input-field:focus { outline: none; border-color: #000; box-shadow: 0 6px 20px rgba(0,0,0,0.06); }
        .subscribe-btn { background: #000; color: #fff; padding: 14px 16px; border: none; border-radius: 0; text-transform: uppercase; font-weight: 800; letter-spacing: 0.22em; cursor: pointer; transition: transform .06s ease, background .12s ease; }
        .subscribe-btn:hover { background: #111; transform: translateY(-1px); }
        .subscribe-btn:active { transform: translateY(0); }
        .subscribe-close { width: 44px; height: 44px; border-radius: 50%; background: rgba(255,255,255,0.92); border: 1px solid rgba(0,0,0,0.08); display: inline-flex; align-items: center; justify-content: center; box-shadow: 0 12px 24px rgba(0,0,0,0.09); cursor: pointer; transition: transform .08s ease, box-shadow .12s ease, background .12s ease; }
        .subscribe-close:hover { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(0,0,0,0.08); }
        .subscribe-close:focus { outline: 3px solid rgba(17,24,39,0.06); outline-offset: 2px; }
        @media (max-width: 480px) {
          div[style] { bottom: 32px !important; }
          .subscribe-btn { padding: 12px 14px; }
        }
      `}</style>
    </div>
  );
}
