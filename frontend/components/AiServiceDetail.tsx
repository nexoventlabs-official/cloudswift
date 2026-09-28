"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";
import AiSectionVisual from "@/components/ai-visuals/AiSectionVisual";
import FluidServiceImage from "@/components/FluidServiceImage";
import type { AgentLink, AgentPage } from "@/lib/agentPages";
import s from "./AiServiceDetail.module.css";

function zeroPad(n: number) {
  return String(n).padStart(2, "0");
}

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

function LinkedCopy({ text, links }: { text: string; links: AgentLink[] }) {
  const all = useMemo(() => {
    const seen = new Set<string>();
    return links.filter((l) => {
      const key = l.anchor.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [links]);

  const sorted = [...all].sort((a, b) => b.anchor.length - a.anchor.length);
  if (sorted.length === 0) return <>{text}</>;

          const pattern = new RegExp(
            `(${sorted.map((l) => l.anchor.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`,
            "gi"
          );
  const parts = text.split(pattern);

  return (
    <>
      {parts.map((part, i) => {
        const link = sorted.find(
          (l) => l.anchor.toLowerCase() === part.toLowerCase()
        );
        if (!link || !part) return <span key={i}>{part}</span>;
        const external = link.href.startsWith("http");
        return (
          <Link
            key={`${link.href}-${i}`}
            href={link.href}
            className={s.inlineLink}
            {...(external
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
          >
            {part}
          </Link>
        );
      })}
    </>
  );
}

export default function AiServiceDetail({ page }: { page: AgentPage }) {
  const [progress, setProgress] = useState(0);
  const [activeId, setActiveId] = useState("hero");
  const [hoveredStep, setHoveredStep] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const [heroGone, setHeroGone] = useState(false);

  const nav = useMemo(
    () =>
      [
        { id: "overview", label: "Overview" },
        { id: "challenges", label: "Business challenges" },
        { id: "definition", label: "What is it" },
        { id: "benefits", label: "What you get" },
        { id: "deliver", label: "What we deliver" },
        { id: "tech", label: "Technologies" },
        { id: "industries", label: "Industries" },
        { id: "process", label: "Our process" },
        { id: "architecture", label: "Architecture" },
        { id: "compliance", label: "Compliance" },
        { id: "why", label: "Why CloudSwift" },
        { id: "example", label: "Example" },
        { id: "faqs", label: "FAQs" },
        { id: "related", label: "Related" },
      ] as const,
    []
  );

  const allLinks = useMemo(
    () => [...page.internalLinks, ...page.externalLinks, ...page.related],
    [page]
  );

  useEffect(() => {
    const ids = ["hero", ...nav.map((n) => n.id)];
    const onScroll = () => {
      const el = document.documentElement;
      const pct =
        (el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100;
      setProgress(Math.min(100, Math.max(0, pct)));
      for (let i = ids.length - 1; i >= 0; i--) {
        const sec = document.getElementById(ids[i]);
        if (sec && sec.getBoundingClientRect().top <= window.innerHeight * 0.4) {
          setActiveId(ids[i]);
          break;
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [nav]);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => setHeroGone(!e.isIntersecting),
      { threshold: 0 }
    );
    if (heroRef.current) obs.observe(heroRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div className={s.root}>
      <div className={s.progressBar} style={{ width: `${progress}%` }} aria-hidden />

      <div ref={heroRef} className={s.hero} id="hero">
        <nav className={s.breadcrumb} aria-label="Breadcrumb">
          {(page.crumbs ?? [
            { name: "Home", href: "/" },
            { name: "AI Services", href: "/ai-services" },
            { name: page.title },
          ]).map((crumb, i, all) => (
            <span key={`${crumb.name}-${i}`}>
              {i > 0 ? " / " : null}
              {crumb.href && i < all.length - 1 ? (
                <Link href={crumb.href}>{crumb.name}</Link>
              ) : (
                crumb.name
              )}
            </span>
          ))}
        </nav>
        <div className={s.heroCategory}>{page.category}</div>
        <div className={s.heroSplit}>
          <div>
            <h1 className={`${s.heroTitle} ${page.h1 ? s.heroTitleLong : ""}`}>
              {page.h1 ?? page.title}
            </h1>
            <p className={s.heroLede}>{page.heroLede}</p>
            <div className={s.heroFooter}>
              <Link href={page.heroCta.href} className={s.bookLink}>
                {page.heroCta.label} ↗
              </Link>
              <Link href="/blog" className={s.bookLink}>
                check out our blogs →
              </Link>
            </div>
          </div>
          <figure className={s.heroVisual}>
            <FluidServiceImage
              src={page.image}
              alt={page.imageAlt}
              priority
            />
            {page.imageCaption ? (
              <figcaption className={s.heroCaption}>{page.imageCaption}</figcaption>
            ) : null}
          </figure>
        </div>
        <button
          className={s.scrollBtn}
          aria-label="Scroll to content"
          onClick={() => scrollToId("overview")}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      </div>

      <div className={`${s.contentHeader} ${heroGone ? s.contentHeaderVisible : ""}`}>
        <div className={s.contentHeaderLeft}>
          <span className={s.contentHeaderTitle}>{page.title}</span>
        </div>
        <div className={s.contentHeaderRight}>
          <Link href="/blog" className={s.contentHeaderLink}>Our Blogs →</Link>
          <Link href="/contact" className={s.contentHeaderBtn}>Book Now</Link>
        </div>
      </div>

      <div className={s.shell}>
        <aside className={s.opsRail} aria-label="Page sections">
          <div className={s.opsRailLabel}>// on this page</div>
          <ul>
            {nav.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className={`${s.opsLink} ${activeId === item.id ? s.opsLinkActive : ""}`}
                >
                  <span className={s.statusDot} />
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </aside>

        <div id="main-content" className={s.mainContent}>
          <label className={s.jumpWrap}>
            <span className={s.jumpLabel}>On this page</span>
            <select
              className={s.jumpSelect}
              value={nav.some((n) => n.id === activeId) ? activeId : "overview"}
              onChange={(e) => scrollToId(e.target.value)}
            >
              {nav.map((item) => (
                <option key={item.id} value={item.id}>{item.label}</option>
              ))}
            </select>
          </label>

          <section id="overview" className={s.section}>
            <div className={s.split}>
              <div className={s.splitCopy}>
                <div className={s.sectionKicker}>// 01 — overview</div>
                <h2 className={s.h2}>
                  {page.overviewHeading ?? "How the agent works in your team"}
                </h2>
                {page.overview.map((para) => (
                  <p key={para.slice(0, 48)} className={s.lede}>
                    <LinkedCopy text={para} links={allLinks} />
                  </p>
                ))}
                <nav className={s.linkRow} aria-label="Related resources">
                  {page.internalLinks.map((link) => (
                    <Link key={link.href + link.anchor} href={link.href} className={s.linkChip}>
                      {link.anchor}
                    </Link>
                  ))}
                </nav>
              </div>
              <div className={s.splitVisual}>
                <AiSectionVisual
                  catalogId={page.catalogId}
                  title={page.title}
                  slot="overview"
                />
              </div>
            </div>
          </section>

          <section id="challenges" className={s.section}>
            <div className={s.sectionKicker}>// 02 — the problem</div>
            <h2 className={s.h2}>Business challenges</h2>
            <p className={s.lede}>{page.challengesIntro}</p>
            <ol className={s.issueList}>
              {page.challenges.map((c) => (
                <li key={c.title} className={s.issueRow}>
                  <span className={s.issueTag}>{c.tag}</span>
                  <div>
                    <h3>{c.title}</h3>
                    <p>{c.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section id="definition" className={s.section}>
            <div className={s.split}>
              <div className={s.splitCopy}>
                <div className={s.sectionKicker}>// 03 — definition</div>
                <h2 className={s.h2}>What is {page.title}?</h2>
                {page.definition.map((para) => (
                  <p key={para.slice(0, 48)} className={s.lede}>
                    <LinkedCopy text={para} links={allLinks} />
                  </p>
                ))}
              </div>
              <div className={s.splitVisual}>
                <AiSectionVisual
                  catalogId={page.catalogId}
                  title={page.title}
                  slot="definition"
                />
              </div>
            </div>
          </section>

          <section id="benefits" className={s.section}>
            <div className={s.sectionKicker}>// 04 — outcomes</div>
            <h2 className={s.h2}>What you get</h2>
            <ol className={s.outcomes}>
              {page.benefits.map(([title, body]) => (
                <li key={title} className={s.outcome}>
                  <span className={s.outcomeTitle}>{title}</span>
                  <span className={s.outcomeLead} aria-hidden />
                  <span className={s.outcomeBody}>{body}</span>
                </li>
              ))}
            </ol>
          </section>

          <section id="deliver" className={s.section}>
            <div className={s.sectionKicker}>// 05 — scope</div>
            <h2 className={s.h2}>What we deliver</h2>
            <div className={s.bill}>
              <div className={s.billIn}>
                <div className={s.billMark} aria-hidden>IN</div>
                <div className={s.billHead}>In scope</div>
                <ol className={s.billList}>
                  {page.deliverIncluded.map((item, i) => (
                    <li key={item}>
                      <span className={s.billNum}>{zeroPad(i + 1)}</span>
                      <span className={s.billItem}>{item}</span>
                    </li>
                  ))}
                </ol>
              </div>
              <div className={s.billOut}>
                <div className={s.billMark} aria-hidden>OUT</div>
                <div className={s.billHead}>Out of scope</div>
                <ul className={s.billOutList}>
                  {page.deliverExcluded.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section id="tech" className={s.section}>
            <div className={s.sectionKicker}>// 06 — stack</div>
            <h2 className={s.h2}>Technologies</h2>
            <div className={s.tableWrap}>
              <table className={s.stackTable}>
                <thead>
                  <tr>
                    <th scope="col">Technology</th>
                    <th scope="col">Role</th>
                    <th scope="col">Use case</th>
                    <th scope="col">Benefit</th>
                  </tr>
                </thead>
                <tbody>
                  {page.techRows.map((row) => (
                    <tr key={row.layer}>
                      <th scope="row">{row.layer}</th>
                      <td>{row.role}</td>
                      <td>{row.useCase}</td>
                      <td>{row.benefit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className={s.techNote}>{page.techNote}</p>
          </section>

          <section id="industries" className={s.section}>
            <div className={s.sectionKicker}>// 07 — sectors</div>
            <h2 className={s.h2}>Industries</h2>
            <div className={s.sectorGrid}>
              {page.industries.map((ind, i) => (
                <article key={ind.label} className={s.sectorPanel}>
                  <div className={s.sectorNum}>{zeroPad(i + 1)}</div>
                  <div>
                    <h3>{ind.label}</h3>
                    <p>{ind.body}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section id="process" className={s.section}>
            <div className={s.sectionKicker}>// 08 — delivery</div>
            <h2 className={s.h2}>Our process</h2>
            <p className={s.processHint}>Select a stage to read how it runs.</p>
            <div
              className={s.process}
              style={{ ["--stops" as string]: String(page.steps.length) }}
            >
              <ol className={s.processLane}>
                {page.steps.map((step, i) => (
                  <li
                    key={step.title}
                    className={`${s.processStop} ${hoveredStep === i ? s.processStopHot : ""} ${i < hoveredStep ? s.processStopDone : ""}`}
                  >
                    <button
                      type="button"
                      className={s.processBtn}
                      onMouseEnter={() => setHoveredStep(i)}
                      onFocus={() => setHoveredStep(i)}
                      onClick={() => setHoveredStep(i)}
                    >
                      <span className={s.processName}>{step.title}</span>
                      <span className={s.processBeacon}>{zeroPad(i + 1)}</span>
                    </button>
                    {i < page.steps.length - 1 && <span className={s.processWire} aria-hidden />}
                  </li>
                ))}
              </ol>
              <div className={s.processReadout} aria-live="polite">
                <div className={s.processReadoutIndex} aria-hidden>
                  {zeroPad(hoveredStep + 1)}
                </div>
                <div className={s.processReadoutBody}>
                  <div className={s.processReadoutMeta}>
                    stage {zeroPad(hoveredStep + 1)}
                    <span> / {zeroPad(page.steps.length)}</span>
                  </div>
                  <h3>{page.steps[hoveredStep]?.title}</h3>
                  <p>{page.steps[hoveredStep]?.desc}</p>
                </div>
              </div>
            </div>
          </section>

          <section id="architecture" className={s.section}>
            <div className={s.sectionKicker}>// 09 — reference architecture</div>
            <h2 className={s.h2}>How it&apos;s built</h2>
            <figure className={s.archFigure}>
              <div className={s.archStack} role="img" aria-label={page.architectureCaption}>
                {page.architecture.map((layer, i) => {
                  const kind =
                    i === 0 || i === page.architecture.length - 1 ? s.archEnd : s.archCore;
                  return (
                    <div key={layer.role} className={s.archUnit}>
                      <div className={`${s.archBlock} ${kind}`}>
                        <div className={s.archBlockHead}>
                          <span className={s.archBlockIdx}>{zeroPad(i + 1)}</span>
                          <span className={s.archBlockRole}>{layer.role}</span>
                        </div>
                        <ul className={s.archPorts}>
                          {layer.nodes.map((node) => (
                            <li key={node}>{node}</li>
                          ))}
                        </ul>
                      </div>
                      {i < page.architecture.length - 1 && (
                        <div className={s.archJoin} aria-hidden>
                          <span className={s.archJoinLine} />
                          <svg width="14" height="10" viewBox="0 0 14 10">
                            <path d="M1 1l6 7 6-7" fill="none" stroke="currentColor" strokeWidth="1.5" />
                          </svg>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <figcaption className={s.diagramCaption}>{page.architectureCaption}</figcaption>
            </figure>
          </section>

          <section id="compliance" className={s.section}>
            <div className={s.sectionKicker}>// 10 — trust</div>
            <h2 className={s.h2}>Compliance &amp; security</h2>
            <div className={s.trustGrid}>
              {page.compliance.map((line) => (
                <article key={line.label} className={s.trustItem}>
                  <div className={s.trustMark}>in place</div>
                  <h3>{line.label}</h3>
                  <p>{line.desc}</p>
                </article>
              ))}
            </div>
          </section>

          <section id="why" className={s.section}>
            <div className={s.sectionKicker}>// 11 — differentiation</div>
            <h2 className={s.h2}>Why CloudSwift</h2>
            <div className={s.whyList}>
              {page.why.map((card) => (
                <article key={card.idx} className={s.whyItem}>
                  <div className={s.whyIdx}>{card.idx}</div>
                  <h3>{card.title}</h3>
                  <p>{card.desc}</p>
                </article>
              ))}
            </div>
          </section>

          <section id="example" className={s.section}>
            <div className={s.sectionKicker}>// 12 — illustration</div>
            <h2 className={s.h2}>Illustrative example</h2>
            <aside className={s.example}>
              <p className={s.exampleDisclaimer}>{page.example.disclaimer}</p>
              {page.example.body.map((para) => (
                <p key={para.slice(0, 40)}>{para}</p>
              ))}
            </aside>
          </section>

          <section id="faqs" className={s.section}>
            <div className={s.sectionKicker}>// 13 — questions</div>
            <h2 className={s.h2}>Frequently asked questions</h2>
            <div className={s.faqList}>
              {page.faqs.map((faq) => (
                <details key={faq.q} className={s.faqItem}>
                  <summary>{faq.q}</summary>
                  <p className={s.faqA}>{faq.a}</p>
                </details>
              ))}
            </div>
          </section>

          <section id="related" className={s.section}>
            <div className={s.sectionKicker}>// 14 — explore further</div>
            <h2 className={s.h2}>Keep exploring</h2>
            <div className={s.relatedGrid}>
              <div>
                <div className={s.relatedHeading}>Related services</div>
                {page.related.map((r) => (
                  <Link key={r.href + r.anchor} href={r.href} className={s.relatedLink}>
                    {r.anchor} →
                  </Link>
                ))}
              </div>
              <div>
                <div className={s.relatedHeading}>Resources</div>
                {page.internalLinks.map((r) => (
                  <Link key={r.href + r.anchor} href={r.href} className={s.relatedLink}>
                    {r.anchor} →
                  </Link>
                ))}
                {page.externalLinks.map((r) => (
                  <a
                    key={r.href}
                    href={r.href}
                    className={s.relatedLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {r.anchor} ↗
                  </a>
                ))}
              </div>
            </div>
            <div className={s.bottomCta}>
              <Link href="/contact" className={s.contentHeaderBtn}>
                {page.heroCta.label}
              </Link>
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
}
