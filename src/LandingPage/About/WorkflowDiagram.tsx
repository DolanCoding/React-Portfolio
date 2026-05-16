import "./WorkflowDiagram.css";

const NODES = [
  { key: "visualize", label: "Visualize", type: "rect" as const },
  { key: "prototype", label: "Prototype", type: "rect" as const },
  { key: "specify", label: "Specify", type: "rect" as const },
  { key: "refine", label: "Refine", type: "rect" as const },
  { key: "decision", label: "New idea?", type: "diamond" as const },
  { key: "finalize", label: "Finalize", type: "rect" as const },
];

const VB_W = 560;
const VB_H = 130;
const CENTER_Y = VB_H / 2;

const RECT_W = 76;
const RECT_H = 50;
const DIAMOND_W = 90;
const DIAMOND_H = 54;
const GAP = 12;
const LOOP_Y = VB_H - 6;
const LOOP_X = 6;

function buildLayout() {
  let x = 20;
  return NODES.map((node) => {
    const w = node.type === "rect" ? RECT_W : DIAMOND_W;
    const h = node.type === "rect" ? RECT_H : DIAMOND_H;
    const pos = { ...node, x, y: CENTER_Y - h / 2, w, h };
    x += w + GAP;
    return pos;
  });
}

export default function WorkflowDiagram() {
  const nodes = buildLayout();
  const decision = nodes[4];
  const visualize = nodes[0];

  const decisionBottom = { x: decision.x + decision.w / 2, y: decision.y + decision.h };
  const decisionRight = { x: decision.x + decision.w, y: decision.y + decision.h / 2 };
  const visualizeLeft = { x: visualize.x, y: CENTER_Y };

  const loopPath = [
    `M ${decisionBottom.x} ${decisionBottom.y}`,
    `V ${LOOP_Y}`,
    `H ${LOOP_X}`,
    `V ${visualizeLeft.y}`,
    `H ${visualizeLeft.x}`,
  ].join(" ");

  return (
    <svg
      className="workflow-svg"
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <marker
          id="wf-arrow"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="5"
          markerHeight="5"
          orient="auto"
        >
          <path d="M0 0 L10 5 L0 10 z" className="wf-arrow-head" />
        </marker>
        <marker
          id="wf-arrow-loop"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="5"
          markerHeight="5"
          orient="auto"
        >
          <path d="M0 0 L10 5 L0 10 z" className="wf-arrow-head loop" />
        </marker>
      </defs>

      {/* Nodes */}
      {nodes.map((n) => (
        <g
          key={n.key}
          transform={`translate(${n.x},${n.y})`}
          className={`wf-node${n.type === "diamond" ? " wf-decision" : ""}`}
        >
          {n.type === "rect" ? (
            <rect width={n.w} height={n.h} rx={5} />
          ) : (
            <polygon points={`${n.w / 2},0 ${n.w},${n.h / 2} ${n.w / 2},${n.h} 0,${n.h / 2}`} />
          )}
          <text x={n.w / 2} y={n.h / 2}>
            {n.label}
          </text>
        </g>
      ))}

      {/* Connector arrows */}
      {nodes.slice(0, -1).map((a, i) => {
        const b = nodes[i + 1];
        return (
          <path
            key={`edge-${i}`}
            d={`M${a.x + a.w},${a.y + a.h / 2} L${b.x},${b.y + b.h / 2}`}
            className="wf-edge"
            markerEnd="url(#wf-arrow)"
          />
        );
      })}

      {/* Labels */}
      <text x={decisionRight.x - 6} y={decisionRight.y - 10} className="wf-label">
        No
      </text>
      <text x={decisionBottom.x + 4} y={decisionBottom.y + 12} className="wf-label">
        Yes
      </text>

      {/* Loop path */}
      <path d={loopPath} className="wf-loop" markerEnd="url(#wf-arrow-loop)" />
    </svg>
  );
}
