import { useState } from 'react'
import './MobileDisclaimer.css'

export default function MobileDisclaimer() {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  return (
    <div className="mobile-disclaimer">
      <div className="mobile-disclaimer-card">
        <div className="mobile-disclaimer-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="2" y="3" width="20" height="14" rx="2" />
            <path d="M8 21h8M12 17v4" />
          </svg>
        </div>
        <h2 className="mobile-disclaimer-title">Best on Desktop</h2>
        <p className="mobile-disclaimer-text">
          This portfolio was crafted for a full desktop experience — animations, layouts,
          and interactions shine brightest on a larger screen.
        </p>
        <button className="mobile-disclaimer-button" onClick={() => setDismissed(true)}>
          Continue Anyway
        </button>
      </div>
    </div>
  )
}
