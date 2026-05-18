import { useState, useRef, useEffect, type CSSProperties } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faReact,
  faAngular,
  faJs,
  faPython,
  faNode,
  faHtml5,
  faCss3Alt,
} from "@fortawesome/free-brands-svg-icons";
import { faDatabase, faCode, faCog } from "@fortawesome/free-solid-svg-icons";
import "./Skills.css";

const CX = 400;
const CY = 400;
const CAT_R = 190;
const SKILL_R = 345;

const SECTIONS = [
  {
    label: "Frontend",
    angle: -90,
    color: "#3b82f6",
    skills: ["React", "Angular", "TypeScript", "Next.js", "JavaScript", "HTML / CSS", "Tailwind"],
  },
  {
    label: "Backend",
    angle: 30,
    color: "#10b981",
    skills: ["Node.js", "Express", "Python", "REST APIs"],
  },
  {
    label: "Databases",
    angle: 150,
    color: "#f59e0b",
    skills: ["PostgreSQL", "MongoDB", "SQL"],
  },
];

const getOffsets = (n: number): number[] => {
  if (n === 1) return [0];
  const spread = (n - 1) * 18;
  const start = -spread / 2;
  return Array.from({ length: n }, (_, i) => start + i * 18);
};

const toRad = (deg: number) => (deg * Math.PI) / 180;
const pt = (r: number, deg: number) => ({
  x: CX + r * Math.cos(toRad(deg)),
  y: CY + r * Math.sin(toRad(deg)),
});

// Map skills to their corresponding FontAwesome icons
const skillIcons: Record<string, any> = {
  React: faReact,
  Angular: faAngular,
  TypeScript: faCode,
  "Next.js": faReact,
  JavaScript: faJs,
  "HTML / CSS": faHtml5,
  Tailwind: faCss3Alt,
  "Node.js": faNode,
  Express: faCog,
  Python: faPython,
  "REST APIs": faCode,
  PostgreSQL: faDatabase,
  MongoDB: faDatabase,
  SQL: faDatabase,
};

export default function Skills() {
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const [inView, setInView] = useState(false);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(
    () => () => {
      if (leaveTimer.current) clearTimeout(leaveTimer.current);
    },
    []
  );

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const handleEnter = (key: string) => {
    if (leaveTimer.current) {
      clearTimeout(leaveTimer.current);
      leaveTimer.current = null;
    }
    setHoveredSkill(key);
  };

  const handleLeave = () => {
    leaveTimer.current = setTimeout(() => {
      setHoveredSkill(null);
      leaveTimer.current = null;
    }, 300);
  };

  return (
    <section className="skills" id="skills" ref={sectionRef}>
      <div className="skills-container">
        <h2 className="skills-heading">Skills & Technologies</h2>

        {/* Mobile tag-pill layout */}
        <div className={`skills-mobile${inView ? " animated" : ""}`}>
          {SECTIONS.map((section, si) => (
            <div
              key={section.label}
              className={`skills-mobile-group${inView ? " animate-in" : ""}`}
              style={{ "--delay": `${si * 130}ms` } as CSSProperties}
            >
              <div className="skills-mobile-label" style={{ color: section.color }}>
                {section.label}
              </div>
              <div className="skills-mobile-pills">
                {section.skills.map((skill, pi) => (
                  <span
                    key={skill}
                    className={`skills-mobile-pill${inView ? " animate-in" : ""}`}
                    style={
                      {
                        borderColor: section.color,
                        color: section.color,
                        "--delay": `${si * 130 + pi * 45 + 200}ms`,
                      } as CSSProperties
                    }
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="skills-mindmap">
          <svg
            viewBox="0 0 800 800"
            className={`mindmap-svg${inView ? " animated" : ""}`}
          >
            <defs>
              {SECTIONS.map((section) => (
                <linearGradient
                  key={`grad-${section.label}`}
                  id={`grad-${section.label}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor={section.color} stopOpacity={0.18} />
                  <stop offset="100%" stopColor={section.color} stopOpacity={0.04} />
                </linearGradient>
              ))}
              {SECTIONS.map((section) => (
                <radialGradient
                  key={`circle-grad-${section.label}`}
                  id={`circle-grad-${section.label}`}
                  cx="38%"
                  cy="32%"
                  r="65%"
                >
                  <stop offset="0%" stopColor={section.color} stopOpacity={0.22} />
                  <stop offset="100%" stopColor={section.color} stopOpacity={0.03} />
                </radialGradient>
              ))}
              <radialGradient id="hub-grad" cx="38%" cy="32%" r="65%">
                <stop offset="0%" stopColor="var(--border-bright)" stopOpacity={0.25} />
                <stop offset="100%" stopColor="var(--border-bright)" stopOpacity={0.02} />
              </radialGradient>
              <filter id="circle-shadow" x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow
                  dx="0"
                  dy="3"
                  stdDeviation="4"
                  floodOpacity="0.55"
                  floodColor="#000"
                />
              </filter>
              <filter id="pill-shadow" x="-20%" y="-40%" width="140%" height="180%">
                <feDropShadow
                  dx="0"
                  dy="2"
                  stdDeviation="2.5"
                  floodOpacity="0.5"
                  floodColor="#000"
                />
              </filter>
              <filter id="pill-glow" x="-30%" y="-60%" width="160%" height="220%">
                <feDropShadow dx="0" dy="0" stdDeviation="5" floodOpacity="0.6" />
              </filter>
              {/* Enhanced glow filters for entrance animations */}
              <filter id="hub-glow-entrance" x="-60%" y="-60%" width="220%" height="220%">
                <feDropShadow
                  dx="0"
                  dy="0"
                  stdDeviation="6"
                  floodColor="var(--accent)"
                  floodOpacity="0.4"
                />
              </filter>
              <filter id="cat-glow-entrance" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow
                  dx="0"
                  dy="0"
                  stdDeviation="4"
                  floodColor="var(--accent)"
                  floodOpacity="0.3"
                />
              </filter>
              {/* Background glow behind mindmap */}
              <radialGradient id="mindmap-bg-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.04" />
                <stop offset="70%" stopColor="var(--accent)" stopOpacity="0.01" />
                <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
              </radialGradient>
              {/* 3D effect gradients for circles - sphere with top-left lighting */}
              <radialGradient id="sphere-3d-hub" cx="30%" cy="30%" r="55%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.15)" />
                <stop offset="35%" stopColor="rgba(255,255,255,0.02)" />
                <stop offset="70%" stopColor="rgba(0,0,0,0.05)" />
                <stop offset="100%" stopColor="rgba(0,0,0,0.4)" />
              </radialGradient>
              {SECTIONS.map((section) => (
                <radialGradient
                  key={`sphere-3d-${section.label}`}
                  id={`sphere-3d-${section.label}`}
                  cx="30%"
                  cy="30%"
                  r="55%"
                >
                  <stop offset="0%" stopColor="rgba(255,255,255,0.22)" />
                  <stop offset="35%" stopColor="rgba(255,255,255,0.06)" />
                  <stop offset="70%" stopColor="rgba(0,0,0,0.04)" />
                  <stop offset="100%" stopColor="rgba(0,0,0,0.35)" />
                </radialGradient>
              ))}
              {/* Refined shadow filter for pills */}
              <filter id="pill-shadow-3d" x="-40%" y="-60%" width="180%" height="220%">
                <feDropShadow dx="0" dy="3" stdDeviation="2" floodOpacity="0.7" floodColor="#000" />
                <feDropShadow dx="0" dy="6" stdDeviation="4" floodOpacity="0.35" floodColor="#000" />
                <feDropShadow dx="0" dy="10" stdDeviation="8" floodOpacity="0.12" floodColor="#000" />
              </filter>
              {/* Lightning/glow emission filter for pills on hover */}
              <filter id="pill-emit" x="-50%" y="-80%" width="200%" height="260%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="0.8" result="coloredBlur" />
                <feDropShadow dx="0" dy="0" stdDeviation="5" floodOpacity="0.6" />
                <feDropShadow dx="0" dy="1" stdDeviation="10" floodOpacity="0.35" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {SECTIONS.map((section, si) => {
              const cat = pt(CAT_R, section.angle);

              return (
                <g key={section.label}>
                  {/* Center → category spoke */}
                  <line
                    className="anim-spoke"
                    style={{ "--delay": `${80 + si * 70}ms` } as CSSProperties}
                    x1={CX}
                    y1={CY}
                    x2={cat.x}
                    y2={cat.y}
                    stroke={section.color}
                    strokeWidth={2}
                    opacity={0.65}
                    strokeLinecap="round"
                  />

                  {/* Category → skill lines + skill pills */}
                  {section.skills.map((skill, i) => {
                    const skillAngle = section.angle + getOffsets(section.skills.length)[i];
                    const s = pt(SKILL_R, skillAngle);
                    const W = 96,
                      H = 28;
                    const isHovered = hoveredSkill === `${section.label}-${skill}`;
                    const key = `${section.label}-${skill}`;

                    return (
                      <g
                        key={skill}
                        className="anim-skill-group"
                        style={{ "--delay": `${380 + si * 70 + i * 38}ms` } as CSSProperties}
                      >
                        {/* Non-interactive connecting line */}
                        <line
                          x1={cat.x}
                          y1={cat.y}
                          x2={s.x}
                          y2={s.y}
                          stroke={section.color}
                          strokeWidth={isHovered ? 2 : 1.5}
                          opacity={isHovered ? 0.9 : 0.45}
                          strokeDasharray="4 3"
                          pointerEvents="none"
                        />
                        {/* Interactive pill only */}
                        <g
                          style={{
                            cursor: "pointer",
                            transform: isHovered
                              ? `translate(${s.x}px, ${s.y}px) scale(1.12) translate(${-s.x}px, ${-s.y}px)`
                              : "none",
                            transition: "transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
                          }}
                          onMouseEnter={() => handleEnter(key)}
                          onMouseLeave={handleLeave}
                        >
                          {/* Base pill */}
                          <rect
                            x={s.x - W / 2}
                            y={s.y - H / 2}
                            width={W}
                            height={H}
                            rx={H / 2}
                            fill="var(--bg-card)"
                            filter={isHovered ? "url(#pill-shadow-3d)" : "url(#pill-shadow)"}
                            style={{
                              transition: "filter 0.35s ease, fill 0.3s ease",
                            }}
                          />
                          {/* Gradient overlay with 3D depth */}
                          <rect
                            x={s.x - W / 2}
                            y={s.y - H / 2}
                            width={W}
                            height={H}
                            rx={H / 2}
                            fill={`url(#grad-${section.label})`}
                            filter={isHovered ? `url(#pill-emit)` : undefined}
                            stroke={section.color}
                            strokeWidth={isHovered ? 2 : 1.25}
                            strokeOpacity={isHovered ? 1 : 0.55}
                            style={{
                              transition: "stroke-width 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), stroke-opacity 0.35s ease, filter 0.35s ease",
                            }}
                          />
                          {/* Top highlight for 3D depth */}
                          <ellipse
                            cx={s.x}
                            cy={s.y - H / 3}
                            rx={W / 2.5}
                            ry={H / 4.5}
                            fill="rgba(255,255,255,0.15)"
                            pointerEvents="none"
                            style={{
                              transition: "fill 0.35s ease",
                            }}
                            opacity={isHovered ? 1 : 0.8}
                          />
                          {/* Icon and text centered in pill */}
                          <foreignObject
                            x={s.x - W / 2}
                            y={s.y - H / 2}
                            width={W}
                            height={H}
                            pointerEvents="none"
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "4px",
                                width: "100%",
                                height: "100%",
                                fontSize: "10px",
                                color: isHovered ? section.color : "var(--text-secondary)",
                                fontWeight: isHovered ? "600" : "400",
                                fontFamily: "var(--font-sans)",
                                transition: "color 0.35s ease, font-weight 0.35s ease",
                              }}
                            >
                              <FontAwesomeIcon
                                icon={skillIcons[skill] || faCode}
                                style={{
                                  fontSize: "11px",
                                  color: "currentColor",
                                }}
                              />
                              <span>{skill}</span>
                            </div>
                          </foreignObject>
                        </g>
                      </g>
                    );
                  })}

                  {/* Category node */}
                  <g
                    className="anim-cat"
                    style={{ "--delay": `${220 + si * 70}ms` } as CSSProperties}
                  >
                    <circle
                      cx={cat.x}
                      cy={cat.y}
                      r={36}
                      fill={`url(#circle-grad-${section.label})`}
                      stroke={section.color}
                      strokeWidth={2}
                      style={{
                        transition: "stroke-width 0.3s ease",
                      }}
                    />
                    <circle
                      cx={cat.x}
                      cy={cat.y}
                      r={36.5}
                      fill="var(--bg-card)"
                      pointerEvents="none"
                    />
                    {/* 3D sphere effect overlay */}
                    <circle
                      cx={cat.x}
                      cy={cat.y}
                      r={36}
                      fill={`url(#sphere-3d-${section.label})`}
                      pointerEvents="none"
                      opacity={0.8}
                    />
                    <text
                      x={cat.x}
                      y={cat.y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize={11.5}
                      fontWeight="600"
                      fill={section.color}
                      fontFamily="var(--font-sans)"
                    >
                      {section.label}
                    </text>
                  </g>
                </g>
              );
            })}

            {/* Background glow behind entire mindmap */}
            <circle
              cx={CX}
              cy={CY}
              r={380}
              fill="url(#mindmap-bg-glow)"
              pointerEvents="none"
            />

            {/* Center hub */}
            <g className="anim-hub">
              <circle
                cx={CX}
                cy={CY}
                r={50}
                fill="url(#hub-grad)"
                stroke="var(--border-bright)"
                strokeWidth={2}
              />
              <circle cx={CX} cy={CY} r={50.5} fill="var(--bg-card)" pointerEvents="none" />
              {/* 3D sphere effect overlay */}
              <circle
                cx={CX}
                cy={CY}
                r={50}
                fill="url(#sphere-3d-hub)"
                pointerEvents="none"
                opacity={0.9}
              />
              <text
                x={CX}
                y={CY - 8}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={12}
                fontWeight="700"
                fill="var(--text-primary)"
                fontFamily="var(--font-sans)"
              >
                My Tech
              </text>
              <text
                x={CX}
                y={CY + 8}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={12}
                fontWeight="700"
                fill="var(--text-primary)"
                fontFamily="var(--font-sans)"
              >
                Stack
              </text>
            </g>
          </svg>
        </div>
      </div>
    </section>
  );
}
