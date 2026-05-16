export default function NavCTA() {
  return (
    <button className="nav-cta" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
      Hire Me
    </button>
  )
}
