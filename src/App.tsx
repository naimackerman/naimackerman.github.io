import React, { useCallback, useEffect, useState } from "react";
import { Book } from "./book/Book";
import {
  BuildingSpread,
  CoverSpread,
  IntroSpread,
  ResearchingSpread,
} from "./book/ChaptersFront";
import { AwardsSpread, CorrespondenceSpread } from "./book/ChaptersBack";
import Profile from "./profile/Profile";
import ViewSwitcher from "./ViewSwitcher";
import CvModal from "./CvModal";
import "./styles/book.css";
import "./styles/profile.css";

const CHAPTERS = [
  { id: "cover", roman: "", title: "", spreads: [CoverSpread] },
  { id: "intro", roman: "I", title: "An introduction", spreads: [IntroSpread] },
  { id: "building", roman: "II", title: "On building", spreads: [BuildingSpread] },
  { id: "researching", roman: "III", title: "On researching", spreads: [ResearchingSpread] },
  { id: "awards", roman: "IV", title: "Honors & awards", spreads: [AwardsSpread] },
  { id: "correspondence", roman: "V", title: "Correspondence", spreads: [CorrespondenceSpread] },
];

// "book": the two-page spread on wide screens, one page on narrow ones.
// "single": the one-page (tablet) book, even on a wide screen.
// "profile": a plain one-page profile site.
type ViewMode = "book" | "single" | "profile";
const VIEW_KEY = "naim.view";
const NARROW = "(max-width: 1080px)";
const isMode = (v: unknown): v is ViewMode => v === "book" || v === "single" || v === "profile";

function initialMode(): ViewMode {
  const fromUrl = new URLSearchParams(window.location.search).get("view");
  if (isMode(fromUrl)) return fromUrl;
  try {
    const saved = localStorage.getItem(VIEW_KEY);
    if (isMode(saved)) return saved;
  } catch {
    /* storage blocked */
  }
  return "book";
}

function useNarrow() {
  const [narrow, setNarrow] = useState(() => window.matchMedia(NARROW).matches);
  useEffect(() => {
    const mq = window.matchMedia(NARROW);
    const on = () => setNarrow(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return narrow;
}

export default function App() {
  const [mode, setModeState] = useState<ViewMode>(initialMode);
  const narrow = useNarrow();

  const setMode = useCallback((next: ViewMode) => {
    setModeState(next);
    try {
      localStorage.setItem(VIEW_KEY, next);
    } catch {
      /* storage blocked */
    }
    const url = new URL(window.location.href);
    if (url.searchParams.has("view")) {
      url.searchParams.delete("view");
      history.replaceState(null, "", url);
    }
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.view = mode;
  }, [mode]);

  const switcher = (tone: "dark" | "light") => (
    <ViewSwitcher mode={mode} narrow={narrow} onChange={setMode} tone={tone} />
  );

  return (
    <>
      {mode === "profile" ? (
        <Profile switcher={switcher("light")} onOpenBook={() => setMode("book")} />
      ) : (
        <Book
          chapters={CHAPTERS}
          forceSingle={mode === "single"}
          allowIntro={mode === "book"}
          switcher={switcher("dark")}
        />
      )}
      <CvModal />
    </>
  );
}
