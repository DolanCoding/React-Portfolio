interface NavLinksProps {
  links: Array<{ label: string; href: string }>
  activeLink: string
  onLinkClick?: () => void
}

const NAV_HEIGHT = 75

export default function NavLinks({ links, activeLink, onLinkClick }: NavLinksProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const id = href.substring(1)

    const isMobile =
      window.matchMedia('(max-width: 768px)').matches ||
      window.matchMedia('(max-height: 500px) and (orientation: landscape)').matches

    if (isMobile) {
      const section = document.getElementById(id)
      if (section) {
        const target = Math.max(0, section.getBoundingClientRect().top + window.scrollY - NAV_HEIGHT)
        window.scrollTo({ top: target, behavior: 'smooth' })
      }
    } else {
      window.dispatchEvent(new CustomEvent('nav-goto', { detail: { id } }))
    }

    onLinkClick?.()
  }

  return (
    <nav className="nav-links">
      {links.map((link) => {
        const linkId = link.href.substring(1)
        const isActive = activeLink === linkId
        return (
          <a
            key={link.href}
            href={link.href}
            className={`nav-link ${isActive ? 'nav-link-active' : ''}`}
            onClick={(e) => handleClick(e, link.href)}
          >
            {link.label}
          </a>
        )
      })}
    </nav>
  )
}
