import React, { useEffect, useRef, useState } from "react";

// Display-mode picker. Wide screens offer the two-page book ("desktop"), the
// one-page book ("tablet") and the plain profile page. Narrow screens can only
// fit the one-page book, so they offer just "book" and "profile".

const ICONS = {
  book: (
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 5.5c3-1 6-1 9 .8 3-1.8 6-1.8 9-.8V19c-3-1-6-1-9 .8-3-1.8-6-1.8-9-.8z" /><path d="M12 6.3v13.5" /></svg>
  ),
  single: (
    <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="3" width="14" height="18" rx="2" /><path d="M9 7h6M9 11h6M9 15h4" /></svg>
  ),
  profile: (
    <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3.4" /><path d="M5 20c.8-3.6 3.6-5.5 7-5.5s6.2 1.9 7 5.5" /></svg>
  ),
};

function optionsFor(narrow) {
  return narrow
    ? [
        { id: "book", icon: "single", label: "book", hint: "turn the pages" },
        { id: "profile", icon: "profile", label: "profile", hint: "a plain one-page site" },
      ]
    : [
        { id: "book", icon: "book", label: "desktop", hint: "two-page spread" },
        { id: "single", icon: "single", label: "tablet", hint: "one page at a time" },
        { id: "profile", icon: "profile", label: "profile", hint: "a plain one-page site" },
      ];
}

export default function ViewSwitcher({ mode, narrow, onChange, tone = "dark" }) {
  const [open, setOpen] = useState(false);
  const root = useRef(null);
  const options = optionsFor(narrow);
  const current = narrow && mode === "single" ? "book" : mode;
  const active = options.find((o) => o.id === current) || options[0];

  useEffect(() => {
    if (!open) return;
    const onDown = (e) => { if (!root.current?.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const pick = (id) => {
    setOpen(false);
    if (id !== current) onChange(id);
  };

  return (
    <span className={`view-switch view-switch-${tone}`} ref={root}>
      <button
        type="button"
        className="view-switch-btn"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={(e) => { e.stopPropagation(); setOpen((o) => !o); }}>
        {ICONS[active.icon]}
        <span>display: {active.label}</span>
        <span className="view-switch-caret" aria-hidden="true">▾</span>
      </button>
      {open && (
        <span className="view-switch-menu" role="menu">
          {options.map((o) => (
            <button
              key={o.id}
              type="button"
              role="menuitemradio"
              aria-checked={o.id === current}
              className="view-switch-item"
              onClick={(e) => { e.stopPropagation(); pick(o.id); }}>
              {ICONS[o.icon]}
              <span className="view-switch-text">
                <strong>{o.label}</strong>
                <small>{o.hint}</small>
              </span>
              {o.id === current && <span className="view-switch-check" aria-hidden="true">✓</span>}
            </button>
          ))}
        </span>
      )}
    </span>
  );
}
