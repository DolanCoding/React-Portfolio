import { useState, useRef, useEffect, type CSSProperties } from "react";
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
                    opacity={0.6}
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
                            filter="url(#pill-shadow)"
                          />
                          {/* Gradient overlay */}
                          <rect
                            x={s.x - W / 2}
                            y={s.y - H / 2}
                            width={W}
                            height={H}
                            rx={H / 2}
                            fill={`url(#grad-${section.label})`}
                            filter={isHovered ? `url(#pill-glow)` : undefined}
                            stroke={section.color}
                            strokeWidth={isHovered ? 1.5 : 1}
                            strokeOpacity={isHovered ? 1 : 0.45}
                          />
                          <text
                            x={s.x}
                            y={s.y}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fontSize={10}
                            fill={isHovered ? section.color : "var(--text-secondary)"}
                            fontFamily="var(--font-sans)"
                            fontWeight={isHovered ? "600" : "400"}
                          >
                            {skill}
                          </text>
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
                      fill="var(--bg-card)"
                      filter="url(#circle-shadow)"
                    />
                    <circle
                      cx={cat.x}
                      cy={cat.y}
                      r={36}
                      fill={`url(#circle-grad-${section.label})`}
                      stroke={section.color}
                      strokeWidth={1.5}
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

            {/* Center hub */}
            <g className="anim-hub">
              <circle cx={CX} cy={CY} r={50} fill="var(--bg-card)" filter="url(#circle-shadow)" />
              <circle
                cx={CX}
                cy={CY}
                r={50}
                fill="url(#hub-grad)"
                stroke="var(--border-bright)"
                strokeWidth={1.5}
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
