import { motion } from "framer-motion";

export default function HeroSubtitle() {
  return (
    <motion.p
      className="hero-subtitle"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
    >
      Coding is my passion. Navigating the digital cosmos, one line at a time.
    </motion.p>
  );
}
