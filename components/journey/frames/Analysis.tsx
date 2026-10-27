"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { projects } from "@/lib/data";
import { type FrameCtx, FrameShell, ProjectLinks, StackChips, useRise } from "../ui";

/* A hand-mapped dependency graph of THIS site, in the spirit of what
   CodeAutopsy does automatically for any repository. */

type GNode = {
  id: string;
  label: string;
  x: number;
  y: number;
  external?: boolean;
  desc: string;
};

const NODES: GNode[] = [
  { id: "page", label: "app/page.tsx", x: 62, y: 210, desc: "Server entry. Renders the journey plus a plain-text copy of everything on it for search engines and screen readers." },
  { id: "journey", label: "Journey.tsx", x: 190, y: 210, desc: "Owns navigation state, keyboard / wheel / swipe input and the HUD. One layer deeper per step." },
  { id: "backdrop", label: "Backdrop.tsx", x: 350, y: 40, desc: "react-three-fiber tunnel. The camera flies one gate deeper per frame; falls back to CSS without WebGL." },
  { id: "rail", label: "TraceRail.tsx", x: 350, y: 115, desc: "The trace waterfall at the bottom of the screen. Click a span to jump to that layer." },
  { id: "palette", label: "CommandPalette", x: 350, y: 190, desc: "Press / or ⌘K: fuzzy jump to any layer, project or link." },
  { id: "drawer", label: "ProjectDrawer", x: 350, y: 265, desc: "Slide-over case study for any project. Focus-trapped, Esc to close." },
  { id: "frames", label: "frames/*", x: 350, y: 350, desc: "The eight layers, one component each: Hero, Edge, Service, Agent, Vector, Analysis, Incident, Response." },
  { id: "journeyLib", label: "journey.ts", x: 500, y: 130, desc: "Frame config, the trace timings and the lightweight project search." },
  { id: "data", label: "data.ts", x: 500, y: 250, desc: "All content lives here. Edit once; the journey, the classic view and the text-only copy all update." },
  { id: "ui", label: "ui.tsx", x: 500, y: 350, desc: "Shared shells, chips and the count-up / rise-in helpers." },
  { id: "r3f", label: "r3f · three", x: 618, y: 40, external: true, desc: "External dependency: WebGL scene graph." },
  { id: "framer", label: "framer-motion", x: 618, y: 350, external: true, desc: "External dependency: transitions and the stagger-in animations." },
];

const EDGES: [string, string][] = [
  ["page", "journey"],
  ["page", "data"],
  ["journey", "backdrop"],
  ["journey", "rail"],
  ["journey", "palette"],
  ["journey", "drawer"],
  ["journey", "frames"],
  ["journey", "journeyLib"],
  ["backdrop", "r3f"],
  ["rail", "journeyLib"],
  ["palette", "journeyLib"],
  ["palette", "data"],
  ["drawer", "data"],
  ["frames", "ui"],
  ["frames", "journeyLib"],
  ["frames", "data"],
  ["ui", "framer"],
  ["journeyLib", "data"],
];

const W = 120;
const H = 28;

export default function Analysis({ ctx }: { ctx: FrameCtx }) {
  const rise = useRise();
  const project = projects.find((p) => p.slug === "codeautopsy")!;
  const [selected, setSelected] = useState("data");

  const byId = useMemo(() => new Map(NODES.map((n) => [n.id, n])), []);
  const stats = useMemo(() => {
    const fanIn = new Map<string, number>();
    const fanOut = new Map<string, number>();
    for (const [a, b] of EDGES) {
      fanOut.set(a, (fanOut.get(a) ?? 0) + 1);
      fanIn.set(b, (fanIn.get(b) ?? 0) + 1);
    }
    const internal = NODES.filter((n) => !n.external);
    const hotspot = internal.reduce((best, n) =>
      (fanIn.get(n.id) ?? 0) > (fanIn.get(best.id) ?? 0) ? n : best,
    );
    return { fanIn, fanOut, hotspot: hotspot.id };
  }, []);

  const sel = byId.get(selected)!;
  const neighbours = new Set<string>([selected]);
  for (const [a, b] of EDGES) {
    if (a === selected) neighbours.add(b);
    if (b === selected) neighbours.add(a);
  }
  const fi = stats.fanIn.get(selected) ?? 0;
  const fo = stats.fanOut.get(selected) ?? 0;

  return (
    <FrameShell
      eyebrow="06 · Static analysis"
      title="CodeAutopsy, pointed at this site."
      note="// the graph on the right is the code you're looking at"
    >
      <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-10">
        <div>
          <motion.p {...rise(0)} className="text-lg leading-relaxed text-[var(--parchment)]/85">
            {project.tagline}
          </motion.p>
          <motion.ul {...rise(1)} className="mt-5 space-y-3">
            {project.approach.map((a) => (
              <li key={a} className="flex gap-3 text-sm leading-relaxed text-[var(--parchment)]/70">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[var(--ok)]" />
                {a}
              </li>
            ))}
          </motion.ul>
          <motion.div {...rise(2)} className="mt-6">
            <StackChips items={project.stack} />
          </motion.div>
          <motion.div {...rise(3)} className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
            <button
              onClick={() => ctx.openProject("codeautopsy")}
              data-cursor-hover
              className="j-focus rounded-full border border-[var(--parchment)]/30 px-5 py-2.5 text-sm transition-colors hover:border-[var(--ochre)] hover:text-[var(--ochre)]"
            >
              Read the full case study
            </button>
            <ProjectLinks project={project} />
          </motion.div>
        </div>

        <motion.div {...rise(2)} className="j-card p-4 md:p-5">
          <div className="flex items-center justify-between gap-3">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--taupe)]">
              dependency graph · click a node
            </p>
            <p className="font-mono text-[10px] text-[var(--taupe)]">hand-mapped</p>
          </div>

          <svg
            viewBox="0 0 690 390"
            className="mt-3 w-full"
            role="group"
            aria-label="Dependency graph of this website's source files"
          >
            <defs>
              <marker id="arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto">
                <path d="M0 0L8 4L0 8z" fill="rgba(246,240,228,0.45)" />
              </marker>
              <marker id="arrow-hot" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto">
                <path d="M0 0L8 4L0 8z" fill="#e0b45a" />
              </marker>
            </defs>

            {EDGES.map(([a, b]) => {
              const A = byId.get(a)!;
              const B = byId.get(b)!;
              const x1 = A.x + W / 2;
              const y1 = A.y;
              const x2 = B.x - W / 2 - 2;
              const y2 = B.y;
              const mx = (x1 + x2) / 2;
              const hot = a === selected || b === selected;
              return (
                <path
                  key={`${a}-${b}`}
                  d={`M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}`}
                  fill="none"
                  stroke={hot ? "#e0b45a" : "rgba(246,240,228,0.28)"}
                  strokeWidth={hot ? 1.6 : 1}
                  markerEnd={hot ? "url(#arrow-hot)" : "url(#arrow)"}
                  style={{ transition: "stroke 0.25s" }}
                />
              );
            })}

            {NODES.map((n) => {
              const isSel = n.id === selected;
              const dim = !neighbours.has(n.id);
              const hotspot = n.id === stats.hotspot;
              return (
                <g
                  key={n.id}
                  transform={`translate(${n.x - W / 2},${n.y - H / 2})`}
                  tabIndex={0}
                  role="button"
                  aria-label={`${n.label}${hotspot ? ", hotspot" : ""}`}
                  aria-pressed={isSel}
                  onClick={() => setSelected(n.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelected(n.id);
                    }
                  }}
                  data-cursor-hover
                  style={{ cursor: "pointer", opacity: dim ? 0.55 : 1, transition: "opacity 0.25s", outline: "none" }}
                >
                  <rect
                    width={W}
                    height={H}
                    rx={8}
                    fill={isSel ? "#c1592b" : "rgba(246,240,228,0.06)"}
                    stroke={hotspot ? "#e0b45a" : isSel ? "#c1592b" : "rgba(246,240,228,0.28)"}
                    strokeWidth={hotspot ? 1.6 : 1}
                    strokeDasharray={n.external ? "3 3" : undefined}
                  />
                  <text
                    x={W / 2}
                    y={H / 2 + 0.5}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={12}
                    fill="#f6f0e4"
                    style={{ fontFamily: "var(--font-jetbrains), ui-monospace, monospace" }}
                  >
                    {n.label}
                  </text>
                  {hotspot && (
                    <circle cx={W - 2} cy={2} r={4.5} fill="#e0b45a" />
                  )}
                </g>
              );
            })}
          </svg>

          <div className="mt-3 rounded-xl border border-[var(--line-dark)] bg-[var(--umber-deep)]/60 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-mono text-sm text-[var(--ochre)]">{sel.label}</p>
              <p className="font-mono text-[11px] text-[var(--taupe)]">
                fan-in {fi} · fan-out {fo}
              </p>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-[var(--parchment)]/75">{sel.desc}</p>
            {selected === stats.hotspot && (
              <p className="mt-3 font-mono text-[11px] leading-relaxed text-[var(--warn)]">
                ● hotspot: highest fan-in, so a change here ripples to {fi} modules. On purpose: every word on the site lives in one file.
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </FrameShell>
  );
}
