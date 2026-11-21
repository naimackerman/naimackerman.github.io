import React, { useEffect, useState } from "react";
import { PUBLICATIONS, PublicationAuthors, TYPE_LABEL, WORK } from "../book/ChaptersFront";
import { AWARDS, ContactForm, SOCIALS, SocialIcon } from "../book/ChaptersBack";
import { CV_URL, openCv } from "../CvModal";

// Profile view — the same content as the book, laid out as a plain
// one-page academic profile: identity card on the side, sections in the main column.

const SCHOLAR_URL = "https://scholar.google.com/citations?user=c9gt1_UAAAAJ";
const EMAIL = "nurahmadkhatim@gmail.com";

const SECTIONS = [
  ["about", "About"],
  ["publications", "Publications"],
  ["experience", "Experience"],
  ["honors", "Honors"],
  ["contact", "Contact"],
];

const INTERESTS = [
  "Clinical AI",
  "Explainable AI",
  "Medical imaging",
  "Decision-making under uncertainty",
  "Software engineering",
];

const PROFILE_LINKS = ["Google Scholar", "ORCID", "GitHub", "LinkedIn", "Medium"];

function scrollToSection(id) {
  document.getElementById(`pf-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function Section({ id, title, aside, children }) {
  return (
    <section id={`pf-${id}`} className="pf-section" aria-labelledby={`pf-${id}-h`}>
      <div className="pf-section-head">
        <h2 id={`pf-${id}-h`}>{title}</h2>
        {aside}
      </div>
      {children}
    </section>
  );
}

// Which section is under the header, for the nav highlight.
function useActiveSection() {
  const [active, setActive] = useState(SECTIONS[0][0]);
  useEffect(() => {
    const els = SECTIONS.map(([id]) => document.getElementById(`pf-${id}`)).filter(Boolean);
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id.slice(3)); });
    }, { rootMargin: "-35% 0px -60% 0px" });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return active;
}

export default function Profile({ switcher, onOpenBook }) {
  const active = useActiveSection();
  const totalCites = PUBLICATIONS.reduce((n, p) => n + (p.cites || 0), 0);
  const links = SOCIALS.filter(([name]) => PROFILE_LINKS.includes(name));

  return (
    <div className="pf-root">
      <header className="pf-header">
        <div className="pf-header-inner">
          <a className="pf-wordmark" href="#pf-top" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
            <span className="pf-accent">N</span>ur <span className="pf-accent">A</span>hmad Khat<span className="pf-accent">im</span>
          </a>
          <nav className="pf-nav" aria-label="Sections">
            {SECTIONS.map(([id, label]) => (
              <a key={id} href={`#pf-${id}`} className={active === id ? "active" : undefined} aria-current={active === id ? "true" : undefined} onClick={(e) => { e.preventDefault(); scrollToSection(id); }}>{label}</a>
            ))}
          </nav>
          <div className="pf-header-switch">{switcher}</div>
        </div>
      </header>

      <div className="pf-layout" id="pf-top">
        <aside className="pf-card">
          <img className="pf-photo" src="/images/naim-autumn-portrait.jpeg" alt="Nur Ahmad Khatim" />
          <div className="pf-card-body">
            <h1 className="pf-name">Nur Ahmad Khatim</h1>
            <div className="pf-aka">also known as Naim</div>
            <p className="pf-role">Software engineer &amp; clinical-AI researcher</p>
            <ul className="pf-affil">
              <li><strong>MEXT Scholar</strong>, Nara Institute of Science and Technology (from Oct 2026)</li>
              <li><strong>Research Assistant</strong>, KFUPM AI V&amp;V Lab (remote)</li>
            </ul>
            <div className="pf-actions">
              <a className="pf-btn pf-btn-solid" href={CV_URL} onClick={openCv} aria-haspopup="dialog">View CV</a>
              <a className="pf-btn" href={`mailto:${EMAIL}`}>Email</a>
            </div>
            <div className="pf-links" aria-label="Profiles elsewhere">
              {links.map(([name, , url]) => (
                <a key={name} href={url} target="_blank" rel="noopener noreferrer" title={name} aria-label={name}>
                  <SocialIcon name={name} />
                </a>
              ))}
            </div>
            <div className="pf-interests">
              <div className="pf-label">Interests</div>
              <div className="pf-chips">
                {INTERESTS.map((t) => <span key={t} className="pf-chip">{t}</span>)}
              </div>
            </div>
          </div>
        </aside>

        <main className="pf-main">
          <Section id="about" title="About">
            <p>
              Hi — I'm Naim. I write software and do research for a living. I'm pursuing a master's degree
              through the MEXT Scholarship at NAIST in Japan, where I'll work on mathematical modelling and
              clinical-AI research.
            </p>
            <p>
              I graduated in Informatics Engineering from Sepuluh Nopember Institute of Technology in Surabaya,
              worked at DataOn (2023–2025), contributed remotely to the Stanford Intelligent Systems Lab
              (2023–2024), and freelanced for the digital agency Suitmedia before that (2022–2023). Along the way
              I taught data structures and ran trainings for the student association.
            </p>
          </Section>

          <Section
            id="publications"
            title="Publications"
            aside={
              <div className="pf-stats">
                <span><strong>{PUBLICATIONS.length}</strong> papers</span>
                <span><strong>{totalCites}</strong> citations</span>
                <a href={SCHOLAR_URL} target="_blank" rel="noopener noreferrer">Google Scholar ↗</a>
              </div>
            }>
            <ol className="pf-pubs">
              {PUBLICATIONS.map((p) => (
                <li key={p.id} className="pf-pub">
                  <div className="pf-pub-main">
                    <a className="pf-pub-title" href={p.link} target="_blank" rel="noopener noreferrer">{p.title}</a>
                    {p.stamp && <span className="pf-badge">{p.stamp}</span>}
                    <div className="pf-pub-authors"><PublicationAuthors authors={p.authors} /></div>
                    <div className="pf-pub-venue">{p.venue} · {p.where}</div>
                    <details className="pf-pub-more">
                      <summary>Abstract</summary>
                      <p>{p.abstract}</p>
                      {p.keywords?.length > 0 && (
                        <div className="pf-chips">
                          {p.keywords.map((k) => <span key={k} className="pf-chip pf-chip-sm">{k}</span>)}
                        </div>
                      )}
                    </details>
                  </div>
                  <div className="pf-pub-side">
                    <span className="pf-pub-year">{p.year}</span>
                    <span className="pf-pub-cites">{p.cites} cite{p.cites === 1 ? "" : "s"}</span>
                  </div>
                </li>
              ))}
            </ol>
          </Section>

          <Section id="experience" title="Experience">
            <ol className="pf-exp">
              {WORK.map((w) => (
                <li key={w.id} className="pf-org">
                  <img className="pf-org-logo" src={w.logo} alt="" aria-hidden="true" />
                  <div className="pf-org-body">
                    <div className="pf-org-head">
                      <h3>{w.short}</h3>
                      <span className="pf-org-type">{TYPE_LABEL[w.type]}</span>
                    </div>
                    <div className="pf-org-where">{w.here}</div>
                    {w.positions.map((pos, i) => (
                      <div key={i} className="pf-pos">
                        <div className="pf-pos-head">
                          <strong>{pos.title}</strong>
                          <span>{pos.when}</span>
                        </div>
                        <p>{pos.body}</p>
                      </div>
                    ))}
                  </div>
                </li>
              ))}
            </ol>
          </Section>

          <Section id="honors" title="Honors & awards">
            <ul className="pf-honors">
              {AWARDS.map((a, i) => (
                <li key={i}>
                  <span className="pf-honor-year">{a.year}</span>
                  <div>
                    <div className="pf-honor-title">{a.title}</div>
                    <div className="pf-honor-org">{a.org}</div>
                  </div>
                </li>
              ))}
            </ul>
          </Section>

          <Section id="contact" title="Contact">
            <p>I read everything and usually reply within 48 hours — clinical-AI projects, odd datasets and mentorship are all welcome.</p>
            <div className="pf-contact">
              <div className="pf-socials">
                {SOCIALS.map(([name, handle, url]) => (
                  <a key={name} className="pf-social" href={url} target="_blank" rel="noopener noreferrer">
                    <span className="pf-social-icon"><SocialIcon name={name} /></span>
                    <span className="pf-social-text">
                      <strong>{name}</strong>
                      <small>{handle}</small>
                    </span>
                  </a>
                ))}
              </div>
              <div className="pf-form">
                <div className="pf-label">Write me a message</div>
                <ContactForm />
              </div>
            </div>
          </Section>

          <footer className="pf-footer">
            <span>© {new Date().getFullYear()} Nur Ahmad Khatim</span>
            <button type="button" className="pf-linkbtn" onClick={onOpenBook}>Prefer the book? Open it →</button>
          </footer>
        </main>
      </div>
    </div>
  );
}
