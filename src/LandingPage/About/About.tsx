import { motion } from "framer-motion";
import WorkflowDiagram from "./WorkflowDiagram";
import "./About.css";

export default function About() {
  return (
    <section className="about-wrapper" id="about">
      <div className="about">
        <div className="about-container">
          <h2 className="about-heading">Who I Am</h2>
          <div className="about-bento">
            {/* About text — 2x1 */}
            <motion.div
              className="bento-card bento-about"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: false }}
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
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: false }}
            >
              <div>
                <div className="bento-card-label">Me</div>
                <div className="bento-info-value">Sascha Fischer</div>
              </div>
              <div className="profile-image-placeholder">
                <img className="profile-image" src="/profile.png" alt="Sascha Fischer" loading="lazy" />
              </div>
            </motion.div>

            {/* Philosophy — 2x1 */}
            <motion.div
              className="bento-card bento-philosophy"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: false }}
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
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: false }}
            >
              <div className="bento-stat-number">3+</div>
              <div className="bento-stat-label">Years Experience</div>
            </motion.div>

            {/* Availability — 1x1 */}
            <motion.div
              className="bento-card bento-status"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: false }}
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
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: false }}
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
