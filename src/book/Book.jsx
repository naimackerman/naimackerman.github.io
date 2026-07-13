import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

// Book engine: 3D page-flip, keyboard nav, URL hash sync, touch swipe, mobile single-page.

export const BookCtx = createContext({});
const FLIP_MS = 900;

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
  // Active flip: { idx, dir: "next"|"prev" } or null
  const [flip, setFlip] = useState(null);

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
      if (i >= 0 && i !== idx) {setIdx(i);setMPage("left");setFlip(null);}
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [flat, idx]);

  // Commit the flip after the animation
  useEffect(() => {
    if (!flip) return;
    const t = setTimeout(() => {
      setIdx(flip.idx);
      setFlip(null);
      setMPage("left");
    }, FLIP_MS);
    return () => clearTimeout(t);
  }, [flip]);

  const canNext = idx < flat.length - 1;
  const canPrev = idx > 0;

  const next = useCallback(() => {
    if (flip) return;
    if (isMobile) {
      // On mobile, first advance left → right, then flip spread
      if (mPage === "left") {setMPage("right");return;}
      if (canNext) {setIdx(idx + 1);setMPage("left");}
      return;
    }
    if (!canNext) return;
    if (reducedMotion) {setIdx(idx + 1);setMPage("left");return;}
    setFlip({ idx: idx + 1, dir: "next" });
  }, [flip, isMobile, mPage, canNext, idx, reducedMotion]);

  const prev = useCallback(() => {
    if (flip) return;
    if (isMobile) {
      if (mPage === "right") {setMPage("left");return;}
      if (canPrev) {setIdx(idx - 1);setMPage("right");}
      return;
    }
    if (!canPrev) return;
    if (reducedMotion) {setIdx(idx - 1);setMPage("left");return;}
    setFlip({ idx: idx - 1, dir: "prev" });
  }, [flip, isMobile, mPage, canPrev, idx, reducedMotion]);

  const goto = useCallback((id) => {
    const i = flat.findIndex((s) => s.chapter.id === id || s.key === id);
    if (i < 0 || i === idx) return;
    setFlip(null);
    setIdx(i);
    setMPage("left");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [flat, idx]);

  // Keyboard
  useEffect(() => {
    const onKey = (e) => {
      if (e.target.matches("input, textarea")) return;
      if (e.key === "ArrowRight" || e.key === " ") {e.preventDefault();next();} else
      if (e.key === "ArrowLeft") {e.preventDefault();prev();} else
      if (e.key === "Home") {setIdx(0);setMPage("left");setFlip(null);} else
      if (e.key === "End") {setIdx(flat.length - 1);setMPage("left");setFlip(null);}
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, flat.length]);

  // Touch swipe
  const wrapRef = useRef(null);
  useEffect(() => {
    const el = wrapRef.current;if (!el) return;
    let startX = 0,startY = 0,t = 0;
    const ts = (e) => {const tt = e.touches[0];startX = tt.clientX;startY = tt.clientY;t = Date.now();};
    const te = (e) => {
      const tt = e.changedTouches[0];
      const dx = tt.clientX - startX,dy = tt.clientY - startY,dt = Date.now() - t;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.4 && dt < 700) {
        if (dx < 0) next();else prev();
      }
    };
    el.addEventListener("touchstart", ts, { passive: true });
    el.addEventListener("touchend", te, { passive: true });
    return () => {el.removeEventListener("touchstart", ts);el.removeEventListener("touchend", te);};
  }, [next, prev]);

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

  useEffect(() => {window.__bookGoto = goto;}, [goto]);

  const cur = flat[idx];
  const tgt = flip ? flat[flip.idx] : null;
  const ch = cur.chapter;

  // Mobile mode: just render the current page with simple sliding transitions
  if (isMobile) {
    return (
      <MobileBook
        cur={cur} idx={idx} mPage={mPage}
        next={next} prev={prev} goto={goto}
        canNext={canNext} canPrev={canPrev}
        chapters={chapters} flat={flat}
        wrapRef={wrapRef}
        spreadState={spreadState}
        updateSpreadState={updateSpreadState} />);


  }

  return (
    <div className="book-app">
      <div className="topbar">
        <span>NURAHMADKHATIM.GITHUB.IO · <a href="#cover-0" onClick={(e) => {e.preventDefault();goto("cover");}}>cover</a> · <a href="#correspondence-0" onClick={(e) => {e.preventDefault();goto("correspondence");}}>say hi</a></span>
        <span>{ch.id !== "cover" ? ch.roman : "—"} &nbsp;·&nbsp; spread {idx + 1} of {flat.length} &nbsp;·&nbsp; <span className="kbd">←</span> <span className="kbd">→</span> &nbsp;or swipe</span>
      </div>

      <div className="spread-wrap" ref={wrapRef}>
        {/* BASE: shows target during flip, else current */}
        <div className={"spread base " + (flip ? `flipping-${flip.dir}` : "")}>
          <SpreadFor sp={flip ? tgt : cur} idx={flip ? flip.idx : idx} goto={goto} spreadState={spreadState} updateSpreadState={updateSpreadState} />
        </div>

        {/* Spine shadow centered */}
        <div className="spine-shadow" />

        {flip &&
        <>
            {/* The still-visible half of the CURRENT spread */}
            <div className={`cover-side cover-${flip.dir === "next" ? "left" : "right"}`}>
              <div className="spread">
                <SpreadFor sp={cur} idx={idx} goto={goto} spreadState={spreadState} updateSpreadState={updateSpreadState} />
              </div>
            </div>

            {/* The flipping leaf */}
            <div className={`flip-leaf dir-${flip.dir}`}>
              <div className="leaf-face front">
                <div className="spread">
                  <SpreadFor sp={cur} idx={idx} goto={goto} spreadState={spreadState} updateSpreadState={updateSpreadState} />
                </div>
              </div>
              <div className="leaf-face back">
                <div className="spread">
                  <SpreadFor sp={tgt} idx={flip.idx} goto={goto} spreadState={spreadState} updateSpreadState={updateSpreadState} />
                </div>
              </div>
            </div>
          </>
        }

        <div className="edge-flip left" onClick={prev} title="previous page (←)" />
        <div className="edge-flip right" onClick={next} title="next page (→)" />
      </div>

      <div className="book-nav">
        <div><button className="btn" onClick={prev} disabled={!canPrev || !!flip}>← previous</button></div>
        <div className="center">
          {ch.id === "cover" ? "open the book →" : <>chapter {ch.roman} · <em>{ch.title}</em></>}
        </div>
        <div className="right"><button className="btn" onClick={next} disabled={!canNext || !!flip}>next →</button></div>
      </div>
    </div>);

}

// ─── Mobile book — single page, slide-in transitions ────────────────────────

function MobileBook({ cur, idx, mPage, next, prev, goto, canNext, canPrev, flat, wrapRef, spreadState, updateSpreadState }) {
  const ch = cur.chapter;

  // For the slide animation, track key change
  const [slideKey, setSlideKey] = useState(`${idx}-${mPage}`);
  const [slideDir, setSlideDir] = useState("next");
  const prevRef = useRef({ idx, mPage });
  useEffect(() => {
    const p = prevRef.current;
    if (p.idx !== idx || p.mPage !== mPage) {
      const forward = idx > p.idx || idx === p.idx && mPage === "right";
      setSlideDir(forward ? "next" : "prev");
      setSlideKey(`${idx}-${mPage}`);
      prevRef.current = { idx, mPage };
    }
  }, [idx, mPage]);

  return (
    <div className="book-app">
      <div className="topbar">
        <span><a href="#cover-0" onClick={(e) => {e.preventDefault();goto("cover");}}>cover</a> · <a href="#correspondence-0" onClick={(e) => {e.preventDefault();goto("correspondence");}}>say hi</a></span>
        <span>{ch.id !== "cover" ? ch.roman : "—"} &nbsp;·&nbsp; {idx + 1}/{flat.length} · {mPage}</span>
      </div>

      <div className="spread-wrap mobile" ref={wrapRef}>
        <div key={slideKey} className={"mobile-page slide-" + slideDir}>
          <div className="spread mobile-spread" data-show={mPage}>
            <SpreadFor sp={cur} idx={idx} goto={goto} spreadState={spreadState} updateSpreadState={updateSpreadState} />
          </div>
          <div className="spine-shadow mobile-shadow" />
        </div>
      </div>

      <div className="book-nav">
        <div><button className="btn" onClick={prev} disabled={!canPrev && mPage === "left"}>← back</button></div>
        <div className="center">
          {ch.id === "cover" ? "swipe to open →" : <>{ch.roman} · <em>{ch.title}</em></>}
        </div>
        <div className="right"><button className="btn" onClick={next} disabled={!canNext && mPage === "right"}>next →</button></div>
      </div>
    </div>);

}
