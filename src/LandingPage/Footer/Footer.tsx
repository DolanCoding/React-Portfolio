import './Footer.css'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer-container">
        <p className="footer-text">
          © {currentYear} Portfolio. Crafted with care.
        </p>
      </div>
    </footer>
  )
}
