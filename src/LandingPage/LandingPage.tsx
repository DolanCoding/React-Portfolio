import { useEffect } from 'react'
import Navbar from './Navbar/Navbar'
import MobileDisclaimer from './MobileDisclaimer/MobileDisclaimer'
import Hero from './Hero/Hero'
import About from './About/About'
import Certificates from './Certificates/Certificates'
import Skills from './Skills/Skills'
import Projects from './Projects/Projects'
import Contact from './Contact/Contact'
import Footer from './Footer/Footer'
import './LandingPage.css'

const NAV_HEIGHT = 75

export default function LandingPage() {
  useEffect(() => {
    window.scrollTo(0, 0)

    const isPortraitMobile = window.matchMedia('(max-width: 768px)').matches
    const isLandscapeMobile = window.matchMedia('(max-height: 500px) and (orientation: landscape)').matches
    if (isPortraitMobile || isLandscapeMobile) return

    const sections = Array.from(
      document.querySelectorAll<HTMLElement>('.landing-page > section')
    )

    let currentIndex = 0
    let locked = false

    const goTo = (index: number) => {
      if (locked) return
      if (index < 0 || index >= sections.length) return

      currentIndex = index
      locked = true

      const section = sections[index]
      const id = section.id || (section.closest('[id]') as HTMLElement | null)?.id
      if (id) history.replaceState(null, '', `#${id}`)

      const target = Math.max(0, section.getBoundingClientRect().top + window.scrollY - NAV_HEIGHT)

      window.scrollTo({ top: target, behavior: 'smooth' })

      const fallback = setTimeout(() => { locked = false }, 2200)
      let stableCount = 0

      const poll = () => {
        if (Math.abs(window.scrollY - target) < 2) {
          stableCount++
          if (stableCount >= 4) {
            clearTimeout(fallback)
            locked = false
            return
          }
        } else {
          stableCount = 0
        }
        requestAnimationFrame(poll)
      }
      requestAnimationFrame(poll)
    }

    const handleScroll = () => {
      if (locked) return

      const vh = window.innerHeight

      let maxVisiblePx = 0
      sections.forEach((section, i) => {
        const rect = section.getBoundingClientRect()
        const visiblePx = Math.max(0, Math.min(rect.bottom, vh) - Math.max(rect.top, NAV_HEIGHT))
        if (visiblePx > maxVisiblePx) {
          maxVisiblePx = visiblePx
          currentIndex = i
        }
      })

      let bestIndex = currentIndex
      let bestVisibility = 0

      sections.forEach((section, i) => {
        if (i === currentIndex) return

        const rect = section.getBoundingClientRect()
        const visibleTop = Math.max(rect.top, NAV_HEIGHT)
        const visibleBottom = Math.min(rect.bottom, vh)
        const visiblePx = Math.max(0, visibleBottom - visibleTop)

        // On non-desktop (width <= 1024px), require 10% of viewport visible; on desktop, require 1px
        const snapThreshold = window.innerWidth <= 1024 ? vh * 0.10 : 1
        if (visiblePx < snapThreshold) return
        if (visiblePx <= bestVisibility) return

        bestVisibility = visiblePx
        bestIndex = i
      })

      if (bestIndex !== currentIndex) {
        goTo(bestIndex)
      }
    }

    const handleNavGoto = (e: Event) => {
      const id = (e as CustomEvent<{ id: string }>).detail.id
      // Re-query the DOM so any section added after mount is included
      const fresh = Array.from(document.querySelectorAll<HTMLElement>('.landing-page > section'))
      sections.splice(0, sections.length, ...fresh)
      const index = sections.findIndex(s => s.id === id || s.closest('[id]')?.id === id)
      if (index !== -1) {
        locked = false
        goTo(index)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('nav-goto', handleNavGoto)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('nav-goto', handleNavGoto)
    }
  }, [])

  return (
    <div className="landing-page">
      <MobileDisclaimer />
      <Navbar />
      <Hero />
      <About />
      <Certificates />
      <Skills />
      <Projects />
      <Contact />
      <Footer />
      <div className="overlay-left"></div>
      <div className="overlay-right"></div>
    </div>
  )
}
