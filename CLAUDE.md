# React Portfolio — Codebase Guide

## Entry Points
- **Dev server**: `npm run dev` → Vite dev on `localhost:5173`
- **Build**: `npm run build` → TSC + Vite bundle
- **App root**: `src/main.tsx` → mounts React app to `#root`
- **Main component**: `src/App.tsx` → renders `<LandingPage />`

## Stack
- React 19, Vite 8, TypeScript 6
- Three.js for 3D canvas (Stars only)
- Framer Motion for UI animations
- FontAwesome icons (@fortawesome/react-fontawesome)

## File Structure
```
src/
  main.tsx                 # React.createRoot(#root)
  App.tsx                  # Routes & layout
  LandingPage/
    LandingPage.tsx        # Main page wrapper
    Navbar/
      Navbar.tsx           # Top navigation
      NavLogo.tsx          # Logo component
      NavLinks.tsx         # Nav menu links
      NavCTA.tsx           # CTA button in nav
    Hero/
      Hero.tsx             # Hero section container
      Stars.tsx            # Three.js canvas (animated background)
      Stars.css            # Star animations & particle effects
      HeroHeading.tsx      # Main h1 "Developer Portfolio"
      HeroSubtitle.tsx     # Subtitle text
      HeroActions.tsx      # CTA buttons (View Work, Contact)
    About/
      About.tsx            # About section
      WorkflowDiagram.tsx  # Workflow/process diagram
    Skills/
      Skills.tsx           # Skills section container
      SkillGroup.tsx       # Category grouping (React, Three.js, etc.)
      SkillTag.tsx         # Individual skill badge
    Projects/
      Projects.tsx         # Projects grid/list
      ProjectCard.tsx      # Project card component
    Certificates/
      Certificates.tsx     # Certifications display
    Contact/
      Contact.tsx          # Contact form/section
    Footer/
      Footer.tsx           # Footer content
    MobileDisclaimer/
      MobileDisclaimer.tsx # Mobile warning banner
```

## Key Components & Props

**Stars.tsx**
- No props, renders Three.js canvas to fill Hero
- Uses `useEffect` for scene setup, animation loop
- Cleanup on unmount to prevent memory leaks

**HeroHeading.tsx, HeroSubtitle.tsx, HeroActions.tsx**
- Framer Motion variants for staggered entrance
- Positioned absolutely over Stars canvas

**SkillTag.tsx**
- Props: `name` (string), optional `icon` (FontAwesome)
- Renders styled badge with hover effects

**ProjectCard.tsx**
- Props: `title`, `description`, `image`, `links` (GitHub/Demo)
- Framer Motion hover scale animations

## Conventions
- Components in PascalCase folders with matching `.tsx` file
- CSS co-located in same folder (e.g., `Stars.css` with `Stars.tsx`)
- Props typed via interfaces/types, no `any`
- Three.js only in Stars.tsx, all other animations use Framer Motion
- Responsive design: mobile-first, adjust Navbar/Hero on small screens

## Animation Patterns
- **Framer Motion**: `motion.div` with `variants`, `initial`, `animate`, `exit`
- **Three.js**: Scene/Camera/Renderer in `useEffect`, `requestAnimationFrame` loop
- **Stagger effect**: Parent container with `staggerChildren` variant
- **Parallax/Scroll**: Use Framer Motion `useScroll()` hook if needed (not yet implemented)

## Styling
- CSS Modules or inline styles (check repo for pattern preference)
- Tailwind or custom CSS (check for config)
- Color scheme: Dark background with accent colors (adjust in CSS)

## Common Tasks
| Task | Files |
|------|-------|
| Edit hero text | `Hero/HeroHeading.tsx`, `HeroSubtitle.tsx` |
| Add CTA button | `Hero/HeroActions.tsx` |
| Adjust star animation | `Hero/Stars.tsx`, `Stars.css` |
| Add skill | Update data in `Skills/Skills.tsx`, use `SkillTag.tsx` |
| Add project | Update data in `Projects/Projects.tsx`, use `ProjectCard.tsx` |
| Change navbar | `Navbar/Navbar.tsx` + `NavLinks.tsx` |
| Add section | New folder in `LandingPage/`, import in `LandingPage.tsx` |

## Architecture Notes
- Single-page landing (no routing beyond App.tsx → LandingPage)
- Hero Stars is the only Three.js component; prefer Framer Motion for other animations
- Mobile disclaimer shows warning on small screens (handle gracefully)
- No backend/API calls (static content)

## Gotchas
- **Stars.tsx cleanup**: Missing cleanup function in useEffect will leak WebGL context
- **Canvas sizing**: Stars canvas must match container dimensions; adjust on resize
- **Framer Motion exit**: Requires `AnimatePresence` wrapper if removing components
- **Mobile performance**: Three.js may struggle on low-end phones; consider disabling Stars on mobile
- **FontAwesome**: Requires specific icons imported from `@fortawesome/free-solid-svg-icons` or `@fortawesome/free-brands-svg-icons`

## Design System

### Color Palette (CSS Variables in index.css)
```css
--bg-deepest:      #000000    /* Page background */
--bg-deep:         #0d0d12    /* Darker cards */
--bg-mid:          #111118    /* Mid-tone background */
--bg-card:         #16161e    /* Card default */
--bg-card-hover:   #1c1c28    /* Card hover state */
--border:          #3a3a52    /* Border/divider default */
--border-bright:   #535375    /* Border hover */
--text-primary:    #f0f0f6    /* Headings & strong text */
--text-secondary:  #9090aa    /* Body text, default */
--text-muted:      #555566    /* Muted/secondary text */
--accent:          #3b82f6    /* Blue accent (links, CTAs) */
--accent-bright:   #60a5fa    /* Lighter blue (hover) */
--accent-glow:     rgba(59, 130, 246, 0.15)  /* Accent with transparency */
```

### Typography
- **Font Sans**: System stack (SF Pro, Segoe UI, Roboto)
- **Font Mono**: SF Mono, Monaco, Cascadia Code
- **Base size**: 16px
- **Line height**: 1.5 (body), 1.2 (headings), 1.6 (paragraphs)
- **Headings**: 700 weight, color `--text-primary`
  - h1: `clamp(2.5rem, 5vw, 4rem)` (responsive)
  - h2: `clamp(2rem, 4vw, 3rem)`
  - h3: `clamp(1.5rem, 3vw, 2rem)`

### Layout & Spacing
- **Container max-width**: 1200px, padding 2rem sides
- **Section padding**: `clamp(4rem, 8vh, 8rem)` (responsive)
- **Grid gap**: 2rem
- **Grid layout**: `grid-3` = `repeat(auto-fit, minmax(300px, 1fr))` (3-col on desktop)

### Components

**Stars Canvas (Hero/Stars.css)**
- Position: `fixed` full viewport (z-index: 0)
- Loading overlay: 0.3 opacity, 2px blur backdrop
- Fade animation: 0.6s ease-in-out (0-20% fade in, 20-80% visible, 80-100% fade out)

**Links & Buttons**
- Links: default `--accent` blue, hover `--accent-bright`
- Buttons: 0.3s ease transitions, no border
- All transitions: 0.3s ease (consistent across interactive elements)

### Responsiveness
- Mobile-first approach
- Breakpoints: mobile < 640px, tablet < 1024px, desktop ≥ 1024px
- Use `clamp()` for fluid scaling (font sizes, padding)
- Navbar responsive: check `Navbar.tsx` for mobile collapse
- Grid auto-fits to 300px minimum column width

### Accessibility
- **Scrollbar styling**: Custom webkit scrollbar with `--border` → `--border-bright` hover
- **Font smoothing**: antialiased + grayscale for crisp text
- **Scroll behavior**: `scroll-behavior: auto` (no smooth scroll)
- **Box sizing**: `border-box` globally
