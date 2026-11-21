import React from "react";
import { BookCtx, DoodleArrow, Page, Whisper } from "./Book";
import { getStored, setStored, useStored } from "./formStore";

// Chapters: honors & awards, correspondence.

const { useState: useStateB, useEffect: useEffB, useLayoutEffect: useLayoutEffB, useRef: useRefB, useContext: useContextB } = React;

// ════════════════════════════════════════════════════════════════════════════
// IV · HONORS & AWARDS
// ════════════════════════════════════════════════════════════════════════════

const AWARDS = [
  { title: "MEXT Scholarship Awardee", org: "Master's degree at NAIST", year: "Oct 2026 — Sep 2028", marker: "⛩", featured: true,
    note: "off to the Mathematical Informatics Lab." },
  { title: "Paper Poster Presentation", org: "INCOSE IS 2026 · Yokohama, Japan", year: "Jun 2026", marker: "✧",
    note: "the human-robot co-dispatch work, on a wall in Yokohama." },
  { title: "Best Paper Presentation Award", org: "IMMaN 2024 Conference", year: "Sep 2024", marker: "★",
    note: "the one I keep telling people about." },
  { title: "Research Assistance for Research & Innovation Talents", org: "BRIN Indonesia", year: "Jan 2023", marker: "✦",
    note: "tiny grant, huge confidence boost." },
  { title: "1st · GEOMETRI Mathematics Olympiad", org: "Univ. Negeri Makassar", year: "Jan 2019", marker: "①" },
  { title: "1st · GRAVITASI Physics Olympiad",    org: "Univ. Negeri Makassar", year: "Jan 2019", marker: "①" },
  { title: "1st · ARITMATIKA Mathematics Olympiad", org: "UIN Alauddin Makassar", year: "Jan 2018", marker: "①" },
  { title: "1st · GALAKSI Physics Olympiad",      org: "UIN Alauddin Makassar", year: "Jan 2018", marker: "①" },
  { title: "1st · MOMENTUM Physics Olympiad",     org: "Univ. Muhammadiyah Makassar", year: "Jan 2018", marker: "①" },
  { title: "1st · OPTIKA Mathematics Olympiad",   org: "UIN Syarif Hidayatullah", year: "Jan 2018", marker: "①" },
  { title: "National Science Olympiad — Finalist", org: "Min. of Education, Indonesia", year: "Apr 2015", marker: "✿",
    note: "high school. mostly explains the olympiad streak." },
];

function AwardsSpread() {
  return (
    <>
      <Page side="left">
        <div className="chapter-no">Chapter IV</div>
        <h2 className="chapter-title">Honors &amp; awards.</h2>

        <p className="bodytext drop-cap">
          Most of these happened in 2018–2019, when I was an extremely earnest teenager who really, really liked <Whisper say="and physics. and any subject with a podium.">mathematics</Whisper>.
        </p>
        <p className="bodytext">
          In 2024, I presented our LLM work for ePuskesmas at IMMaN, an online conference for medical doctors. Somehow, it came home with the best-paper presentation award. And then came the biggest one yet — a ticket to Japan.
        </p>

        <div className="marg" style={{ marginTop: "auto", paddingTop: 14, color: "var(--ink-soft)" }}>
          → a fuller list on the right.
        </div>
      </Page>

      <Page side="right" runRight="IV · honors">
        <div style={{ flexShrink: 0 }}>
          <div className="smallcaps" style={{ color: "var(--mute)" }}>the cabinet</div>
          <h3 className="display" style={{ fontSize: 28, margin: "4px 0 14px" }}>An incomplete list, in reverse chronological order.</h3>
        </div>

        <div className="scroll-region">
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
            {AWARDS.map((a, i) => (
              <li key={i} style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 10, alignItems: "baseline", paddingBottom: 8, borderBottom: i < AWARDS.length - 1 ? "1px dotted rgba(0,0,0,0.18)" : "none" }}>
                <div>
                  <div style={{ fontFamily: "'Newsreader', serif", fontSize: 14, fontWeight: a.featured ? 600 : 400, color: "var(--ink)" }}>{a.title}</div>
                  <div style={{ fontFamily: "'Newsreader', serif", fontSize: 12, color: "var(--ink-soft)", fontStyle: "italic" }}>{a.org}</div>
                  {a.note && <div className="hand" style={{ fontSize: 16, color: "var(--accent)" }}><DoodleArrow /> {a.note}</div>}
                </div>
                <span className="mono" style={{ fontSize: 11, color: "var(--mute-strong)" }}>{a.year}</span>
              </li>
            ))}
          </ul>
        </div>
      </Page>
    </>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// V · CORRESPONDENCE (contact form + socials + guestbook)
// ════════════════════════════════════════════════════════════════════════════

const SEED_GUEST = [
  { name: "naim",   msg: "Hello, world!", date: "15 July 2026", color: "var(--accent)" },
];

function GuestbookForm({ onSign }) {
  const { ghost } = useContextB(BookCtx);
  const [name, setName] = useStored("guest.name", "");
  const [msg, setMsg]   = useStored("guest.msg", "");
  const [done, setDone] = useStateB(false);
  const [err, setErr]   = useStateB("");
  const [submitting, setSubmitting] = useStateB(false);

  // Remote guestbook needs both the endpoint and a Turnstile check;
  // without them (e.g. local dev) it falls back to browser-only entries.
  const remote = Boolean(CONTACT_ENDPOINT && TURNSTILE_SITE_KEY);
  const ts = useSharedTurnstile(remote && !ghost);

  const canSign = name.trim() && msg.trim() && (!remote || ts.token) && !submitting;

  const submit = async (e) => {
    e.preventDefault();
    if (!canSign) return;
    setErr("");
    const entry = { id: newSubmissionId(), name: name.trim().slice(0, 40), msg: msg.trim().slice(0, 200), date: shortDate(new Date()) };

    if (remote) {
      setSubmitting(true);
      const token = ts.token;
      ts.consume(); // single-use, whatever the outcome
      try {
        await postToSheet({
          formType: "guestbook",
          submissionId: entry.id,
          name: entry.name,
          message: entry.msg,
          "cf-turnstile-response": token,
        });
      } catch {
        setErr("couldn't reach the guestbook. mind trying again?");
        setSubmitting(false);
        return;
      }
      setSubmitting(false);
    }

    onSign(entry);
    setName(""); setMsg(""); setDone(true);
    setTimeout(() => setDone(false), 3500);
  };

  return (
    <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 6 }}>
      <input className="field" placeholder="your name" maxLength={40} value={name} onChange={e => setName(e.target.value)} />
      <textarea className="field" placeholder="a short message…" rows={2} maxLength={200} value={msg} onChange={e => setMsg(e.target.value)} />
      {remote && <TurnstileBox ts={ts} verb="sign" />}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
        <span className="hand" role="status" style={{ fontSize: 16, color: done ? "var(--accent)" : err ? "#a13a2a" : "var(--ink-soft)" }}>
          {done ? "✓ signed. thank you." : err || (submitting ? "signing…" : <><DoodleArrow direction="external" /> {remote ? "inked into the shared guestbook." : "stored locally · never sent anywhere."}</>)}
        </span>
        <button className="btn-ink" type="submit" disabled={!canSign}>{submitting ? "signing…" : "sign"}</button>
      </div>
    </form>
  );
}

// ─── Cloudflare Turnstile config ─────────────────────────────────────────────
const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || "";
const CONTACT_ENDPOINT = import.meta.env.VITE_CONTACT_WEB_APP_URL || "";

const newSubmissionId = () =>
  window.crypto?.randomUUID
    ? window.crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

// POST to the Apps Script endpoint and read its JSON verdict.
// Must be form-urlencoded: that's the only body type Apps Script parses into
// e.parameter, and it's also a "simple request" content type (no CORS
// preflight, which Apps Script can't answer). The response is readable cross-origin.
async function postToSheet(fields) {
  const params = new URLSearchParams(fields);
  const res = await fetch(CONTACT_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
    body: params.toString(),
  });
  if (!res.ok) throw new Error("network");
  const json = await res.json();
  if (json.result !== "success" && json.result !== "warning") {
    throw new Error(json.message || "rejected");
  }
  return json;
}

const shortDate = (d) =>
  d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "2-digit" }).toLowerCase();

// ─── One Turnstile pass per visit, shared by every form ─────────────────────
// A token stays valid for 300s and can be spent once. It lives in the shared
// store, so turning pages or switching views doesn't ask for a new check; only
// spending it (or letting it expire) does. Only one visible form at a time
// shows the widget — the others wait for the same pass.
const TOKEN_TTL_MS = 280 * 1000;
let nextFormId = 1;

function useSharedTurnstile(active) {
  const idRef = useRefB(0);
  if (!idRef.current) idRef.current = nextFormId++;
  const id = idRef.current;
  const boxRef = useRefB(null);
  const widgetRef = useRefB(null);
  const [pass, setPass] = useStored("turnstile.pass", null);
  const [owner] = useStored("turnstile.owner", null);
  const [visible, setVisible] = useStateB(false);
  const valid = Boolean(pass && Date.now() - pass.at < TOKEN_TTL_MS);

  // Visible = actually laid out (a phone shows one page of the spread and
  // hides the other with display:none). Checked every render, which is when
  // the shown page can change.
  useLayoutEffB(() => {
    const v = Boolean(boxRef.current && boxRef.current.getClientRects().length);
    if (v !== visible) setVisible(v);
  });

  // Expire the pass on time.
  useEffB(() => {
    if (!valid) return;
    const t = setTimeout(() => setPass(null), pass.at + TOKEN_TTL_MS - Date.now());
    return () => clearTimeout(t);
  }, [valid, pass, setPass]);

  // Claim the widget if nobody visible holds it; let go when hidden or done.
  const wants = active && visible && !valid;
  useEffB(() => {
    // First come, first served: two forms claiming in the same commit keep the first.
    if (wants && owner == null) setStored("turnstile.owner", (cur) => cur ?? id);
    else if (!wants && owner === id) setStored("turnstile.owner", null);
  }, [wants, owner, id]);
  useEffB(() => () => { if (getStored("turnstile.owner") === id) setStored("turnstile.owner", null); }, [id]);

  const mine = wants && owner === id;
  useEffB(() => {
    if (!mine) return;
    let cancelled = false;
    let widgetId = null;
    let poll = null;
    const mount = () => {
      if (cancelled || !widgetRef.current || !window.turnstile) return;
      try {
        widgetId = window.turnstile.render(widgetRef.current, {
          sitekey: TURNSTILE_SITE_KEY,
          theme: "light",
          size: "compact",
          appearance: "always",
          callback: (token) => setStored("turnstile.pass", { token, at: Date.now() }),
          "expired-callback": () => setStored("turnstile.pass", null),
          "error-callback": () => setStored("turnstile.pass", null),
        });
      } catch (e) { /* ignore double-render */ }
    };
    if (window.turnstile) mount();
    else poll = setInterval(() => { if (window.turnstile) { clearInterval(poll); mount(); } }, 200);
    return () => {
      cancelled = true;
      if (poll) clearInterval(poll);
      if (widgetId != null && window.turnstile) {
        try { window.turnstile.remove(widgetId); } catch (e) {}
      }
    };
  }, [mine]);

  return {
    boxRef,
    widgetRef,
    mine,
    token: valid ? pass.token : null,
    consume: () => setStored("turnstile.pass", null),
  };
}

function TurnstileBox({ ts, verb }) {
  return (
    <div className="turnstile-wrap" ref={ts.boxRef}>
      {ts.mine && <div ref={ts.widgetRef} />}
      <div className="turnstile-note">
        {ts.token
          ? `✓ verified for this visit. you may ${verb}.`
          : ts.mine
            ? `a quick check by cloudflare, then you can ${verb}. once per visit.`
            : "one quick check covers every form — finish it in the other one."}
      </div>
    </div>
  );
}

function ContactForm() {
  const { ghost } = useContextB(BookCtx);
  const [name, setName] = useStored("contact.name", "");
  const [email, setEmail] = useStored("contact.email", "");
  const [msg, setMsg]   = useStored("contact.msg", "");
  const [submitting, setSubmitting] = useStateB(false);
  const [done, setDone] = useStateB(false);
  const [err, setErr]   = useStateB("");

  const ts = useSharedTurnstile(!ghost);
  const token = ts.token;

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const canSubmit = name.trim() && emailOk && msg.trim() && token && !submitting;

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    if (!name.trim() || !msg.trim()) { setErr("a name and a message would be nice."); return; }
    if (!emailOk) { setErr("that email doesn't look quite right."); return; }
    if (!token)   { setErr("please complete the check below."); return; }
    if (!CONTACT_ENDPOINT) { setErr("the form isn't configured yet. please email me directly."); return; }

    setSubmitting(true);
    ts.consume(); // single-use, whatever the outcome
    try {
      await postToSheet({
        formType: "contact",
        submissionId: newSubmissionId(),
        name: name.trim(),
        email: email.trim(),
        message: msg.trim(),
        "cf-turnstile-response": token,
        source: "nurahmadkhatim.github.io",
      });
      setDone(true);
      setName(""); setEmail(""); setMsg("");
      setTimeout(() => setDone(false), 5500);
    } catch (e) {
      setErr("couldn't send. mind trying again, or emailing me directly?");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 6 }}>
      <label className="field-label">your name<input className="field" value={name} onChange={e => setName(e.target.value)} placeholder="who am I writing back to?" /></label>
      <label className="field-label">your email<input className="field" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="someone@somewhere" /></label>
      <label className="field-label">your message<textarea className="field" rows={3} value={msg} onChange={e => setMsg(e.target.value)} placeholder="say anything." /></label>

      {/* Cloudflare Turnstile — wrapped in a warm container */}
      <TurnstileBox ts={ts} verb="send" />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, marginTop: 2 }}>
        <span className="hand" role="status" style={{ fontSize: 16, color: done ? "var(--accent)" : err ? "#a13a2a" : "var(--ink-soft)" }}>
          {done ? "✓ sent. I'll reply within 48h." : err || (submitting ? "sending…" : <><DoodleArrow direction="external" /> powered by cloudflare turnstile.</>)}
        </span>
        <button className="btn-ink" type="submit" disabled={!canSubmit}>{submitting ? "sending…" : "send"}</button>
      </div>
    </form>
  );
}

export function SocialIcon({ name }) {
  const common = { width: 18, height: 18, viewBox: "0 0 24 24", fill: "currentColor" };
  switch (name) {
    case "LinkedIn": return (
      <svg {...common}><path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.77-.77 1.77-1.72V1.72C24 .77 23.21 0 22.22 0z"/></svg>
    );
    case "GitHub": return (
      <svg {...common}><path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58 0-.29-.01-1.04-.02-2.05-3.34.73-4.04-1.61-4.04-1.61-.55-1.38-1.33-1.75-1.33-1.75-1.09-.74.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5 1 .11-.78.42-1.3.76-1.6-2.66-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.31-.54-1.52.12-3.17 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6.01 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.65.24 2.86.12 3.17.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.62-5.49 5.92.43.37.81 1.1.81 2.22 0 1.6-.01 2.89-.01 3.28 0 .32.22.7.83.58A12 12 0 0 0 24 12.5C24 5.87 18.63.5 12 .5z"/></svg>
    );
    case "Google Scholar": return (
      <svg {...common}><path d="M12 2L1 8.5l4 2.4V18l7 4 7-4v-7.1l3-1.8V18h2V8.5L12 2zm0 2.3l8.5 5L12 14.7 3.5 9.3 12 4.3zM6 12.4l6 3.5 6-3.5v4.4l-6 3.4-6-3.4v-4.4z"/></svg>
    );
    case "ORCID": return (
      <svg {...common}><path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zM7.369 4.378c.525 0 .947.431.947.947s-.422.947-.947.947a.95.95 0 0 1-.947-.947c0-.525.422-.947.947-.947zm-.722 3.038h1.444v10.041H6.647V7.416zm3.562 0h3.9c3.712 0 5.344 2.653 5.344 5.025 0 2.578-2.016 5.025-5.325 5.025h-3.919V7.416zm1.444 1.303v7.444h2.297c3.272 0 4.022-2.484 4.022-3.722 0-2.016-1.284-3.722-4.097-3.722h-2.222z"/></svg>
    );
    case "X / Twitter": return (
      <svg {...common}><path d="M17.53 3H21l-7.39 8.45L22 21h-6.84l-5.36-7-6.13 7H.18l7.9-9.04L0 3h7l4.85 6.42L17.53 3zm-1.2 16h1.9L7.78 5H5.74L16.33 19z"/></svg>
    );
    case "Medium": return (
      <svg {...common}><path d="M2.85 6.86c.03-.27-.07-.54-.27-.72L.66 3.71V3.4h6.34l4.9 10.74L16.21 3.4H22.25v.31l-1.65 1.58a.48.48 0 0 0-.18.46v11.5c-.03.17.04.34.18.46l1.61 1.58v.31h-8.11v-.31l1.67-1.62c.16-.17.16-.21.16-.46V6.92l-4.64 11.78h-.63L5.25 6.92v7.89c-.04.34.07.67.31.91l2.17 2.62v.31H1.59v-.31l2.17-2.62c.23-.24.34-.58.29-.91V6.86z"/></svg>
    );
    case "Instagram": return (
      <svg {...common}><path d="M12 2.2c3.2 0 3.6 0 4.8.07 1.2.06 1.8.25 2.2.41.6.22 1 .49 1.4.91.42.42.69.82.91 1.4.16.4.35 1 .41 2.2.06 1.2.07 1.6.07 4.8s0 3.6-.07 4.8c-.06 1.2-.25 1.8-.41 2.2-.22.6-.49 1-.91 1.4-.42.42-.82.69-1.4.91-.4.16-1 .35-2.2.41-1.2.06-1.6.07-4.8.07s-3.6 0-4.8-.07c-1.2-.06-1.8-.25-2.2-.41-.6-.22-1-.49-1.4-.91-.42-.42-.69-.82-.91-1.4-.16-.4-.35-1-.41-2.2C2.21 15.6 2.2 15.2 2.2 12s0-3.6.07-4.8c.06-1.2.25-1.8.41-2.2.22-.6.49-1 .91-1.4.42-.42.82-.69 1.4-.91.4-.16 1-.35 2.2-.41C8.4 2.21 8.8 2.2 12 2.2zM12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63a5.84 5.84 0 0 0-2.13 1.38A5.84 5.84 0 0 0 .63 4.14c-.3.76-.5 1.64-.56 2.91C.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.31.8.73 1.47 1.38 2.13a5.84 5.84 0 0 0 2.13 1.38c.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56a5.84 5.84 0 0 0 2.13-1.38 5.84 5.84 0 0 0 1.38-2.13c.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91a5.84 5.84 0 0 0-1.38-2.13A5.84 5.84 0 0 0 19.86.63c-.76-.3-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0zm0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32zm0 10.16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.4-11.85a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z"/></svg>
    );
    case "Email": return (
      <svg {...common}><path d="M22 4H2c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h20c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-10 6L2 8V6l10 6 10-6v2z"/></svg>
    );
    default: return null;
  }
}

export const SOCIALS = [
  ["LinkedIn",       "in/nurahmadkhatim",         "https://www.linkedin.com/in/nurahmadkhatim"],
  ["GitHub",         "@naimackerman",             "https://github.com/naimackerman"],
  ["Google Scholar", "Nur Ahmad Khatim",          "https://scholar.google.com/citations?user=c9gt1_UAAAAJ"],
  ["ORCID",          "0009-0008-6939-8121",       "https://orcid.org/0009-0008-6939-8121"],
  ["Instagram",      "@naimackerman",             "https://www.instagram.com/naimackerman"],
  ["Medium",         "@naimackerman",             "https://medium.com/@naimackerman"],
  ["Email",          "nurahmadkhatim@gmail.com",  "mailto:nurahmadkhatim@gmail.com"],
];


// Shared guestbook entries — fetched once per visit, not on every page visit.
const EMPTY = [];
let guestbookRequest = null;
// "guest.status": idle → loading → done | error (error can be retried).
function loadGuestbook() {
  if (!CONTACT_ENDPOINT || guestbookRequest) return;
  setStored("guest.status", "loading");
  guestbookRequest = fetch(`${CONTACT_ENDPOINT}?action=guestbook`)
    .then((r) => r.json())
    .then((j) => {
      if (!Array.isArray(j.entries)) throw new Error("bad response");
      setStored("guest.remote", j.entries.map((e) => ({
        id: e.id,
        name: String(e.name || "").slice(0, 40),
        msg: String(e.msg || "").slice(0, 200),
        date: e.ts ? shortDate(new Date(e.ts)) : "",
      })));
      setStored("guest.status", "done");
    })
    .catch(() => {
      guestbookRequest = null;
      setStored("guest.status", "error");
    });
}

// Placeholder cards while the shared guestbook is on its way.
function GuestSkeleton({ i }) {
  return (
    <div className="guest-card guest-skeleton" aria-hidden="true" style={{ transform: `rotate(${(i % 2 ? 0.5 : -0.4)}deg)` }}>
      <span className="skel skel-name" />
      <span className="skel skel-line" />
      <span className="skel skel-line short" />
      <span className="skel skel-meta" />
    </div>
  );
}

function CorrespondenceSpread() {
  // Guestbook: shared entries come from the spreadsheet; localStorage keeps
  // the visitor's own signatures visible even if the fetch fails.
  const [local, setLocal] = useStateB(() => {
    try { return JSON.parse(localStorage.getItem("naim.guestbook") || "[]"); }
    catch { return []; }
  });
  const remote = useStored("guest.remote", EMPTY)[0];
  const [status] = useStored("guest.status", "idle");
  const loading = status === "loading" || (status === "idle" && Boolean(CONTACT_ENDPOINT));
  useEffB(() => { loadGuestbook(); }, []);

  const sign = (e) => {
    const next = [{ ...e, color: "var(--accent)" }, ...local].slice(0, 10);
    setLocal(next);
    try { localStorage.setItem("naim.guestbook", JSON.stringify(next)); } catch {}
  };

  // Own unsynced signatures first, then the shared book, then the seeds.
  const remoteIds = new Set(remote.map((e) => e.id));
  const entries = [
    ...local.filter((e) => !remoteIds.has(e.id)),
    ...remote,
    ...(loading ? [] : SEED_GUEST),
  ].slice(0, 12);

  return (
    <>
      <Page side="left">
        <div className="chapter-no">Chapter V</div>
        <h2 className="chapter-title">Correspondence.</h2>

        <p className="bodytext" style={{ fontSize: 14 }}>
          I read everything. I reply within 48 hours, usually faster. Best
          subjects: clinical-AI projects, weird datasets, mentorship, or
          "i found <Whisper say="✦ — scattered through the book">this thing</Whisper> on your site."
        </p>

        <div className="smallcaps" style={{ color: "var(--mute)", marginTop: 16 }}>write me a letter</div>
        <ContactForm />
      </Page>

      <Page side="right" runRight="V · correspondence">
        <div style={{ flexShrink: 0 }}>
          <div className="smallcaps" style={{ color: "var(--mute)" }}>find me elsewhere</div>
          <div className="social-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, margin: "6px 0 16px" }}>
            {SOCIALS.map(([k, h, url]) => (
              <a key={k} href={url} target="_blank" rel="noopener" className="social-card">
                <span className="social-icon"><SocialIcon name={k} /></span>
                <span className="social-body">
                  <div className="social-name">{k}</div>
                  <div className="social-handle">{h}</div>
                </span>
                <DoodleArrow direction="external" className="social-arrow" />
              </a>
            ))}
          </div>

          <div className="smallcaps" style={{ color: "var(--mute)" }}>guestbook</div>
          <div style={{ fontSize: 12, fontStyle: "italic", color: "var(--ink-soft)", marginBottom: 6 }}>sign here if you'd like — signatures are public, so future visitors can read them.</div>

          <GuestbookForm onSign={sign} />
        </div>

        <div className="scroll-region" style={{ marginTop: 12, paddingLeft: 8 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }} aria-busy={loading || undefined}>
            {loading && (
              <div className="hand guest-status" role="status">
                <span className="guest-spinner" aria-hidden="true" /> fetching the signatures…
              </div>
            )}
            {status === "error" && (
              <div className="hand guest-status" role="status">
                couldn't reach the shared guestbook.{" "}
                <button type="button" className="guest-retry" onClick={loadGuestbook}>try again</button>
              </div>
            )}
            {entries.map((e, i) => (
              <div key={i} className="guest-card" style={{ transform: `rotate(${(i % 2 ? 0.5 : -0.4)}deg)` }}>
                <div className="guest-name">{e.name}</div>
                <div className="guest-msg">"{e.msg}"</div>
                <div className="guest-meta">
                  <span>{e.date}</span>
                  <span style={{ color: "var(--accent)" }}>— signed</span>
                </div>
              </div>
            ))}
            {loading && [0, 1, 2].map((k) => <GuestSkeleton key={`sk${k}`} i={entries.length + k} />)}
          </div>
        </div>
      </Page>
    </>
  );
}

export { AwardsSpread, CorrespondenceSpread, ContactForm, AWARDS };
