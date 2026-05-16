import { useState } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
  faArrowUpRightFromSquare,
} from "@fortawesome/free-solid-svg-icons";
import "./Certificates.css";

const VP = { once: false, amount: 0.05 };
const ease = [0.22, 1, 0.36, 1] as const;

interface Certificate {
  title: string;
  issuer: string;
  date: string;
  description: string;
  thumbnail: string | null;
  url: string;
}

const CERTIFICATES: Certificate[] = [
  {
    title: "Meta Full Stack Developer",
    issuer: "Meta · Coursera",
    date: "Frbruar 2026",
    description:
      "Comprehensive full-stack web development program covering modern front-end and back-end technologies. Mastered React.js for building dynamic user interfaces, responsive design patterns with HTML/CSS, JavaScript ES6+ fundamentals, and back-end development with Node.js and databases. Completed hands-on capstone projects focusing on real-world application architecture, API integration, and deployment pipelines. Gained expertise in version control (Git), component-driven development, state management, and agile methodologies.",
    thumbnail: "/coursera.png",
    url: "https://www.coursera.org/account/accomplishments/specialization/BS126HF6RL1V",
  },
  {
    title: "CodeAcademy Full Stack Engineer",
    issuer: "CodeAcademy",
    date: "January 2025",
    description:
      "Full-stack web development certification covering HTML5, CSS3, JavaScript, React, Node.js, Express, and database design with PostgreSQL and MongoDB. Built end-to-end applications with RESTful APIs, JWT authentication, and comprehensive testing. Completed capstone projects demonstrating production-ready code practices including debugging, optimization, and deployment.",
    thumbnail: "/codeacademy.png",
    url: "https://www.codecademy.com/profiles/array0042605889/certificates/ffd0f42cce1a44e9a0108b365047a0a6",
  },
  {
    title: "Full Stack Open",
    issuer: "University of Helsinki",
    date: "June 2025",
    description:
      "Comprehensive modern web development curriculum covering React, Node.js, MongoDB, and testing strategies. Mastered React fundamentals including hooks, context API, and component lifecycle. Built production-grade backend services with Express, RESTful API design, and middleware patterns. Gained expertise in NoSQL database modeling with MongoDB, data validation, and schema design. Learned comprehensive testing methodologies including unit tests (Jest), integration tests, and end-to-end testing with Cypress. Additional skills in TypeScript, GraphQL fundamentals, Docker containerization, CI/CD pipelines, and web security best practices.",
    thumbnail: "/university-helsinki.png",
    url: "https://studies.cs.helsinki.fi/stats/api/certificate/fullstackopen/en/a2627305aaab82d1003465e896cf4b3b",
  },
];

function CertThumbnail({ src, title }: { src: string | null; title: string }) {
  if (src) return <img src={src} alt={title} className="cert-thumbnail-img" loading="lazy" />;
  return (
    <div className="cert-thumbnail-placeholder">
      <div className="cert-thumbnail-glow" />
      <span className="cert-thumbnail-label">{title}</span>
    </div>
  );
}

export default function Certificates() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [stripAnimating, setStripAnimating] = useState(false);
  const [stripDir, setStripDir] = useState<'left' | 'right'>('right');

  const navigate = (newIndex: number) => {
    if (transitioning || newIndex === currentIndex) {
      console.log(`[navigate] BLOCKED - transitioning: ${transitioning}, newIndex === currentIndex: ${newIndex === currentIndex}`);
      return;
    }
    console.log(`[navigate] EXECUTING - navigating from ${currentIndex} to ${newIndex}`);
    setTransitioning(true);
    setStripAnimating(true);

    setTimeout(() => {
      console.log(`[navigate callback] Setting currentIndex to ${newIndex}, transitioning and stripAnimating to false`);
      setCurrentIndex(newIndex);
      setTransitioning(false);
      setStripAnimating(false);

      // Scroll to top of section on mobile/tablet (max-width: 1024px)
      if (window.innerWidth <= 1024) {
        const section = document.querySelector(".certificates");
        if (section) {
          const top = section.getBoundingClientRect().top + window.scrollY - 75;
          window.scrollTo({ top, behavior: "smooth" });
        }
      }
    }, 180);
  };

  const navigateStrip = (offset: number) => {
    const newIndex = (currentIndex + offset + CERTIFICATES.length) % CERTIFICATES.length;
    const direction = offset > 0 ? 'right' : 'left';
    console.log(`[navigateStrip] offset: ${offset}, currentIndex: ${currentIndex}, newIndex: ${newIndex}, direction: ${direction}, transitioning: ${transitioning}`);
    setStripDir(direction);
    navigate(newIndex);
  };

  const cert = CERTIFICATES[currentIndex];

  return (
    <section className="certificates" id="certificates">
      <motion.h2
        className="cert-heading"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={VP}
        transition={{ duration: 0.5, ease }}
      >
        Certificates
      </motion.h2>

      <div className="cert-showcase">
        <div className={`cert-main-grid${transitioning ? " transitioning" : ""}`}>
          {/* Thumbnail — col 1 */}
          <motion.div
            className="cert-thumbnail-panel"
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={VP}
            transition={{ duration: 0.55, delay: 0.15, ease }}
          >
            <CertThumbnail src={cert.thumbnail} title={cert.title} />
          </motion.div>

          {/* Info side — col 2 */}
          <div className="cert-info-side">
            {/* Name */}
            <motion.div
              className="cert-panel cert-name-panel"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VP}
              transition={{ duration: 0.5, delay: 0.25, ease }}
            >
              <div className="cert-panel-label">Certificate</div>
              <div className="cert-name-value">{cert.title}</div>
            </motion.div>

            {/* Issuer + Date side by side */}
            <div className="cert-meta-row">
              <motion.div
                className="cert-panel cert-issuer-panel"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={VP}
                transition={{ duration: 0.5, delay: 0.31, ease }}
              >
                <div className="cert-panel-label">Issuer</div>
                <div className="cert-panel-value">{cert.issuer}</div>
              </motion.div>

              <motion.div
                className="cert-panel cert-date-panel"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={VP}
                transition={{ duration: 0.5, delay: 0.36, ease }}
              >
                <div className="cert-panel-label">Date Certified</div>
                <div className="cert-panel-value">{cert.date}</div>
              </motion.div>
            </div>

            {/* Description */}
            <motion.div
              className="cert-panel cert-description-panel"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VP}
              transition={{ duration: 0.5, delay: 0.41, ease }}
            >
              <div className="cert-panel-label">Description</div>
              <p className="cert-description-text">{cert.description}</p>
            </motion.div>

            {/* Verify */}
            <motion.div
              className="cert-panel cert-verify-panel"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VP}
              transition={{ duration: 0.5, delay: 0.46, ease }}
            >
              <div className="cert-panel-label">Verification</div>
              <a
                href={cert.url}
                className="cert-verify-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="cert-verify-icon" />
                View Credential
              </a>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom strip — infinite carousel */}
      <motion.div
        className="cert-strip"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={VP}
        transition={{ duration: 0.5, delay: 0.5, ease }}
      >
        <button
          className="cert-nav-btn cert-strip-nav-left"
          onClick={() => navigateStrip(-1)}
          aria-label="Previous certificate"
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>

        <div className="cert-strip-carousel">
          {[-2, -1, 0, 1, 2].map((offset) => {
            const n = CERTIFICATES.length;
            const index = (currentIndex + offset + n * 4) % n;
            const cert = CERTIFICATES[index];

            const visualOffset = stripAnimating
              ? (stripDir === 'right' ? offset - 1 : offset + 1)
              : offset;

            const absVis = Math.abs(visualOffset);
            const opacity = absVis >= 2 ? 0 : visualOffset === 0 ? 1 : Math.max(0.5, 1 - absVis * 0.3);
            const scale = visualOffset === 0 ? 1 : Math.max(0.8, 0.92 - absVis * 0.08);
            const isActive = !stripAnimating && offset === 0;

            if (offset === 0) {
              console.log(`[carousel center] currentIndex: ${currentIndex}, stripAnimating: ${stripAnimating}, stripDir: ${stripDir}, visualOffset: ${visualOffset}, isActive: ${isActive}`);
            }

            const isEdgeItem = Math.abs(offset) === 2;

            return (
              <button
                key={offset}
                className={`cert-strip-carousel-item${isActive ? " active" : ""}`}
                onClick={() => !isEdgeItem && navigateStrip(offset)}
                style={{
                  opacity,
                  transform: `scale(${scale})`,
                  left: `calc(50% + ${visualOffset * 160}px - 75px)`,
                  borderColor: isActive ? "var(--accent)" : "var(--border)",
                  transition: stripAnimating
                    ? 'left 250ms cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 250ms cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 250ms ease'
                    : 'none',
                  pointerEvents: isEdgeItem ? 'none' : 'auto',
                }}
                aria-label={`View ${cert.title}`}
              >
                <div className="cert-strip-carousel-thumb">
                  {cert.thumbnail ? (
                    <img src={cert.thumbnail} alt={cert.title} className="cert-strip-img" loading="lazy" />
                  ) : (
                    <>
                      <div className="cert-strip-glow" />
                      <span className="cert-strip-label">{cert.title}</span>
                    </>
                  )}
                  <div className="cert-strip-hover-label">{cert.title}</div>
                </div>
              </button>
            );
          })}
        </div>

        <button
          className="cert-nav-btn cert-strip-nav-right"
          onClick={() => navigateStrip(1)}
          aria-label="Next certificate"
        >
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
      </motion.div>
    </section>
  );
}
