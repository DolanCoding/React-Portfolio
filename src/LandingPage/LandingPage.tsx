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
    if (isPortraitMobile || isLandscapeMobile) {
      console.log('[INIT] Mobile viewport detected, wheel snap disabled')
      return
    }

    console.log('[INIT] Initializing scroll snap - locked reset to false')
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>('.landing-page > section')
    )

    let currentIndex = 0
    let locked = false
    let unlockTimeoutId: NodeJS.Timeout | null = null

    const goTo = (index: number) => {
      const callTime = Date.now()
      if (index < 0 || index >= sections.length) return

      console.log(`[GOTO ${callTime}] Starting snap to section ${index}`)
      currentIndex = index
      locked = true

      const section = sections[index]
      const id = section.id || (section.closest('[id]') as HTMLElement | null)?.id
      if (id) history.replaceState(null, '', `#${id}`)

      const target = Math.max(0, section.getBoundingClientRect().top + window.scrollY - NAV_HEIGHT)
      const start = window.scrollY
      const distance = target - start
      const duration = 1500 // 1.5 seconds for smooth, slower scroll

      console.log(`[GOTO ${callTime}] Animation start: ${start}, target: ${target}, distance: ${distance}`)
      let startTime: number | null = null

      const easeInOutCubic = (t: number) => {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
      }

      const animate = (currentTime: number) => {
        if (startTime === null) {
          startTime = currentTime
          const animStartTime = Date.now()
          console.log(`[ANIMATE ${animStartTime}] RAF triggered, delay from goTo: ${animStartTime - callTime}ms`)
        }
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / duration, 1)
        const easeProgress = easeInOutCubic(progress)

        const newScrollY = start + distance * easeProgress
        window.scrollTo(0, newScrollY)

        if (progress < 1) {
          requestAnimationFrame(animate)
        } else {
          const completeTime = Date.now()
          console.log(`[COMPLETE ${completeTime}] Animation done, duration: ${completeTime - callTime}ms`)
          // Keep lock for 200ms after animation completes
          if (unlockTimeoutId) clearTimeout(unlockTimeoutId)
          unlockTimeoutId = setTimeout(() => {
            locked = false
            unlockTimeoutId = null
            console.log(`[UNLOCK ${Date.now()}] Lock released after 200ms delay from animation completion`)
          }, 200)
        }
      }

      requestAnimationFrame(animate)
    }

    const handleScroll = () => {
      // Track which section has the most visible area
      const vh = window.innerHeight
      let maxVisiblePx = 0
      let mostVisibleIndex = currentIndex

      sections.forEach((section, i) => {
        const rect = section.getBoundingClientRect()
        const visibleTop = Math.max(rect.top, NAV_HEIGHT)
        const visibleBottom = Math.min(rect.bottom, vh)
        const visiblePx = Math.max(0, visibleBottom - visibleTop)

        if (visiblePx > maxVisiblePx) {
          maxVisiblePx = visiblePx
          mostVisibleIndex = i
        }
      })

      currentIndex = mostVisibleIndex
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

    const handleWheel = (e: WheelEvent) => {
      // Only on desktop
      if (window.innerWidth <= 1024) return

      const wheelTime = Date.now()

      // Block scrolling while snap is in progress - lock immediately
      if (locked) {
        console.log(`[WHEEL ${wheelTime}] BLOCKED - locked`)
        e.preventDefault()
        return
      }

      // Lock immediately before any processing
      locked = true
      e.preventDefault()

      const direction = e.deltaY > 0 ? 1 : -1
      const nextIndex = currentIndex + direction

      console.log(`[WHEEL ${wheelTime}] deltaY: ${e.deltaY}, calling goTo, nextIndex: ${nextIndex}`)
      if (nextIndex >= 0 && nextIndex < sections.length) {
        goTo(nextIndex)
      } else {
        // Unlock if index is out of bounds
        locked = false
      }
    }

    console.log('[INIT] Attaching event listeners')
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('nav-goto', handleNavGoto)
    window.addEventListener('wheel', handleWheel, { passive: false })
    console.log('[INIT] Event listeners attached, wheel snap ready')
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('nav-goto', handleNavGoto)
      window.removeEventListener('wheel', handleWheel)
      if (unlockTimeoutId) clearTimeout(unlockTimeoutId)
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
