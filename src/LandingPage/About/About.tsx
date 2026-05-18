import { motion, cubicBezier } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import WorkflowDiagram from "./WorkflowDiagram";
import "./About.css";

const customEase = cubicBezier(0.22, 1, 0.36, 1);

const cardVariants = {
  offscreen: () => ({
    opacity: 0,
    y: 40,
    scale: 0.95,
    filter: "blur(4px)",
  }),
  onscreen: (index: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.8,
      delay: index * 0.08,
      ease: customEase,
    },
  }),
};

const headingVariants = {
  offscreen: { opacity: 0, y: 20, filter: "blur(2px)" },
  onscreen: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 1,
      ease: customEase,
    },
  },
};

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-100px" });

  return (
    <section className="about-wrapper" id="about" ref={ref}>
      <div className="about">
        <div className="about-container">
          <motion.h2
            className="about-heading"
            initial="offscreen"
            animate={isInView ? "onscreen" : "offscreen"}
            variants={headingVariants}
          >
            Who I Am
          </motion.h2>
          <div className="about-bento">
            {/* About text — 2x1 */}
            <motion.div
              className="bento-card bento-about"
              custom={0}
              initial="offscreen"
              whileInView="onscreen"
              variants={cardVariants}
              viewport={{ once: false, margin: "-50px" }}
              whileHover={{ y: -8 }}
            >
              <div className="bento-card-label">About Me</div>
              <p className="bento-about-text">
                Welcome! I'm Sascha Fischer, 30 years old. I'm enthusiastic about coding and AI,
                building elegant solutions that push the boundaries of what's possible. As a
                fullstack developer, I specialize in React, TypeScript, and scalable backend
                systems. Above all, I code out of passion, it's not just my profession, it's my
                hobby.
              </p>
            </motion.div>

            {/* Me + Profile — 1x1 */}
            <motion.div
              className="bento-card bento-location-profile"
              custom={1}
              initial="offscreen"
              whileInView="onscreen"
              variants={cardVariants}
              viewport={{ once: false, margin: "-50px" }}
              whileHover={{ y: -8, scale: 1.02 }}
            >
              <div>
                <div className="bento-card-label">Me</div>
                <div className="bento-info-value">Sascha Fischer</div>
              </div>
              <img
                className="profile-image"
                src="/profile.png"
                alt="Sascha Fischer"
                loading="lazy"
              />
            </motion.div>

            {/* Philosophy — 2x1 */}
            <motion.div
              className="bento-card bento-philosophy"
              custom={2}
              initial="offscreen"
              whileInView="onscreen"
              variants={cardVariants}
              viewport={{ once: false, margin: "-50px" }}
              whileHover={{ y: -8 }}
            >
              <div className="bento-card-label">Philosophy</div>
              <p className="bento-philosophy-text">
                Every great product starts as a sketch. I visualize, prototype, specify, and refine
                — looping back whenever a better idea strikes. Finalize only when it's right.
              </p>
              <div className="bento-philosophy-diagram">
                <WorkflowDiagram />
              </div>
            </motion.div>

            {/* Years of Experience — 1x1 */}
            <motion.div
              className="bento-card bento-stat"
              custom={3}
              initial="offscreen"
              whileInView="onscreen"
              variants={cardVariants}
              viewport={{ once: false, margin: "-50px" }}
              whileHover={{ y: -8 }}
            >
              <div className="bento-stat-number">3+</div>
              <div className="bento-stat-label">Years Experience</div>
            </motion.div>

            {/* Availability — 1x1 */}
            <motion.div
              className="bento-card bento-status"
              custom={4}
              initial="offscreen"
              whileInView="onscreen"
              variants={cardVariants}
              viewport={{ once: false, margin: "-50px" }}
              whileHover={{ y: -8 }}
            >
              <div className="bento-status-indicator">
                <span className="bento-status-dot"></span>
              </div>
              <div>
                <div className="bento-status-title">Available</div>
                <div className="bento-status-subtitle">Open to opportunities</div>
              </div>
            </motion.div>

            {/* Location — 1x1 */}
            <motion.div
              className="bento-card bento-location-card"
              custom={5}
              initial="offscreen"
              whileInView="onscreen"
              variants={cardVariants}
              viewport={{ once: false, margin: "-50px" }}
              whileHover={{ y: -8, scale: 1.02 }}
            >
              <div className="location-content">
                <div className="bento-card-label">Location</div>
                <div className="bento-info-value">Aachen, Germany</div>
              </div>
              <div className="location-map-container">
                <iframe
                  className="location-map"
                  src="https://maps.google.com/maps?q=Aachen,Germany&t=&z=12&ie=UTF8&iwloc=&output=embed"
                  allowFullScreen
                  title="Aachen, Germany"
                  style={{ border: 0 }}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
