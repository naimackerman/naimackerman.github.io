import React from "react";
import { BookCtx, DoodleArrow, Fn, Page, PhotoFig, Stamp, Whisper } from "./Book";
import { CV_URL, openCv } from "../CvModal";

// Chapters: cover, intro, building (interactive), researching.

const { useContext: useCtxF } = React;

function getJapanSeasonEdition() {
  const tokyoParts = new Intl.DateTimeFormat("en-US", {
    month: "numeric",
    year: "numeric",
    timeZone: "Asia/Tokyo",
  }).formatToParts(new Date());
  const month = Number(tokyoParts.find(({ type }) => type === "month").value);
  const year = tokyoParts.find(({ type }) => type === "year").value;
  const seasons = ["winter", "spring", "summer", "autumn"];
  const season = seasons[Math.floor((month % 12) / 3)];

  return `${season} ${year}`;
}

// ════════════════════════════════════════════════════════════════════════════
// COVER + TOC
// ════════════════════════════════════════════════════════════════════════════

function CoverSpread() {
  const ctx = useCtxF(BookCtx);
  const edition = getJapanSeasonEdition();
  const toc = [
    ["I.",   "An introduction",        "in which I tell you who I am",            "03", "intro"],
    ["II.",  "On building",            "my career path, so far",                  "05", "building"],
    ["III.", "On researching",         "publications & research interests",       "07", "researching"],
    ["IV.",  "Honors & awards",        "competitions, grants, scholarships",      "09", "awards"],
    ["V.",   "Correspondence",         "say hi · sign the guestbook",             "11", "correspondence"],
  ];

  return (
    <>
      {/* — Left page: title — */}
      <Page side="left" runLeft="nurahmadkhatim.github.io" runRight="cover" num="i">
        <div className="cover-sheet" style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div className="smallcaps cover-volume" style={{ color: "var(--mute)", marginBottom: 8 }}>volume one · {edition}</div>
          <h1 className="display cover-title" style={{ fontSize: 60, margin: 0, lineHeight: 0.92, letterSpacing: "-0.025em" }}>
            <span style={{ color: "var(--accent)" }}>N</span>ur <span style={{ color: "var(--accent)" }}>A</span>hmad<br/>
            Khat<span style={{ color: "var(--accent)" }}>im</span>
          </h1>
          <p className="cover-standfirst" style={{ fontFamily: "'Newsreader', serif", fontStyle: "italic", fontSize: 17, lineHeight: 1.5, color: "var(--ink-soft)", margin: "8px 0 0", maxWidth: 430 }}>
            Software engineer &amp; clinical-AI researcher — a brief book about me.
          </p>
          <div className="hand cover-note" style={{ fontSize: 19, marginTop: 6, color: "var(--ink-soft-2)" }}>
            — also known as <em>Naim</em>.
          </div>

          <div className="cover-photo-row" style={{ display: "flex", gap: 20, alignItems: "center", marginTop: 8 }}>
            <PhotoFig src="/images/naim-autumn-portrait.jpeg" w={90} rotate={-3} />
            <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-start" }}>
              <div className="cover-caption" style={{ fontFamily: "'Newsreader', serif", fontSize: 13, color: "var(--ink-soft)", maxWidth: 230, fontStyle: "italic" }}>
                <em>fig. 1 —</em> the author.
              </div>
              <div className="cover-stamps">
                <Stamp rotate={-3}>on study · Nara, Japan</Stamp>
              </div>
            </div>
          </div>

          <div className="hurry-slip">
            <div>
              <div className="smallcaps" style={{ color: "var(--accent)", marginBottom: 4 }}>in a hurry?</div>
              <div style={{ fontFamily: "'Newsreader', serif", fontSize: 14, fontStyle: "italic", color: "var(--ink-soft)" }}>just click.</div>
            </div>
            <div className="cv-actions">
              <a className="btn-ink" href={CV_URL} onClick={openCv} aria-haspopup="dialog">cv</a>
              <a className="btn-ink btn-paper" href="mailto:nurahmadkhatim@gmail.com">email</a>
              <a className="btn-ink btn-paper" href="https://scholar.google.com/citations?user=c9gt1_UAAAAJ" target="_blank" rel="noopener noreferrer">scholar</a>
            </div>
          </div>
        </div>
      </Page>

      {/* — Right page: TOC — */}
      <Page side="right" runLeft="contents" runRight="nurahmadkhatim.github.io" num="ii">
        <h2 className="display" style={{ fontSize: 42, margin: "0 0 12px" }}>What's<br/>inside</h2>

        <ol style={{ listStyle: "none", padding: 0, margin: 0, fontSize: 15, lineHeight: 1.6 }}>
          {toc.map(([rn, title, sub, pg, id]) => (
            <li key={id}
                className="toc-item"
                role="button"
                tabIndex={0}
                onClick={() => ctx.goto(id)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); ctx.goto(id); } }}
                style={{ display: "grid", gridTemplateColumns: "42px 1fr auto", gap: 10, alignItems: "baseline", borderBottom: "1px dotted rgba(0,0,0,0.22)", padding: "11px 12px 11px 8px", cursor: "pointer", borderRadius: 2 }}>
              <span style={{ fontStyle: "italic", color: "var(--mute)" }}>{rn}</span>
              <span>
                <span className="toc-title" style={{ color: "var(--ink)" }}>{title}</span>
                <span style={{ color: "var(--mute)", fontSize: 13, fontStyle: "italic" }}> — {sub}</span>
              </span>
              <span style={{ fontFamily: "'Newsreader', serif", fontVariantNumeric: "oldstyle-nums", color: "var(--mute)" }}>{pg}</span>
            </li>
          ))}
        </ol>

        <div className="marg" style={{ fontSize: 19, marginTop: 8, color: "var(--ink-soft)" }}>
          ↑ click a chapter, or press <span className="kbd" style={{ color: "var(--accent)" }}>→</span> and let the pages turn.
        </div>

        <div style={{ marginTop: "auto", display: "flex", justifyContent: "flex-end", alignItems: "baseline" }}>
          <span className="hand acc" style={{ color: "var(--accent)", fontSize: 22 }}>turn the page →</span>
        </div>
      </Page>
    </>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// I · INTRODUCTION
// ════════════════════════════════════════════════════════════════════════════

function IntroSpread() {
  return (
    <>
      <Page side="left">
        <div className="chapter-no">Chapter I</div>
        <h2 className="chapter-title">An introduction.</h2>

        <p className="bodytext drop-cap">
          Hi — I'm <strong>Naim</strong><Fn n={1} />. I write software and do research study for a living. Most days I'm somewhere between <Whisper align="left" say="ewakopedia.com, ~10 projects">a stack of projects</Whisper> and a half-finished <Whisper align="left" say="currently: an explainable AI thing">research notebook</Whisper>, and I like it that way. And now, I'm pursuing my master's degree through the <Whisper align="left" say="Monbukagakusho, a fully funded program by the Japanese government">MEXT Scholarship U2U</Whisper> at <Whisper align="left" say="Nara Institute of Science and Technology">NAIST</Whisper> in Japan, where I will learn more about mathematical modeling and clinical-AI research.
        </p>

        <p className="bodytext">
          I graduated in Informatics Engineering from <em>Sepuluh Nopember Institute of Technology</em> in Surabaya, worked at <Whisper align="left" say="A Trusted HRIS Partner for Over 20 Years in Southeast Asia">DataOn</Whisper> (2023–2025), contributed remotely to the <em>Stanford Intelligent Systems Lab</em> (SISL, 2023–2024), and freelanced for <Whisper align="left" say="suitmedia.com">Suitmedia</Whisper>, a digital agency, before any of that (2022–2023). Along the way I taught data structures and ran trainings for the student association.
        </p>

        <p className="bodytext">
          This site is a small attempt at making all of that legible — to recruiters, to collaborators, to mentees, and honestly, to future-me. Treat it like a book: read in any order, dog-ear the corners, and sign the guestbook on your way out.
        </p>
      </Page>

      <Page side="right" footnotes={{
        items: [
          <>Short for <em>Nur Ahmad Khatim</em>. Naim is what people call me.</>,
        ],
      }}>
        <div className="smallcaps" style={{ color: "var(--mute)", marginBottom: 8 }}>at this very moment</div>
        <h3 className="display" style={{ fontSize: 36, margin: "0 0 16px" }}>I am, currently,</h3>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <div className="now-cell">
            <div className="label">BUILDING</div>
            <div className="val">a Go + React thing for international journals and boarding schools.</div>
            <div className="sub">— journal.oscm-forum.org, immim.sch.id</div>
          </div>
          <div className="now-cell">
            <div className="label">READING</div>
            <div className="val">"Secrets of Divine Love: A Spiritual Journey Into the Heart of Islam"</div>
            <div className="sub">— just started</div>
          </div>
          <div className="now-cell">
            <div className="label">LEARNING</div>
            <div className="val">Sparse Autoencoder</div>
            <div className="sub">— integrating it into the current research</div>
          </div>
          <div className="now-cell">
            <div className="label">LISTENING</div>
            <div className="val">Justin Bieber · WALKING AWAY</div>
            <div className="sub">— good for vibing</div>
          </div>
        </div>

        <div style={{ marginTop: 18, padding: "14px 16px", border: "1px solid var(--accent)", background: "var(--accent-soft)", borderRadius: 2 }}>
          <div className="smallcaps" style={{ color: "var(--accent)", marginBottom: 6 }}>this week, specifically</div>
          <div className="bodytext" style={{ fontSize: 14, margin: 0 }}>
            Trying to understand what our neural network sees when it detects knee osteoarthritis. And also preparing for our research paper draft of mech interp.
          </div>
        </div>

        <div className="marg" style={{ marginTop: "auto", color: "var(--ink-soft)", paddingTop: 16 }}>
          ↑ this panel updates ~weekly. if it's stale, please yell at me.
        </div>
      </Page>
    </>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// II · ON BUILDING — interactive list + timeline
// ════════════════════════════════════════════════════════════════════════════

const WORK = [
  {
    id: "aivnv", short: "KFUPM AI V&V Lab", logo: "/images/logo-aivnv.png",
    type: "research", here: "remote · 2026–present",
    summary: "Researching human-robot co-dispatch planning & explainable AI for knee osteoarthritis.",
    positions: [{
      title: "Research Assistant",
      when: "Jan 2026 — present",
      body: "Developed an optimization model for human-robot co-dispatch planning in petroleum-site surveillance under varying task criticalities and collaborated research on an explainable AI (XAI) framework for automatic Kellgren-Lawrence grading of knee osteoarthritis.",
    }],
  },
  {
    id: "dataon", short: "DataOn", logo: "/images/logo-dataon.png",
    type: "work", here: "South Tangerang · 2023–2025",
    summary: "HRIS for 21 clients. ~25 tickets a month, debugged calmly.",
    positions: [{
      title: "Software Maintenance Staff JR.",
      when: "Nov 2023 — Apr 2025",
      body: "Supported 21 client projects on the company's HRIS application. Resolved ~25 software issues a month — debugging, code fixes, lots of close work with client-success and infra. Also ran user training so non-engineers could get the most out of the system.",
    }],
  },
  {
    id: "sisl", short: "Stanford SISL", logo: "/images/logo-sisl.png",
    type: "research", here: "remote · 2023–2024",
    summary: "Co-authored a paper on stroke diagnosis under uncertainty.",
    positions: [{
      title: "Research Assistant",
      when: "Oct 2023 — Jan 2024",
      body: "Worked with the Stanford Intelligent Systems Laboratory (SISL) on an integrated decision-making framework for stroke diagnosis using DSA. The paper was accepted at IMIP 2024 in Bali.",
    }],
  },
  {
    id: "suitmedia", short: "Suitmedia", logo: "/images/logo-suitmedia.png",
    type: "work", here: "remote · 2022–2023",
    summary: "Built features for a trading-ops web app. Shipped a lot.",
    positions: [
      { title: "Software Engineer (Freelance)", when: "Dec 2022 — Oct 2023", body: "Shipped new features and maintained existing ones. Worked closely with account managers and QA to ship things clients actually wanted. Spent time optimizing & reviewing for stability." },
      { title: "Software Engineer Intern",      when: "Jul 2022 — Dec 2022", body: "Built and tested features on a Trading Operations Support System web app. Learned a lot about what 'production-ready' actually means." },
    ],
  },
  {
    id: "bangkit", short: "Bangkit Academy", logo: "/images/logo-bangkit.png",
    type: "study", here: "google × tokopedia × gojek × traveloka · 2022",
    summary: "Mobile dev cohort. Built Relasia with a small team.",
    positions: [{
      title: "Mobile Development Cohort",
      when: "Feb 2022 — Jul 2022",
      body: "Completed the Android developer learning path and collaborated on Relasia — an app pairing volunteers with people who need help, using ML on Google Cloud.",
    }],
  },
  {
    id: "its", short: "ITS (Informatics)", logo: "/images/logo-its-3.png",
    type: "teach", here: "Surabaya · 2021–2022",
    summary: "Teaching assistant for Data Structures. Two cohorts, 72 students.",
    positions: [
      { title: "Data Structures TA", when: "Feb 2022 — Jun 2022", body: "Ran biweekly lab sessions for 36 students. Office hours, mentoring, the whole thing." },
      { title: "Data Structures TA", when: "Mar 2021 — Jul 2021", body: "Same role, year before. 36 students again. Different problem sets, same enthusiasm." },
    ],
  },
  {
    id: "hmtc", short: "HMTC (student assoc.)", logo: "/images/logo-hmtc.jpg",
    type: "volunteer", here: "ITS · 2021–2023",
    summary: "Co-led SRD dept. Trained 100s on event & self-management.",
    positions: [
      { title: "Co-Head, Student Resource Development", when: "Mar 2022 — Jan 2023", body: "Led the dept., ran regeneration initiatives, owned the calendar." },
      { title: "Student Managerial Trainer",            when: "Sep 2021 — Jul 2023", body: "Delivered self-management & event-management trainings. Got pretty good at standing in front of people." },
      { title: "Programming Instructor (HMTC GTS)",     when: "Sep 2021",            body: "Taught C/C++ to 25 high-school students for HMTC Goes To School program." },
    ],
  },
];

const TYPE_LABEL = { work: "industry", research: "research", teach: "teaching", study: "study", volunteer: "volunteer" };

function BuildingSpread() {
  const { spreadData, updateSpreadData } = useCtxF(BookCtx);
  const sel = spreadData.selectedWork || "aivnv";
  const setSel = (id) => updateSpreadData({ selectedWork: id });
  const org = WORK.find(w => w.id === sel);

  return (
    <>
      <Page side="left">
        <div className="chapter-no">Chapter II</div>
        <h2 className="chapter-title">On building.</h2>

        <p className="bodytext" style={{ fontSize: 14, color: "var(--ink-soft)", flexShrink: 0 }}>
          Click a name to read the timeline on the next page. The list scrolls; the detail does too. <Whisper say="oldest first, newest last">→</Whisper>
        </p>

        <div className="scroll-region" style={{ marginTop: 12 }}>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
            {WORK.map(w => (
              <li key={w.id}
                  className="org-card"
                  role="button"
                  tabIndex={0}
                  aria-pressed={sel === w.id}
                  onClick={() => setSel(w.id)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); setSel(w.id); } }}
                  style={{
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "10px 12px",
                    border: "1px solid " + (sel === w.id ? "var(--accent)" : "rgba(0,0,0,0.15)"),
                    background: sel === w.id ? "var(--accent-soft)" : "rgba(255,255,255,0.25)",
                    borderRadius: 2,
                  }}>
                <img className="org-logo org-logo-md" src={w.logo} alt="" aria-hidden="true" />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 8 }}>
                    <strong style={{ fontFamily: "'Newsreader', serif", fontWeight: 600, color: sel === w.id ? "var(--accent)" : "var(--ink)" }}>{w.short}</strong>
                    <span className="mono" style={{ fontSize: 11, color: "var(--mute-strong)" }}>{TYPE_LABEL[w.type]}</span>
                  </div>
                  <div style={{ fontFamily: "'Newsreader', serif", fontSize: 13, color: "var(--ink-soft)", fontStyle: "italic", marginTop: 2 }}>{w.summary}</div>
                  <div className="mono" style={{ fontSize: 11, color: "var(--mute-strong)", marginTop: 4 }}>{w.here}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Page>

      <Page side="right" runRight="II · on building" pinned={
        <div className="marg" style={{ color: "var(--ink-soft)" }}>
          ← pick another from the list.<br/>
          both sides scroll independently.
        </div>
      }>
        <div style={{ flexShrink: 0 }}>
          <div className="smallcaps" style={{ color: "var(--mute)" }}>{TYPE_LABEL[org.type]}</div>
          <h3 className="display" style={{ fontSize: 30, margin: "4px 0 4px", color: "var(--ink)" }}>{org.short}</h3>
          <div className="mono" style={{ fontSize: 11, color: "var(--mute)" }}>{org.here}</div>
        </div>

        <div className="scroll-region" style={{ marginTop: 18, paddingLeft: 18 }}>
          <div style={{ position: "relative", paddingLeft: 22, borderLeft: "1.5px solid var(--ink-soft)" }}>
            {org.positions.map((p, i) => (
              <div key={i} style={{ position: "relative", paddingBottom: 22 }}>
                <div style={{ position: "absolute", left: -28, top: 6, width: 10, height: 10, borderRadius: "50%", background: "var(--accent)", border: "2px solid var(--paper)" }} />
                <div style={{ fontFamily: "'Newsreader', serif", fontWeight: 600, fontSize: 17, color: "var(--ink)" }}>{p.title}</div>
                <div className="mono" style={{ fontSize: 11, color: "var(--accent)", margin: "2px 0 8px", letterSpacing: "0.1em" }}>{p.when}</div>
                <div className="bodytext" style={{ fontSize: 14, lineHeight: 1.55 }}>{p.body}</div>
              </div>
            ))}
          </div>
        </div>
      </Page>
    </>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// III · ON RESEARCHING — publications
// ════════════════════════════════════════════════════════════════════════════

// TODO: replace DUMMY_ABSTRACT with each paper's real abstract.
const DUMMY_ABSTRACT =
  "Placeholder abstract. This paragraph will summarise the problem the paper tackles, the approach we took, " +
  "the data it was evaluated on, and the headline result — written for a curious reader rather than a reviewer. " +
  "Until then, the full paper is one click away below.";

// Newest first — the top entry is the one opened by default.
const PUBLICATIONS = [
  {
    id: "knee-xrai",
    title: "Knee-xRAI: An Explainable AI Framework for Automatic Kellgren-Lawrence Grading of Knee Osteoarthritis",
    authors: "Azmul A. Irfan, NA Khatim, Alfan A. Irfan, A Zaki, EA Suwarsono, MM Arief",
    venue: "arXiv preprint",
    where: "arXiv:2604.23435",
    year: "2026", cites: 0,
    link: "https://arxiv.org/abs/2604.23435",
    abstract: DUMMY_ABSTRACT,
    keywords: ["explainable AI", "knee osteoarthritis", "Kellgren-Lawrence grading"],
    note: "currently my main research interest.",
    stamp: "new",
  },
  {
    id: "co-dispatch",
    title: "Optimized Human-Robot Co-Dispatch Planning for Petro-Site Surveillance under Varying Criticalities",
    authors: "NA Khatim, M Arief",
    venue: "INCOSE IS 2026",
    where: "Yokohama, JP · arXiv:2602.07924",
    year: "2026", cites: 0,
    link: "https://arxiv.org/abs/2602.07924",
    abstract: DUMMY_ABSTRACT,
    keywords: ["human-robot teaming", "dispatch optimization", "surveillance"],
    note: "a small detour from healthcare to field robots.",
    // stamp: "poster",
  },
  {
    id: "epuskesmas",
    title: "Using LLM for Real-Time Transcription and Summarization of Doctor-Patient Interactions into ePuskesmas in Indonesia: A Proof-of-Concept Study",
    authors: "NA Khatim, AA Irfan, MM Arief",
    venue: "arXiv preprint",
    where: "arXiv:2409.17054",
    year: "2024", cites: 7,
    link: "https://arxiv.org/abs/2409.17054",
    abstract: DUMMY_ABSTRACT,
    keywords: ["large language models", "speech-to-text", "primary care"],
    note: "presented at IMMaN online; won best-paper presentation.",
  },
  {
    id: "stroke-dsa",
    title: "Toward an Integrated Decision-Making Framework for Optimized Stroke Diagnosis with DSA and Treatment under Uncertainty",
    authors: "NA Khatim, AAA Irfan, AM Hayah, MM Arief",
    venue: "IMIP '24",
    where: "ACM · pp. 41–49",
    year: "2024", cites: 1,
    link: "https://dl.acm.org/doi/abs/10.1145/3669828.3669835",
    abstract: DUMMY_ABSTRACT,
    keywords: ["decision-making under uncertainty", "stroke", "DSA"],
    note: "accepted on a conference. it was in Bali.",
    // stamp: "best paper",
  },
  {
    id: "eeg-1dcnn",
    title: "1D-CNN Implementation for Automatic Epilepsy Detection in EEG Signals based on Interictal Epileptiform Discharge (IED)",
    authors: "NA Khatim",
    venue: "Undergrad thesis",
    where: "ITS · repository",
    year: "2023", cites: 0,
    link: "https://repository.its.ac.id/99533/",
    abstract: DUMMY_ABSTRACT,
    keywords: ["1D-CNN", "EEG", "epilepsy detection"],
    note: "where most of it started.",
  },
];

// Icon buttons on the paper detail page, shown for whichever of these fields a
// paper has: `link` (the paper), `website` (project page), `github` (code).
const PAPER_LINKS = [
  ["link", "Read the paper", (
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" /><path d="M14 3v5h5M9 13h6M9 17h4" /></svg>
  )],
  ["website", "Project website", (
    <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 2.6 3.7 5.6 3.7 9s-1.2 6.4-3.7 9c-2.5-2.6-3.7-5.6-3.7-9S9.5 5.6 12 3z" /></svg>
  )],
  ["github", "Code on GitHub", (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="filled"><path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58 0-.29-.01-1.04-.02-2.05-3.34.73-4.04-1.61-4.04-1.61-.55-1.38-1.33-1.75-1.33-1.75-1.09-.74.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5 1 .11-.78.42-1.3.76-1.6-2.66-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.31-.54-1.52.12-3.17 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6.01 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.65.24 2.86.12 3.17.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.62-5.49 5.92.43.37.81 1.1.81 2.22 0 1.6-.01 2.89-.01 3.28 0 .32.22.7.83.58A12 12 0 0 0 24 12.5C24 5.87 18.63.5 12 .5z" /></svg>
  )],
];

function PublicationAuthors({ authors }) {
  return authors.split(/(NA Khatim)/g).map((name, i) =>
    name === "NA Khatim" ? <strong key={i}>{name}</strong> : name
  );
}

function ResearchingSpread() {
  const { spreadData, updateSpreadData } = useCtxF(BookCtx);
  const sel = spreadData.selectedPaper || PUBLICATIONS[0].id;
  const setSel = (id) => updateSpreadData({ selectedPaper: id });
  const paper = PUBLICATIONS.find((p) => p.id === sel) || PUBLICATIONS[0];

  return (
    <>
      <Page side="left">
        <div className="chapter-no">Chapter III</div>
        <h2 className="chapter-title">On researching.</h2>
        <p className="bodytext drop-cap">
          A few papers, written from 2023. They're all loosely about <Whisper say="brains, knee, hospitals, & decision-making under uncertainty">the same thing</Whisper>: how to make medical decisions a little less anxious — for the doctor, the patient, and the model in between.
        </p>
        <p className="bodytext">
          I'm working toward becoming a full-time researcher. Along the way, I've completed papers in this area with mentors from <em>Stanford SISL</em>, clinicians in Indonesia, and collaborators generous with their questions.
        </p>

        <div className="marg" style={{ color: "var(--ink-soft)", marginTop: 14, flexShrink: 0 }}>
          → pick a paper to read its abstract on the next page.
        </div>

        <div className="scroll-region" style={{ paddingTop: 8 }}>
          <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
            {PUBLICATIONS.map((p) => (
              <li key={p.id}
                  className="pub-item"
                  role="button"
                  tabIndex={0}
                  aria-pressed={sel === p.id}
                  onClick={() => setSel(p.id)}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setSel(p.id); } }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8 }}>
                  <span className="mono pub-year" style={{ fontSize: 11, color: "var(--accent)" }}>{p.year}</span>
                  {p.stamp && <Stamp rotate={4} style={{ fontSize: 9, padding: "3px 7px" }}>{p.stamp}</Stamp>}
                </div>
                <span className="publication-title" style={{ fontFamily: "'Newsreader', serif", fontSize: 14, display: "inline-block", marginTop: 3 }}>
                  {p.title}
                </span>
                <div style={{ fontFamily: "'Newsreader', serif", fontSize: 11, color: "var(--ink-soft)", marginTop: 3, fontStyle: "italic" }}><PublicationAuthors authors={p.authors} /></div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8, marginTop: 3 }}>
                  <span className="mono" style={{ fontSize: 11, color: "var(--mute-strong)" }}>{p.venue} · {p.where}</span>
                  <span className="mono" style={{ fontSize: 11, color: p.cites > 0 ? "var(--accent)" : "var(--mute-strong)", whiteSpace: "nowrap" }}>{p.cites} cite{p.cites === 1 ? "" : "s"}</span>
                </div>
                <div className="hand" style={{ fontSize: 16, color: "var(--ink-soft)", marginTop: 1 }}><DoodleArrow /> {p.note}</div>
              </li>
            ))}
          </ol>
        </div>
      </Page>

      <Page side="right" runRight="III · papers" pinned={
        <div className="marg" style={{ color: "var(--ink-soft)" }}>
          ← pick another paper from the list.<br/>
          <span style={{ fontSize: 17 }}>the full list lives on <a className="ink-link" href="https://scholar.google.com/citations?user=c9gt1_UAAAAJ" target="_blank" rel="noopener noreferrer">Google Scholar</a>.</span>
        </div>
      }>
        <div style={{ flexShrink: 0 }}>
          <div className="smallcaps" style={{ color: "var(--mute)" }}>{paper.venue} · {paper.year}</div>
          <h3 className="display" style={{ fontSize: 24, lineHeight: 1.12, margin: "6px 0 8px", color: "var(--ink)" }}>{paper.title}</h3>
          <div style={{ fontFamily: "'Newsreader', serif", fontSize: 13, color: "var(--ink-soft)", fontStyle: "italic" }}><PublicationAuthors authors={paper.authors} /></div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8, marginTop: 6 }}>
            <span className="mono" style={{ fontSize: 11, color: "var(--mute-strong)" }}>{paper.where}</span>
            <span className="mono" style={{ fontSize: 11, color: paper.cites > 0 ? "var(--accent)" : "var(--mute-strong)", whiteSpace: "nowrap" }}>{paper.cites} cite{paper.cites === 1 ? "" : "s"}</span>
          </div>
        </div>

        <div className="smallcaps" style={{ color: "var(--mute)", marginTop: 20, marginBottom: 6 }}>abstract</div>
        <p className="bodytext" style={{ fontSize: 14.5, lineHeight: 1.65, margin: 0 }}>{paper.abstract}</p>

        {paper.keywords?.length > 0 && (
          <>
            <div className="smallcaps" style={{ color: "var(--mute)", marginTop: 18, marginBottom: 8 }}>keywords</div>
            <div className="pub-keywords">
              {paper.keywords.map((k) => <span key={k} className="pub-keyword">{k}</span>)}
            </div>
          </>
        )}

        <div className="hand" style={{ fontSize: 19, color: "var(--ink-soft)", marginTop: 16 }}><DoodleArrow /> {paper.note}</div>

        <div className="pub-actions" aria-label="Paper links">
          {PAPER_LINKS.filter(([key]) => paper[key]).map(([key, label, icon]) => (
            <a key={key} className="pub-action" href={paper[key]} target="_blank" rel="noopener noreferrer" title={label} aria-label={label}>
              {icon}
            </a>
          ))}
        </div>
      </Page>
    </>
  );
}

export { WORK, TYPE_LABEL, PUBLICATIONS, PublicationAuthors };
export { CoverSpread, IntroSpread, BuildingSpread, ResearchingSpread };
