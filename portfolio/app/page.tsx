"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { useLocale } from "./i18n";
import ParticleField from "./components/ParticleField";
import CustomCursor from "./components/CustomCursor";
import TiltCard from "./components/TiltCard";
import Preloader from "./components/Preloader";

/* ================================================================
   SCROLL PROGRESS BAR
   ================================================================ */
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const [progress, setProgress] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => setProgress(v));

  return (
    <div
      className="scroll-progress"
      style={{ width: `${progress * 100}%` }}
    />
  );
}

/* ================================================================
   SCROLL REVEAL WRAPPER
   ================================================================ */
function ScrollReveal({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ================================================================
   NAVBAR
   ================================================================ */
function Navbar() {
  const [open, setOpen] = useState(false);
  const { locale, setLocale, t } = useLocale();

  const links = [
    { label: t("nav.about"), href: "#about" },
    { label: t("nav.skills"), href: "#skills" },
    { label: t("nav.awards"), href: "#awards" },
    { label: t("nav.projects"), href: "#projects" },
    { label: t("nav.contact"), href: "#contact" },
  ];

  return (
    <motion.nav
      className="navbar"
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="navbar-inner">
        <a href="#" className="navbar-logo">
          khoa<span>.dev</span>
        </a>

        <ul className={`navbar-links ${open ? "open" : ""}`}>
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} onClick={() => setOpen(false)}>
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="navbar-right">
          <button
            className="lang-toggle"
            onClick={() => setLocale(locale === "en" ? "vi" : "en")}
            aria-label="Toggle language"
          >
            <span className={locale === "en" ? "active" : ""}>EN</span>
            <span className="lang-divider">/</span>
            <span className={locale === "vi" ? "active" : ""}>VI</span>
          </button>

          <button
            className="mobile-menu-btn"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? "✕" : "☰"}
          </button>
        </div>
      </div>
    </motion.nav>
  );
}

/* ================================================================
   HERO
   ================================================================ */
function Hero() {
  const { t } = useLocale();

  const phrases = [
    t("hero.typing.0"),
    t("hero.typing.1"),
    t("hero.typing.2"),
    t("hero.typing.3"),
  ];
  const [current, setCurrent] = useState(0);
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setText("");
    setCurrent(0);
    setIsDeleting(false);
    setIsPaused(false);
  }, [phrases[0]]); // reset when locale changes

  useEffect(() => {
    const phrase = phrases[current];

    if (isPaused) {
      timerRef.current = setTimeout(() => {
        setIsPaused(false);
        setIsDeleting(true);
      }, 1800);
      return () => {
        if (timerRef.current) clearTimeout(timerRef.current);
      };
    }

    if (!isDeleting && text.length < phrase.length) {
      timerRef.current = setTimeout(() => {
        setText(phrase.slice(0, text.length + 1));
      }, 55);
    } else if (!isDeleting && text.length === phrase.length) {
      setIsPaused(true);
    } else if (isDeleting && text.length > 0) {
      timerRef.current = setTimeout(() => {
        setText(phrase.slice(0, text.length - 1));
      }, 30);
    } else if (isDeleting && text.length === 0) {
      setIsDeleting(false);
      setCurrent((c) => (c + 1) % phrases.length);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, isDeleting, current, isPaused]);

  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.15], [1, 0.95]);

  return (
    <motion.section className="hero" style={{ opacity, scale }}>
      {/* Aurora gradient orbs */}
      <div className="hero-aurora">
        <div className="hero-aurora-orb" />
        <div className="hero-aurora-orb" />
        <div className="hero-aurora-orb" />
      </div>
      <motion.div
        className="hero-badge"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        {t("hero.badge")}
      </motion.div>

      <motion.h1
        className="hero-name"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.7 }}
      >
        Lê Văn <span className="accent">Khoa</span>
      </motion.h1>

      <motion.p
        className="hero-tagline"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.6 }}
      >
        {t("hero.tagline")}
      </motion.p>

      <motion.div
        className="hero-typing"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0, duration: 0.5 }}
      >
        <span>&gt; </span>
        {text}
        <span className="cursor">|</span>
      </motion.div>

      <motion.div
        className="hero-cta"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.6 }}
      >
        <a href="#projects" className="btn btn-primary">
          {t("hero.cta.projects")}
        </a>
        <a
          href="https://github.com/1dao2mang"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-outline"
        >
          {t("hero.cta.github")}
        </a>
      </motion.div>
    </motion.section>
  );
}

/* ================================================================
   ABOUT
   ================================================================ */
function About() {
  const { t } = useLocale();

  const infoCards = [
    { label: t("about.info.university.label"), value: t("about.info.university.value") },
    { label: t("about.info.major.label"), value: t("about.info.major.value") },
    { label: t("about.info.location.label"), value: t("about.info.location.value") },
    { label: t("about.info.focus.label"), value: t("about.info.focus.value") },
  ];

  return (
    <section id="about" className="section">
      <ScrollReveal>
        <div className="section-label">{t("about.label")}</div>
        <h2 className="section-title">{t("about.title")}</h2>
      </ScrollReveal>

      <div className="about-content">
        <ScrollReveal delay={0.1}>
          <div className="about-text">
            <p dangerouslySetInnerHTML={{ __html: t("about.p1") }} />
            <p dangerouslySetInnerHTML={{ __html: t("about.p2") }} />
            <p>{t("about.p3")}</p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <div className="about-info-grid">
            {infoCards.map((card) => (
              <div className="about-info-card" key={card.label}>
                <div className="label">{card.label}</div>
                <div className="value">{card.value}</div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

/* ================================================================
   SKILLS
   ================================================================ */
function Skills() {
  const { t } = useLocale();

  const skillsData = [
    { category: t("skills.cat.languages"), items: ["TypeScript", "JavaScript", "Python"] },
    { category: t("skills.cat.frontend"), items: ["React", "Next.js", "HTML/CSS"] },
    { category: t("skills.cat.backend"), items: ["Node.js", "Express", "REST APIs"] },
    { category: t("skills.cat.cloud"), items: ["AWS", "GCP", "Cloudflare", "Vercel", "GitHub Actions"] },
    { category: t("skills.cat.tools"), items: ["Git", "Docker", "Player4Me", "ImgBB"] },
    { category: t("skills.cat.soft"), items: [t("skills.soft.problem"), t("skills.soft.team"), t("skills.soft.learner")] },
  ];

  return (
    <section id="skills" className="section">
      <ScrollReveal>
        <div className="section-label">{t("skills.label")}</div>
        <h2 className="section-title">{t("skills.title")}</h2>
      </ScrollReveal>

      <div className="skills-grid">
        {skillsData.map((cat, i) => (
          <ScrollReveal key={cat.category} delay={i * 0.08}>
            <TiltCard>
              <div className="skill-category">
                <div className="skill-category-title">{cat.category}</div>
                <div className="skill-tags">
                  {cat.items.map((skill) => (
                    <span className="skill-tag" key={skill}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </TiltCard>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}

/* ================================================================
   AWARDS
   ================================================================ */
function Awards() {
  const { t } = useLocale();

  const awardsData = [
    { icon: "🏆", title: t("awards.0.title"), desc: t("awards.0.desc"), year: "2025" },
    { icon: "🎨", title: t("awards.1.title"), desc: t("awards.1.desc"), year: "2025" },
    { icon: "💻", title: t("awards.2.title"), desc: t("awards.2.desc"), year: "2025" },
  ];

  return (
    <section id="awards" className="section">
      <ScrollReveal>
        <div className="section-label">{t("awards.label")}</div>
        <h2 className="section-title">{t("awards.title")}</h2>
      </ScrollReveal>

      <div className="awards-list">
        {awardsData.map((award, i) => (
          <ScrollReveal key={award.title} delay={i * 0.1}>
            <div className="award-card">
              <div className="award-icon">{award.icon}</div>
              <div className="award-info">
                <h3>{award.title}</h3>
                <p className="award-desc">{award.desc}</p>
                <span className="award-year">{award.year}</span>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}

/* ================================================================
   PROJECTS
   ================================================================ */
function Projects() {
  const { t } = useLocale();
  const [activeFilter, setActiveFilter] = useState("All");

  const projectsData = [
    {
      title: "SmartHire AI",
      desc: t("projects.0.desc"),
      tech: ["Next.js 14", "TypeScript", "Tailwind CSS", "Framer Motion"],
      github: "https://github.com/1dao2mang/smarthire-frontend",
    },
    {
      title: "IELTS_WEB",
      desc: t("projects.1.desc"),
      tech: ["React 18", "TypeScript", "Vite", "Tailwind CSS", "Zustand"],
      github: "https://github.com/1dao2mang/IELTS_WEB",
    },
    {
      title: "Personal Finance Manager",
      desc: t("projects.2.desc"),
      tech: ["Flutter", "Dart", "SQLite", "Biometric Auth"],
      github: "https://github.com/1dao2mang/Personal-Finance-Manager",
    },
    {
      title: "GamePlus",
      desc: t("projects.3.desc"),
      tech: ["Flutter", "Flame Engine", "FastAPI", "PostgreSQL"],
      github: "https://github.com/1dao2mang/game_plus",
    },
    {
      title: "Reroll-DoMiXi",
      desc: t("projects.4.desc"),
      tech: ["Next.js", "TypeScript", "CSS"],
      github: "https://github.com/1dao2mang/Reroll-DoMiXi",
    },
  ];

  const allTechs = useMemo(() => {
    const set = new Set<string>();
    projectsData.forEach((p) => p.tech.forEach((t) => set.add(t)));
    return ["All", ...Array.from(set).sort()];
  }, []);

  const filtered = activeFilter === "All"
    ? projectsData
    : projectsData.filter((p) => p.tech.includes(activeFilter));

  return (
    <section id="projects" className="section">
      <ScrollReveal>
        <div className="section-label">{t("projects.label")}</div>
        <h2 className="section-title">{t("projects.title")}</h2>
      </ScrollReveal>

      <ScrollReveal>
        <div className="project-filters">
          {allTechs.map((tech: string) => (
            <button
              key={tech}
              className={`filter-pill${activeFilter === tech ? " active" : ""}`}
              onClick={() => setActiveFilter(tech)}
            >
              {tech}
            </button>
          ))}
        </div>
      </ScrollReveal>

      <div className="projects-grid">
        {filtered.map((p, i) => (
          <ScrollReveal key={p.title} delay={i * 0.08}>
            <TiltCard>
              <div className="project-card">
                <div className="project-header">
                  <span className="project-folder-icon">📂</span>
                  <div className="project-links">
                    <a
                      href={p.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`GitHub repo for ${p.title}`}
                    >
                      ↗
                    </a>
                  </div>
                </div>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
                <div className="project-tech">
                  {p.tech.map((tech, j) => (
                    <span key={tech}>
                      {tech}
                      {j < p.tech.length - 1 && " · "}
                    </span>
                  ))}
                </div>
              </div>
            </TiltCard>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}

/* ================================================================
   CONTACT
   ================================================================ */
function Contact() {
  const { t } = useLocale();

  return (
    <section id="contact" className="section">
      <ScrollReveal>
        <div className="section-label">{t("contact.label")}</div>
        <h2 className="section-title">{t("contact.title")}</h2>
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <div className="contact-content">
          <p>{t("contact.text")}</p>

          <div className="contact-links">
            <a
              href="mailto:levankhoa2004@gmail.com"
              className="contact-link"
            >
              <span className="icon">✉️</span>
              levankhoa2004@gmail.com
            </a>

            <a
              href="https://github.com/1dao2mang"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-link"
            >
              <span className="icon">🐙</span>
              GitHub
            </a>

            <a
              href="https://www.linkedin.com/in/l%C3%AA-v%C4%83n-khoa-31961916b/"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-link"
            >
              <span className="icon">💼</span>
              LinkedIn
            </a>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}

/* ================================================================
   PAGE
   ================================================================ */
export default function Home() {
  const { t } = useLocale();

  return (
    <>
      <Preloader />
      <ScrollProgress />
      <ParticleField />
      <CustomCursor />

      {/* Floating background orbs */}
      <div className="floating-orbs">
        <div className="floating-orb" />
        <div className="floating-orb" />
        <div className="floating-orb" />
      </div>

      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Awards />
        <Projects />
        <Contact />
      </main>
      <footer className="footer">
        <p>
          © 2025 <a href="https://github.com/1dao2mang">Lê Văn Khoa</a>.{" "}
          {t("footer.text")}
        </p>
      </footer>
    </>
  );
}
