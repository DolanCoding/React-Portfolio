import { useState, useEffect } from 'react'
import NavLogo from './NavLogo'
import NavLinks from './NavLinks'
import NavCTA from './NavCTA'
import './Navbar.css'

const NAV_LINKS = [
  { label: 'Start', href: '#hero' },
  { label: 'About', href: '#about' },
  { label: 'Certificates', href: '#certificates' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const [activeLink, setActiveLink] = useState('hero')
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('.landing-page > section')
      const scrollTop = window.scrollY + 150

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i]
        if ((section as HTMLElement).offsetTop <= scrollTop) {
          const id = section.getAttribute('id')
          if (id) setActiveLink(id)
          break
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close drawer when a nav link is clicked
  const closeMenu = () => setMenuOpen(false)

  return (
    <header className="navbar">
      <div className="navbar-container">
        <NavLogo />
        <NavLinks links={NAV_LINKS} activeLink={activeLink} onLinkClick={closeMenu} />
        <NavCTA />
        <button
          className={`nav-hamburger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Mobile drawer */}
      <div className={`nav-drawer ${menuOpen ? 'open' : ''}`}>
        <NavLinks links={NAV_LINKS} activeLink={activeLink} onLinkClick={closeMenu} />
      </div>
    </header>
  )
}
