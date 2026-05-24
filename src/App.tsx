import React from "react";
import { Book } from "./book/Book";
import {
  BuildingSpread,
  CoverSpread,
  IntroSpread,
  ResearchingSpread,
} from "./book/ChaptersFront";
import {
  AwardsSpread,
  CorrespondenceSpread,
  MarginaliaSpread,
  NowSpread,
  TeachingSpread,
} from "./book/ChaptersBack";
import "./styles/book.css";

const CHAPTERS = [
  { id: "cover", roman: "", title: "", spreads: [CoverSpread] },
  { id: "intro", roman: "I", title: "An introduction", spreads: [IntroSpread] },
  { id: "building", roman: "II", title: "On building", spreads: [BuildingSpread] },
  { id: "researching", roman: "III", title: "On researching", spreads: [ResearchingSpread] },
  { id: "teaching", roman: "IV", title: "On teaching", spreads: [TeachingSpread] },
  { id: "awards", roman: "V", title: "Awards & accidents", spreads: [AwardsSpread] },
  { id: "now", roman: "VI", title: "Currently", spreads: [NowSpread] },
  { id: "marginalia", roman: "VII", title: "Footnotes & marginalia", spreads: [MarginaliaSpread] },
  { id: "correspondence", roman: "VIII", title: "Correspondence", spreads: [CorrespondenceSpread] },
];

export default function App() {
  return <Book chapters={CHAPTERS} />;
}
