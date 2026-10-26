import React, { createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { castShadow, constrain, foldSheet } from "./fold";

// Book engine: paper-fold page turns (click, key or drag), URL hash sync, mobile single-page.

export const BookCtx = createContext({});
const TURN_MS = 900;
const CV_URL = new URL("../../CV-Nur Ahmad Khatim.pdf", import.meta.url).href;

// ─── Primitives ──────────────────────────────────────────────────────────────

export function Page({ side, num, chapterTitle, runLeft, runRight, children, footnotes }) {
  const ctx = useContext(BookCtx);
  num = num ?? (side === "left" ? ctx.leftNum : ctx.rightNum);
  chapterTitle = chapterTitle ?? ctx.chapterTitle;
  runLeft = runLeft ?? ctx.runLeft;
  runRight = runRight ?? ctx.runRight;

  return (
    <div className={`page ${side}`}>
      <div className="page-inner">
        <div className="runhead">
          <span>{runLeft || (side === "left" ? chapterTitle : "Naim — a working directory")}</span>
          <span>{runRight || (side === "left" ? "Naim" : chapterTitle)}</span>
        </div>
        <div className="page-content">
          {children}
        </div>
        {footnotes &&
        <div className="footnotes">
            <ol start={footnotes.start || 1}>
              {footnotes.items.map((f, i) => <li key={i}>{f}</li>)}
            </ol>
          </div>
        }
        <div className="pagefoot">
          <span>{num}</span>
          <span style={{ fontStyle: "italic", fontSize: 11 }}>{side === "left" ? "verso" : "recto"}</span>
        </div>
      </div>
    </div>);

}

export function Fn({ n }) {return <sup className="fn" data-fn={n}>{n}</sup>;}
export function DoodleArrow({ direction = "note", className = "" }) {
  const path = {
    note: <path d="M3 4v3a6 6 0 0 0 6 6h8 M13 9l4 4-4 4" />,
    external: <path d="M5 15L15 5 M8 5h7v7" />,
    downRight: <path d="M5 5l10 10 M8 15h7V8" />,
  }[direction];

  return (
    <svg
      className={`doodle-arrow doodle-arrow-${direction} ${className}`.trim()}
      viewBox="0 0 20 20"
      aria-hidden="true"
      focusable="false"
    >
      {path}
    </svg>
  );
}

export function Whisper({ children, say }) {
  const bubbleRef = useRef(null);
  const [offset, setOffset] = useState(0);

  const keepBubbleInPage = (event) => {
    const bubble = bubbleRef.current;
    const content = event.currentTarget.closest(".page-content");
    if (!bubble || !content) return;

    const bubbleRect = bubble.getBoundingClientRect();
    const contentRect = content.getBoundingClientRect();
    const margin = 8;
    const centeredLeft = bubbleRect.left - offset;
    const centeredRight = bubbleRect.right - offset;
    let nextOffset = 0;

    if (centeredLeft < contentRect.left + margin) {
      nextOffset = contentRect.left + margin - centeredLeft;
    } else if (centeredRight > contentRect.right - margin) {
      nextOffset = contentRect.right - margin - centeredRight;
    }

    setOffset(nextOffset);
  };

  return (
    <span className="whisper" onMouseEnter={keepBubbleInPage}>
      {children}
      <span
        ref={bubbleRef}
        className="whisper-bubble"
        style={{ "--whisper-offset": `${offset}px` }}>
        {say}
      </span>
    </span>);
}

export function PhotoFig({ src = "/images/foto-naim-2.png", w = 180, caption, rotate = -2 }) {
  return (
    <figure className="photo-figure" style={{ margin: 0, display: "inline-block", transform: `rotate(${rotate}deg)` }}>
      <span className="photo-doodle">
        <img src={src} alt={caption || "Naim"} style={{ width: w, height: w * 1.15, objectFit: "cover" }} />
      </span>
      {caption && <figcaption style={{ fontFamily: "'Newsreader', serif", fontStyle: "italic", fontSize: 12, color: "var(--mute)", marginTop: 10, textAlign: "center", maxWidth: w + 20, transform: `rotate(${-rotate}deg)` }}>{caption}</figcaption>}
    </figure>);

}

export function Stamp({ children, rotate = -3, round = false, ink = false, green = false, style }) {
  const cls = "stamp" + (round ? " round" : "") + (ink ? " ink" : "") + (green ? " green" : "");
  return <span className={cls} style={{ transform: `rotate(${rotate}deg)`, ...(style || {}) }}>{children}</span>;
}

// Chapter scrubber — jump to any chapter from anywhere (replaces the static
// center label in the nav; current chapter inked in accent).
function ChapterScrubber({ chapters, currentId, goto }) {
  return (
    <div className="chapter-scrubber" role="navigation" aria-label="Chapters">
      {chapters.filter((c) => c.roman).map((c) => (
        <button
          key={c.id}
          className={"scrub" + (c.id === currentId ? " current" : "")}
          title={`${c.roman} · ${c.title}`}
          aria-label={`Chapter ${c.roman} — ${c.title}`}
          aria-current={c.id === currentId ? "page" : undefined}
          onClick={() => goto(c.id)}>
          {c.roman}
        </button>
      ))}
    </div>
  );
}

// ─── Spread renderer with its own context ───────────────────────────────────

function SpreadFor({ sp, idx, goto, spreadState, updateSpreadState }) {
  const Comp = sp.Component;
  const ctxValue = {
    leftNum: idx * 2 + 1,
    rightNum: idx * 2 + 2,
    chapterTitle: sp.chapter.runTitle || sp.chapter.title || "—",
    runLeft: sp.chapter.runLeft,
    runRight: sp.chapter.runRight,
    chapter: sp.chapter,
    goto,
    spreadData: spreadState[sp.key] || {},
    updateSpreadData: (updates) => updateSpreadState(sp.key, updates),
  };
  return (
    <BookCtx.Provider value={ctxValue}>
      <Comp />
    </BookCtx.Provider>);

}

// ─── Hooks ─────────────────────────────────────────────────────────────────

function useFlat(chapters) {
  return useMemo(() => {
    const arr = [];
    chapters.forEach((ch, ci) => {
      ch.spreads.forEach((Component, si) => {
        arr.push({ chapter: ch, Component, ci, si, key: `${ch.id}-${si}` });
      });
    });
    return arr;
  }, [chapters]);
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduced(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduced;
}

function useIsMobile() {
  const [m, setM] = useState(() => window.matchMedia("(max-width: 1080px)").matches);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1080px)");
    const on = () => setM(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return m;
}

// ─── Page-turn engine ───────────────────────────────────────────────────────
// The page folds along a crease (see fold.js). The live geometry sits in a ref
// and is drawn straight onto the DOM each frame, so the paper can follow the
// pointer without re-rendering React.

const easeInOut = (k) => k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
const easeOut = (k) => 1 - Math.pow(1 - k, 3);
const clamp01 = (v) => Math.min(1, Math.max(0, v));
const NO_DRAG = "a, button, input, textarea, select, iframe, label, [contenteditable]";
const CORNER_LIFT = 0.16; // how high a clicked page's corner rises mid-turn, × page height
const GRIP = 0.2; // width of the draggable outer edge, × page width
const RING_R = 14; // single-page view: how far a page curls out past its hinge, px (≈ the coil's loop)

// One turning sheet: the part still lying flat, and the folded-over flap
// showing the sheet's back. `nodes` collects the DOM nodes foldSheet() moves.
// `wraps`: single-page view, where the flap curls round the binding past the
// hinge — that part sits under the coil, the rest of the flap over it.
function Sheet({ nodes, front, back, wraps }) {
  return (
    <>
      <div className="sheet-front" ref={(el) => nodes.front = el}>
        {front || <div className="paper-blank" />}
      </div>
      {wraps &&
      <div className="sheet-wrapped">
          <div className="sheet-back" ref={(el) => nodes.backOver = el}>
            {back || <div className="paper-blank" />}
          </div>
        </div>
      }
      <div className="sheet-flap" ref={(el) => nodes.flap = el}>
        <div className="sheet-back" ref={(el) => nodes.back = el}>
          {back || <div className="paper-blank" />}
          <div className="fold-band shade-back" ref={(el) => nodes.backShade = el} />
          {!wraps && <div className="back-gutter" ref={(el) => nodes.backGutter = el} />}
        </div>
      </div>
    </>);

}

// ─── Book shell ─────────────────────────────────────────────────────────────

export function Book({ chapters }) {
  const flat = useFlat(chapters);
  const isMobile = useIsMobile();
  const reducedMotion = usePrefersReducedMotion();
  const [spreadState, setSpreadState] = useState({});
  const updateSpreadState = useCallback((key, updates) => {
    setSpreadState((state) => ({
      ...state,
      [key]: { ...(state[key] || {}), ...updates },
    }));
  }, []);

  const [idx, setIdx] = useState(() => {
    const hash = window.location.hash.slice(1);
    const i = flat.findIndex((s) => s.key === hash);
    return i >= 0 ? i : 0;
  });
  // Mobile: which page of the spread is showing — "left" or "right"
  const [mPage, setMPage] = useState("left");
  // Active turn: { idx, mPage, dir: "next"|"prev", skip } or null.
  // skip = extra blank leaves riffled past when jumping several spreads.
  const [turn, setTurn] = useState(null);
  const turnRef = useRef(null);
  const wrapRef = useRef(null);
  const rafRef = useRef(0);
  // Live fold: { W, H, spineX, s, P0, P, fromTurned, t, path }
  //   P0 = the point of the sheet being pulled, P = where it is now (leaf coords).
  //   fromTurned: the sheet starts folded away and comes back (mobile, turning back).
  const foldRef = useRef(null);
  const sheetNodes = useRef({});
  const ghostNodes = useRef([]);
  const castBox = useRef(null);
  const castStrip = useRef(null);

  const draw = useCallback(() => {
    const f = foldRef.current;
    if (!f || !sheetNodes.current.front) return;
    const liftOf = (P) => Math.sin(Math.PI * clamp01((f.P0.x - P.x) / (2 * f.P0.x)));
    // Once nearly over, the curl round the binding tucks away underneath too.
    const wrapRadius = f.wraps ? RING_R * clamp01((1 - (f.P0.x - f.P.x) / (2 * f.P0.x)) * 6) : null;
    const crease = foldSheet(sheetNodes.current, { ...f, lift: liftOf(f.P), wrapRadius });
    castShadow(castBox.current, castStrip.current, crease, f.W);
    // Riffled blank leaves run ahead of the real one (the first lands first, underneath)
    const ghosts = ghostNodes.current;
    ghosts.forEach((nodes, i) => {
      if (!nodes.front || !f.path) return;
      const P = f.path(clamp01(f.t * (1 + 0.22 * (ghosts.length - i))));
      foldSheet(nodes, { ...f, P, lift: liftOf(P) });
    });
  }, []);

  // Run frame(k) for k: 0 → 1 over `dur` ms, drawing each frame, then done().
  const animate = useCallback((dur, frame, done) => {
    cancelAnimationFrame(rafRef.current);
    if (reducedMotion) dur = 0;
    const t0 = performance.now();
    const step = (now) => {
      const k = dur ? Math.min(1, (now - t0) / dur) : 1;
      frame(k);
      draw();
      if (k < 1) rafRef.current = requestAnimationFrame(step);else
      done();
    };
    rafRef.current = requestAnimationFrame(step);
  }, [reducedMotion, draw]);

  const startTurn = useCallback((t, fold) => {
    cancelAnimationFrame(rafRef.current);
    ghostNodes.current = Array.from({ length: t.skip }, () => ({}));
    foldRef.current = fold;
    turnRef.current = t;
    setTurn(t);
  }, []);

  const endTurn = useCallback((landed) => {
    cancelAnimationFrame(rafRef.current);
    const t = turnRef.current;
    turnRef.current = null;
    foldRef.current = null;
    setTurn(null);
    if (landed && t) {setIdx(t.idx);setMPage(t.mPage);}
  }, []);

  // Let a dragged page go: glide to fully turned or back to flat.
  const release = useCallback((land) => {
    const f = foldRef.current;if (!f) return;
    const turned = { x: -f.P0.x, y: f.P0.y };
    const goal = land !== f.fromTurned ? turned : f.P0;
    const from = { ...f.P };
    const dist = Math.hypot(goal.x - from.x, goal.y - from.y);
    animate(TURN_MS * Math.max(0.3, Math.min(1, dist / (2 * f.W))), (k) => {
      const e = easeOut(k);
      f.P = constrain({ x: from.x + (goal.x - from.x) * e, y: from.y + (goal.y - from.y) * e }, f.P0, f.H);
    }, () => endTurn(land));
  }, [animate, endTurn]);

  // Wrap size → fold frame. Desktop folds about the centre spine; mobile about the left edge.
  const measure = (dir) => {
    const r = wrapRef.current.getBoundingClientRect();
    if (isMobile) return { W: r.width, H: r.height, spineX: 0, s: 1, left: r.left, top: r.top, wraps: true };
    return { W: r.width / 2, H: r.height, spineX: r.width / 2, s: dir === "next" ? 1 : -1, left: r.left, top: r.top };
  };

  useLayoutEffect(() => {if (turn) draw();}, [turn, draw]);
  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);
  useEffect(() => endTurn(false), [isMobile, endTurn]);

  // URL hash sync
  useEffect(() => {
    const key = flat[idx]?.key;
    if (key && window.location.hash.slice(1) !== key) {
      history.replaceState(null, "", "#" + key);
    }
  }, [idx, flat]);

  useEffect(() => {
    const onHash = () => {
      const i = flat.findIndex((s) => s.key === window.location.hash.slice(1));
      if (i >= 0 && i !== idx) {endTurn(false);setIdx(i);setMPage("left");}
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [flat, idx, endTurn]);

  const last = flat.length - 1;
  const canNext = idx < last;
  const canPrev = idx > 0;

  // Where one page turn in `dir` lands — a spread on desktop, a page on mobile.
  const targetOf = (dir) => {
    if (isMobile) {
      if (dir === "next") return mPage === "left" ? { idx, mPage: "right" } : canNext ? { idx: idx + 1, mPage: "left" } : null;
      return mPage === "right" ? { idx, mPage: "left" } : canPrev ? { idx: idx - 1, mPage: "right" } : null;
    }
    const i = idx + (dir === "next" ? 1 : -1);
    return i >= 0 && i <= last ? { idx: i, mPage: "left" } : null;
  };

  // A clicked turn pulls the bottom corner over in an arc, the way a hand would.
  const turnTo = (target, dir, skip = 0) => {
    if (turnRef.current || !target) return;
    const g = measure(dir);
    const P0 = { x: g.W, y: g.H };
    const fromTurned = isMobile && dir === "prev";
    const path = (t) => {
      const u = fromTurned ? 1 - t : t;
      return constrain({ x: g.W - 2 * g.W * u, y: g.H * (1 - CORNER_LIFT * Math.sin(Math.PI * u)) }, P0, g.H);
    };
    const fold = { ...g, P0, fromTurned, t: 0, path, P: path(0) };
    startTurn({ ...target, dir, skip }, fold);
    animate(TURN_MS * (skip ? 1.25 : 1), (k) => {fold.t = easeInOut(k);fold.P = path(fold.t);}, () => endTurn(true));
  };
  const next = () => turnTo(targetOf("next"), "next");
  const prev = () => turnTo(targetOf("prev"), "prev");
  const jumpTo = (i) => {
    if (i === idx || i < 0 || i > last) return;
    const skip = isMobile ? 0 : Math.min(3, Math.abs(i - idx) - 1);
    turnTo({ idx: i, mPage: "left" }, i > idx ? "next" : "prev", skip);
  };

  const goto = (id) => {
    const i = flat.findIndex((s) => s.chapter.id === id || s.key === id);
    if (i < 0 || i === idx) return;
    jumpTo(i);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Keyboard
  useEffect(() => {
    const onKey = (e) => {
      if (e.target.matches("input, textarea")) return;
      if (e.key === "ArrowRight" || e.key === " ") {e.preventDefault();next();} else
      if (e.key === "ArrowLeft") {e.preventDefault();prev();} else
      if (e.key === "Home") jumpTo(0);else
      if (e.key === "End") jumpTo(last);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  // Grab the paper anywhere and pull — the point you grabbed stays under the
  // pointer and the page folds to match. Let go past a third of the way (or
  // flick) and it turns; otherwise it settles back.
  const live = useRef(null);
  live.current = { targetOf, isMobile, measure };
  useEffect(() => {
    const el = wrapRef.current;if (!el) return;
    let g = null;

    const down = (e) => {
      if (turnRef.current || e.button > 0 || e.target.closest(NO_DRAG)) return;
      // Only the outer edge of a page is a grip, like a thumb at the fore-edge
      // (on a phone, the left edge pulls the previous page back in).
      const r = el.getBoundingClientRect();
      const pageW = live.current.isMobile ? r.width : r.width / 2;
      const grip = Math.max(48, pageW * GRIP);
      const dir = e.clientX > r.right - grip ? "next" : e.clientX < r.left + grip ? "prev" : null;
      if (!dir) return;
      if (e.pointerType === "mouse") e.preventDefault(); // no text selection from the grip
      g = { id: e.pointerId, x: e.clientX, y: e.clientY, dir, started: false, lx: e.clientX, lt: e.timeStamp, v: 0 };
    };

    const move = (e) => {
      if (!g || e.pointerId !== g.id) return;
      const dx = e.clientX - g.x,dy = e.clientY - g.y;
      if (!g.started) {
        if (Math.abs(dy) > 14 && Math.abs(dy) > Math.abs(dx)) {g = null;return;}
        if (Math.abs(dx) < 8) return;
        const dir = g.dir;
        const target = dir === "next" === dx < 0 ? live.current.targetOf(dir) : null;
        if (!target) {g = null;return;}
        const m = live.current.measure(dir);
        const fromTurned = live.current.isMobile && dir === "prev";
        const gy = Math.min(m.H, Math.max(0, g.y - m.top));
        // On a phone, turning back pulls the previous page's outer edge in from the spine.
        const P0 = fromTurned ? { x: m.W, y: gy } : { x: Math.max(4, m.s * (g.x - m.left - m.spineX)), y: gy };
        g.dir = dir;
        g.started = true;
        g.fold = { ...m, P0, fromTurned, t: 0, path: null, P: fromTurned ? { x: -m.W, y: gy } : P0 };
        try {el.setPointerCapture(e.pointerId);} catch {/* pointer already gone */}
        window.getSelection()?.removeAllRanges();
        startTurn({ ...target, dir, skip: 0 }, g.fold);
      }
      const f = g.fold;
      const want = f.fromTurned ?
      { x: -f.W + 2 * dx, y: f.P0.y + dy * 0.5 } :
      { x: f.P0.x + f.s * dx, y: f.P0.y + dy };
      f.P = constrain(want, f.P0, f.H);
      draw();
      g.v = (e.clientX - g.lx) / Math.max(16, e.timeStamp - g.lt); // px/ms
      g.lx = e.clientX;g.lt = e.timeStamp;
    };

    const up = (e) => {
      if (!g || e.pointerId !== g.id) return;
      const done = g;g = null;
      if (!done.started) return;
      if (e.timeStamp - done.lt > 100) done.v = 0; // held still before letting go
      const f = done.fold;
      const toward = (done.dir === "next" ? -done.v : done.v) > 0.45;
      const away = (done.dir === "next" ? done.v : -done.v) > 0.45;
      const progress = f.fromTurned ? (f.P.x + f.W) / (2 * f.W) : (f.P0.x - f.P.x) / (2 * f.P0.x);
      release(e.type !== "pointercancel" && !away && (toward || progress > 0.33));
    };

    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
    return () => {
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
    };
  }, [isMobile, startTurn, draw, release]);

  // Footnote click flash
  useEffect(() => {
    const onClick = (e) => {
      const sup = e.target.closest(".fn[data-fn]");
      if (!sup) return;
      const n = sup.dataset.fn;
      const scope = sup.closest(".spread") || sup.closest(".page");
      const list = scope?.querySelector(`.footnotes li:nth-child(${n})`);
      if (list) {
        list.style.transition = "background 0.6s";
        list.style.background = "var(--accent-soft)";
        setTimeout(() => list.style.background = "", 1100);
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  useEffect(() => {window.__bookGoto = goto;});

  const cur = flat[idx];
  const tgt = turn ? flat[turn.idx] : null;
  const ch = cur.chapter;
  const spreadOf = (sp, i) =>
  <SpreadFor sp={sp} idx={i} goto={goto} spreadState={spreadState} updateSpreadState={updateSpreadState} />;
  const cast =
  <div className="fold-cast" ref={castBox}><div className="fold-band shade-cast" ref={castStrip} /></div>;


  if (isMobile) {
    return (
      <MobileBook
        cur={cur} tgt={tgt} idx={idx} mPage={mPage} turn={turn}
        next={next} prev={prev} goto={goto}
        canNext={canNext} canPrev={canPrev}
        chapters={chapters} flat={flat}
        wrapRef={wrapRef} sheetNodes={sheetNodes} cast={cast}
        spreadOf={spreadOf} />);


  }

  // One page of a spread, cut out for a sheet face
  const half = (sp, i, side) =>
  <div className="spread sheet-spread" style={{ left: side === "right" ? "calc(-1 * var(--page-w))" : 0 }}>{spreadOf(sp, i)}</div>;


  return (
    <div className="book-app">
      <div className="topbar">
        <span>NURAHMADKHATIM.GITHUB.IO · <a href="#cover-0" onClick={(e) => {e.preventDefault();goto("cover");}}>contents</a> · <a href="#correspondence-0" onClick={(e) => {e.preventDefault();goto("correspondence");}}>say hi</a> · <a className="cv-link" href={CV_URL} target="_blank" rel="noopener noreferrer">cv ↓</a></span>
        <span>{ch.id !== "cover" ? ch.roman : "—"} &nbsp;·&nbsp; spread {idx + 1} of {flat.length} &nbsp;·&nbsp; <span className="kbd">←</span> <span className="kbd">→</span> &nbsp;or pull a page</span>
      </div>

      <div className={"spread-wrap" + (turn ? " turning" : "")} ref={wrapRef}>
        {/* BASE: shows target during a turn, else current */}
        <div className={"spread base " + (turn ? `flipping-${turn.dir}` : "")}>
          {spreadOf(turn ? tgt : cur, turn ? turn.idx : idx)}
        </div>

        {/* Spine shadow centered */}
        <div className="spine-shadow" />

        {turn &&
        <>
            {/* The page the turning sheet will land on, still showing the CURRENT spread */}
            <div className={`cover-side cover-${turn.dir === "next" ? "left" : "right"}`}>
              <div className="spread">{spreadOf(cur, idx)}</div>
            </div>

            {cast}

            {ghostNodes.current.map((nodes, k) => <Sheet key={k} nodes={nodes} />)}

            <Sheet
            nodes={sheetNodes.current}
            front={half(cur, idx, turn.dir === "next" ? "right" : "left")}
            back={half(tgt, turn.idx, turn.dir === "next" ? "left" : "right")} />
          </>
        }

        <div className="edge-flip left" onClick={prev} title="previous page (←) — or pull the page" />
        <div className="edge-flip right" onClick={next} title="next page (→) — or pull the page" />
        <div className="page-curl left" />
        <div className="page-curl right" />
      </div>

      <div className="book-nav">
        <div><button className="btn" onClick={prev} disabled={!canPrev || !!turn}>← previous</button></div>
        <div className="center">
          {ch.id === "cover" ? "open the book →" : <ChapterScrubber chapters={chapters} currentId={ch.id} goto={goto} />}
        </div>
        <div className="right"><button className="btn" onClick={next} disabled={!canNext || !!turn}>next →</button></div>
      </div>
    </div>);

}

// ─── Mobile book — one page at a time, hinged on the left like a paperback ──

function MobileBook({ cur, tgt, idx, mPage, turn, next, prev, goto, canNext, canPrev, chapters, flat, wrapRef, sheetNodes, cast, spreadOf }) {
  const ch = cur.chapter;
  const page = (sp, i, side) =>
  <div className="spread mobile-spread" data-show={side}>{spreadOf(sp, i)}</div>;

  const here = page(cur, idx, mPage);
  const there = turn && page(tgt, turn.idx, turn.mPage);
  // Turning forward folds the current page off the next; turning back lays the previous page over this one.
  const under = turn?.dir === "next" ? there : here;
  const leaf = turn && (turn.dir === "next" ? here : there);

  return (
    <div className="book-app">
      <div className="topbar">
        <span><a href="#cover-0" onClick={(e) => {e.preventDefault();goto("cover");}}>contents</a> · <a href="#correspondence-0" onClick={(e) => {e.preventDefault();goto("correspondence");}}>say hi</a> · <a className="cv-link" href={CV_URL} target="_blank" rel="noopener noreferrer">cv ↓</a></span>
        <span>{ch.id !== "cover" ? ch.roman : "—"} &nbsp;·&nbsp; {idx + 1}/{flat.length} · {mPage}</span>
      </div>

      <div className={"spread-wrap mobile" + (turn ? " turning" : "")} ref={wrapRef}>
        <div className="mobile-page">{under}</div>
        {turn &&
        <>
            {cast}
            <Sheet nodes={sheetNodes.current} front={leaf} wraps />
          </>
        }
        {/* Wire coil down the hinge edge — shown at tablet widths (see book.css) */}
        <div className="spiral-binding" aria-hidden="true" />
      </div>

      <div className="book-nav">
        <div><button className="btn" onClick={prev} disabled={!canPrev && mPage === "left" || !!turn}>← back</button></div>
        <div className="center">
          {ch.id === "cover" ? "swipe to turn →" : <ChapterScrubber chapters={chapters} currentId={ch.id} goto={goto} />}
        </div>
        <div className="right"><button className="btn" onClick={next} disabled={!canNext && mPage === "right" || !!turn}>next →</button></div>
      </div>
    </div>);

}
