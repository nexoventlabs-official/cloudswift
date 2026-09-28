"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./WhyChooseCloudSwift.module.css";

const WHY_CHOOSE_SLIDES = [
  {
    image: "/images/cs/services/aboutnew.webp",
    logo: "/images/carvia-logo.png",
    eyebrow: "Cloud Migration / Client Story",
    heading: "What matters most is faster cloud migration",
    description: "A focused migration path helped the team move critical workloads with less disruption and a clearer route to scale.",
    link: "/blog/zero-downtime-ad-migration-lessons",
  },
  {
    image: "/images/cs/services/abouttwo.webp",
    logo: "/images/carvia-logo.png",
    eyebrow: "Managed Services / Client Story",
    heading: "What matters most is round-the-clock reliability",
    description: "24/7 monitoring and rapid incident response keep operations running without interruption, even during peak demand.",
    link: "/blog",
  },
  {
    image: "/images/cs/services/aboutthree.webp",
    logo: "/images/courto-logo.png",
    eyebrow: "Cloud Security / Client Story",
    heading: "What matters most is secure, compliant infrastructure",
    description: "A governed cloud foundation gives the team confidence to scale while staying audit-ready at every step.",
    link: "/blog",
  },
  {
    image: "/images/cs/services/aboutfour.webp",
    logo: "/images/driveon-logo.png",
    eyebrow: "AI & Automation / Client Story",
    heading: "What matters most is smarter automation",
    description: "AI-driven workflows reduce manual effort and give teams more time to focus on higher-value work.",
    link: "/blog/from-notebook-to-production-mlops-deployment",
  },
];

const HIGHLIGHTS = [
  {
    title: "Microsoft and cloud expertise",
    description: "Deep platform knowledge turns complex cloud decisions into a clear, workable path forward.",
  },
  {
    title: "Reliable when it matters",
    description: "99.97% uptime and a 15-minute critical response keep your operation moving with confidence.",
  },
  {
    title: "Builders who stay close",
    description: "Experienced engineers work alongside your team from first architecture sketch through long-term growth.",
  },
];

export default function WhyChooseCloudSwift() {
  const [activeIndex, setActiveIndex] = useState(0);
  const pauseUntil = useRef(0);
  const activeSlide = WHY_CHOOSE_SLIDES[activeIndex];
  const nextSlide = WHY_CHOOSE_SLIDES[(activeIndex + 1) % WHY_CHOOSE_SLIDES.length];

  const changeSlide = (index: number) => {
    pauseUntil.current = Date.now() + 2500;
    setActiveIndex((index + WHY_CHOOSE_SLIDES.length) % WHY_CHOOSE_SLIDES.length);
  };

  useEffect(() => {
    const autoplay = window.setInterval(() => {
      if (Date.now() >= pauseUntil.current) {
        setActiveIndex((currentIndex) => (currentIndex + 1) % WHY_CHOOSE_SLIDES.length);
      }
    }, 5500);

    return () => window.clearInterval(autoplay);
  }, []);

  const handleCardKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      window.location.href = activeSlide.link;
    }
  };

  return (
    <section className={styles.section} aria-labelledby="why-choose-heading">
      <div className={styles.headingBlock}>
        <p className="section-badge">WHY CLOUDSWIFT</p>
        <h2 id="why-choose-heading">Why Choose CloudSwift</h2>
      </div>

      <div className={styles.highlights}>
        {HIGHLIGHTS.map((highlight) => (
          <article key={highlight.title} className={styles.highlight}>
            <h3>{highlight.title}</h3>
            <p>{highlight.description}</p>
          </article>
        ))}
      </div>

      <div className={styles.carousel}>
        <div
          key={`image-${activeIndex}`}
          className={styles.imagePanel}
          style={{ backgroundImage: `url(${activeSlide.image})` }}
          aria-label={`${activeSlide.eyebrow} image`}
          role="img"
        />
        <div
          className={styles.storyCard}
          key={`story-${activeIndex}`}
          role="link"
          tabIndex={0}
          onClick={(event) => {
            if (!(event.target instanceof Element) || !event.target.closest("button, a")) {
              window.location.href = activeSlide.link;
            }
          }}
          onKeyDown={handleCardKeyDown}
        >
          <div className={styles.storyContent}>
            <Image
              className={styles.clientLogo}
              src={activeSlide.logo}
              alt="Client logo placeholder"
              width={78}
              height={34}
            />
            <p className={styles.clientLabel}>{activeSlide.eyebrow}</p>
            <h3>{activeSlide.heading}</h3>
            <p className={styles.description}>{activeSlide.description}</p>
            <Link className={styles.storyLink} href={activeSlide.link} onClick={() => { pauseUntil.current = Date.now() + 2500; }}>
              Learn more <span aria-hidden="true">↗</span>
            </Link>
          </div>

          <div className={styles.controls}>
            <div className={styles.arrowButtons}>
              <button type="button" onClick={() => changeSlide(activeIndex - 1)} aria-label="Previous story">
                <span aria-hidden="true">←</span>
              </button>
              <button type="button" onClick={() => changeSlide(activeIndex + 1)} aria-label="Next story">
                <span aria-hidden="true">→</span>
              </button>
            </div>
            <div className={styles.dots} aria-label="Choose a client story">
              {WHY_CHOOSE_SLIDES.map((slide, index) => (
                <button
                  key={slide.eyebrow}
                  className={index === activeIndex ? styles.activeDot : styles.dot}
                  type="button"
                  onClick={() => changeSlide(index)}
                  aria-label={`Show ${slide.eyebrow}`}
                  aria-current={index === activeIndex ? "true" : undefined}
                />
              ))}
            </div>
          </div>
        </div>

        <div className={styles.upNext}>
          <span>UP NEXT</span>
          <strong>{nextSlide.heading}</strong>
          <span className={styles.nextArrow} aria-hidden="true">→</span>
        </div>
      </div>
    </section>
  );
}