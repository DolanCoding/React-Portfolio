

import { motion } from 'framer-motion'

export default function HeroActions() {
  const scrollTo = (id: string) => {
    const isMobile =
      window.matchMedia('(max-width: 768px)').matches ||
      window.matchMedia('(max-height: 500px) and (orientation: landscape)').matches

    if (isMobile) {
      const section = document.getElementById(id)
      if (section) {
        const target = Math.max(0, section.getBoundingClientRect().top + window.scrollY - 75)
        window.scrollTo({ top: target, behavior: 'smooth' })
      }
    } else {
      window.dispatchEvent(new CustomEvent('nav-goto', { detail: { id } }))
    }
  }

  const handleViewWork = () => scrollTo('projects')
  const handleContact = () => scrollTo('contact')

  return (
    <motion.div
      className="hero-actions"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <button className="hero-button hero-button-primary" onClick={handleViewWork}>
        View My Work
      </button>
      <button className="hero-button hero-button-secondary" onClick={handleContact}>
        Get in Touch
      </button>
    </motion.div>
  )
}
