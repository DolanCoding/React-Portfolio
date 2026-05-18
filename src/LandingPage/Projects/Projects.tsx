import { useState } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import "./Projects.css";

const VP = { once: false, amount: 0.05 };
const ease = [0.34, 1.56, 0.64, 1] as const;

interface ProjectLink {
  label: string;
  url: string;
  type: "demo" | "github" | "other";
}

interface Project {
  title: string;
  description: string;
  screenshots: (string | null)[];
  duration: string;
  tech: string[];
  links: ProjectLink[];
}

const PROJECTS: Project[] = [
  {
    title: "E-commerce Platform",
    description: `A modern e-commerce platform built with React and Node.js featuring real-time inventory management, secure Stripe checkout, and a fully responsive storefront. The backend leverages MongoDB for flexible product schemas and Express for a clean REST API. Authentication uses JWT with refresh token rotation, and the admin panel provides real-time order tracking and analytics across all storefronts.`,
    screenshots: [
      "/E-Commerce/E-Commerce (1).png",
      "/E-Commerce/E-Commerce (2).png",
      "/E-Commerce/E-Commerce (3).png",
      "/E-Commerce/E-Commerce (4).png",
      "/E-Commerce/E-Commerce (5).png",
    ],
    duration: "1 month",
    tech: ["React", "Node.js", "PostgreSQL", "TypeScript", "Express", "Tailwind CSS", "Redux"],
    links: [
      { label: "Live Demo", url: "https://e-commerce-app-peach-five.vercel.app/", type: "demo" },
      { label: "GitHub", url: "https://github.com/DolanCoding/E-Commerce_App", type: "github" },
    ],
  },
  {
    title: "Fellwunder - Aachen",
    description: `Professional grooming salon website showcasing services for dogs and cats with a modern, responsive design. Features smooth page transitions, an engaging hero section, detailed about section, and comprehensive service listings. Built with React for component architecture, TypeScript for type safety, and custom CSS for pixel-perfect design. Fully optimized for mobile, tablet, and desktop viewports with a clean, professional aesthetic.`,
    screenshots: [
      "/Fellwunder/fellwunder (1).png",
      "/Fellwunder/fellwunder (2).png",
      "/Fellwunder/fellwunder (3).png",
      "/Fellwunder/fellwunder (4).png",
      "/Fellwunder/fellwunder (5).png",
    ],
    duration: "1 month",
    tech: ["React", "TypeScript", "CSS3", "Responsive Design", "React Router"],
    links: [
      { label: "Live Demo", url: "https://www.fellwunder-aachen.de/", type: "demo" },
      { label: "GitHub", url: "https://github.com/DolanCoding/fellwunder-aachen", type: "github" },
    ],
  }
];

function IconExternal() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

function IconGithub() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function Thumbnail({ src, label }: { src: string | null; label: string }) {
  if (src)
    return (
      <div className="image-wrapper">
        <img src={src} alt={label} className="project-thumbnail-img" loading="lazy" />
      </div>
    );
  return (
    <div className="project-thumbnail-placeholder">
      <div className="project-thumbnail-glow" />
      <span className="project-thumbnail-label">{label}</span>
    </div>
  );
}

export default function Projects() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [selectedThumb, setSelectedThumb] = useState(0);
  const [slideDir, setSlideDir] = useState<"left" | "right" | null>(null);
  const [thumbAnimating, setThumbAnimating] = useState(false);
  const [stripAnimating, setStripAnimating] = useState(false);
  const [stripDir, setStripDir] = useState<"left" | "right">("right");

  const navigate = (newIndex: number) => {
    if (transitioning || newIndex === currentIndex) return;
    setTransitioning(true);
    setStripAnimating(true);
    setTimeout(() => {
      setCurrentIndex(newIndex);
      setSelectedThumb(0);
      setSlideDir(null);
      setThumbAnimating(false);
      setTransitioning(false);
      setStripAnimating(false);

      // Scroll to top of section on mobile/tablet (max-width: 1024px)
      if (window.innerWidth <= 1024) {
        const section = document.querySelector(".projects");
        if (section) {
          const top = section.getBoundingClientRect().top + window.scrollY - 75;
          window.scrollTo({ top, behavior: "smooth" });
        }
      }
    }, 180);
  };

  const navigateStrip = (offset: number) => {
    const newIndex = (currentIndex + offset + PROJECTS.length) % PROJECTS.length;
    const direction = offset > 0 ? "right" : "left";
    setStripDir(direction);
    navigate(newIndex);
  };

  const changeThumb = (dir: "left" | "right") => {
    if (thumbAnimating) return;
    const n = PROJECTS[currentIndex].screenshots.length;
    const newIndex = dir === "right" ? (selectedThumb + 1) % n : (selectedThumb - 1 + n) % n;
    setSlideDir(dir);
    setThumbAnimating(true);
    setTimeout(() => {
      setSelectedThumb(newIndex);
      setSlideDir(null);
      setThumbAnimating(false);
    }, 270);
  };

  const prev = () => navigateStrip(-1);
  const next = () => navigateStrip(1);

  const project = PROJECTS[currentIndex];

  return (
    <section className="projects" id="projects">
      <motion.h2
        className="projects-heading"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={VP}
        transition={{ duration: 0.8, ease }}
      >
        Featured Projects
      </motion.h2>

      <div className="projects-showcase">
        <div className={`project-main-grid${transitioning ? " transitioning" : ""}`}>
          {/* Main thumbnail — col 1+2, row 1 */}
          <motion.div
            className="project-thumbnail-panel"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            whileHover={{ y: -4, scale: 1.01 }}
            viewport={VP}
            transition={{ duration: 0.65, delay: 0.15, ease }}
          >
            <Thumbnail src={project.screenshots[selectedThumb]} label={project.title} />
          </motion.div>

          {/* Gallery — col 3, rows 1-4 (desktop) or col 1, row 2 (mobile) */}
          <motion.div
            className="project-gallery-panel"
            initial={{ opacity: 0, x: 20, scale: 0.95 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            whileHover={{ scale: 1.01 }}
            viewport={VP}
            transition={{ duration: 0.6, delay: 0.2, ease }}
          >
            {/* Desktop: vertical thumbnails */}
            <div className="gallery-desktop">
              {project.screenshots.map((shot, i) => (
                <button
                  key={i}
                  className={`gallery-thumb${i === selectedThumb ? " active" : ""}`}
                  style={i === selectedThumb ? { borderColor: "var(--accent)" } : undefined}
                  onClick={() => setSelectedThumb(i)}
                  aria-label={`View screenshot ${i + 1}`}
                >
                  <Thumbnail src={shot} label={i === 0 ? "Main" : `View ${i + 1}`} />
                </button>
              ))}
            </div>

            {/* Mobile: carousel with arrows */}
            <div className="gallery-mobile">
              <button
                className="gallery-mobile-arrow gallery-mobile-arrow-left"
                onClick={() => changeThumb("left")}
                aria-label="Previous screenshot"
              >
                <FontAwesomeIcon icon={faChevronLeft} />
              </button>

              <div className="gallery-mobile-carousel">
                {[-3, -2, -1, 0, 1, 2, 3].map((offset) => {
                  const n = project.screenshots.length;
                  const index = (selectedThumb + offset + n * 4) % n;
                  const shot = project.screenshots[index];

                  const visualOffset = thumbAnimating
                    ? slideDir === "right"
                      ? offset - 1
                      : offset + 1
                    : offset;

                  const absVis = Math.abs(visualOffset);
                  const opacity =
                    absVis >= 3 ? 0 : visualOffset === 0 ? 1 : Math.max(0.3, 1 - absVis * 0.2);
                  const scale = visualOffset === 0 ? 1 : Math.max(0.7, 0.85 - absVis * 0.05);
                  const isActive = !thumbAnimating && offset === 0;

                  return (
                    <div
                      key={offset}
                      className="gallery-mobile-thumb"
                      style={{
                        opacity,
                        transform: `scale(${scale})`,
                        left: `calc(50% + ${visualOffset * 84}px - 40px)`,
                        borderColor: isActive ? "var(--accent)" : undefined,
                        transition: thumbAnimating
                          ? "left 250ms cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 250ms cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 250ms ease"
                          : "none",
                      }}
                    >
                      <Thumbnail src={shot} label={index === 0 ? "Main" : `View ${index + 1}`} />
                    </div>
                  );
                })}
              </div>

              <button
                className="gallery-mobile-arrow gallery-mobile-arrow-right"
                onClick={() => changeThumb("right")}
                aria-label="Next screenshot"
              >
                <FontAwesomeIcon icon={faChevronRight} />
              </button>
            </div>
          </motion.div>

          {/* Project name — col 1, row 2 */}
          <motion.div
            className="project-name-panel"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            whileHover={{ y: -4, scale: 1.01 }}
            viewport={VP}
            transition={{ duration: 0.55, delay: 0.25, ease }}
          >
            <div className="project-panel-label">Project</div>
            <div className="project-name-value">{project.title}</div>
          </motion.div>

          {/* Duration — col 2, row 2 */}
          <motion.div
            className="project-duration-panel"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            whileHover={{ y: -4, scale: 1.01 }}
            viewport={VP}
            transition={{ duration: 0.55, delay: 0.3, ease }}
          >
            <div className="project-panel-label">Duration</div>
            <div className="project-duration-value">{project.duration}</div>
          </motion.div>

          {/* Description — col 1+2, row 3 */}
          <motion.div
            className="project-description-panel"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            whileHover={{ y: -4, scale: 1.01 }}
            viewport={VP}
            transition={{ duration: 0.55, delay: 0.35, ease }}
          >
            <div className="project-panel-label">Info</div>
            <p className="project-panel-description">{project.description}</p>
          </motion.div>

          {/* Tech stack — col 2, row 4 */}
          <motion.div
            className="project-tech-panel"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            whileHover={{ y: -4, scale: 1.01 }}
            viewport={VP}
            transition={{ duration: 0.55, delay: 0.4, ease }}
          >
            <div className="project-panel-label">Tech Stack</div>
            <div className="project-tech-list">
              {project.tech.map((t) => (
                <span key={t} className="project-tech-tag">
                  {t}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Links — col 1, row 4 */}
          <motion.div
            className="project-links-panel"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            whileHover={{ y: -4, scale: 1.01 }}
            viewport={VP}
            transition={{ duration: 0.55, delay: 0.4, ease }}
          >
            <div className="project-panel-label">Links</div>
            <div className="project-links-list">
              {project.links.map((link) => (
                <a
                  key={link.label}
                  href={link.url}
                  className={`project-link project-link-${link.type}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.type === "github" ? <IconGithub /> : <IconExternal />}
                  {link.label}
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom strip — infinite carousel */}
      <motion.div
        className="projects-strip"
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={VP}
        transition={{ duration: 0.6, delay: 0.45, ease }}
      >
        <button
          className="project-nav-btn project-strip-nav-left"
          onClick={prev}
          aria-label="Previous project"
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>

        <div className="project-strip-carousel">
          {[-2, -1, 0, 1, 2].map((offset) => {
            const n = PROJECTS.length;
            const index = (currentIndex + offset + n * 4) % n;
            const project = PROJECTS[index];

            const visualOffset = stripAnimating
              ? stripDir === "right"
                ? offset - 1
                : offset + 1
              : offset;

            const absVis = Math.abs(visualOffset);
            const opacity =
              absVis >= 2 ? 0 : visualOffset === 0 ? 1 : Math.max(0.5, 1 - absVis * 0.3);
            const scale = visualOffset === 0 ? 1 : Math.max(0.8, 0.92 - absVis * 0.08);
            const isActive = !stripAnimating && offset === 0;
            const isEdgeItem = Math.abs(offset) === 2;

            return (
              <button
                key={offset}
                className={`project-strip-carousel-item${isActive ? " active" : ""}`}
                onClick={() => !isEdgeItem && navigateStrip(offset)}
                style={{
                  opacity,
                  transform: `scale(${scale})`,
                  left: `calc(50% + ${visualOffset * 160}px - 75px)`,
                  borderColor: isActive ? "var(--accent)" : "var(--border)",
                  transition: stripAnimating
                    ? "left 250ms cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 250ms cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 250ms ease"
                    : "none",
                  pointerEvents: isEdgeItem ? "none" : "auto",
                }}
                aria-label={`View ${project.title}`}
              >
                <div className="project-strip-carousel-thumb">
                  {project.screenshots[0] ? (
                    <img
                      src={project.screenshots[0]}
                      alt={project.title}
                      className="project-strip-img"
                      loading="lazy"
                    />
                  ) : (
                    <>
                      <div className="project-strip-glow" />
                      <span className="project-strip-label">{project.title}</span>
                    </>
                  )}
                  <div className="project-strip-hover-label">{project.title}</div>
                </div>
              </button>
            );
          })}
        </div>

        <button
          className="project-nav-btn project-strip-nav-right"
          onClick={next}
          aria-label="Next project"
        >
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
      </motion.div>
    </section>
  );
}
