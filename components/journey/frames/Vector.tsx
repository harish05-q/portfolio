"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { projects } from "@/lib/data";
import { embeddingLayout, mulberry32, searchProjects, type SearchHit } from "@/lib/journey";
import { type FrameCtx, FrameShell, useRise } from "../ui";

const SUGGESTIONS = ["payments", "graph", "sql", "rag", "machine learning"];
const TAU = Math.PI * 2;

type Live = { hover: string | null; top: SearchHit[]; reduced: boolean };

function EmbeddingMap({
  hover,
  top,
  reduced,
  onHover,
  onSelect,
}: {
  hover: string | null;
  top: SearchHit[];
  reduced: boolean;
  onHover: (slug: string | null) => void;
  onSelect: (slug: string) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const live = useRef<Live>({ hover, top, reduced });

  useEffect(() => {
    live.current = { hover, top, reduced };
  });

  const cloud = useMemo(() => {
    const rand = mulberry32(11);
    const centers = [
      ...Object.values(embeddingLayout),
      { x: 0.45, y: 0.58 },
      { x: 0.7, y: 0.14 },
      { x: 0.1, y: 0.5 },
      { x: 0.92, y: 0.55 },
    ];
    return Array.from({ length: 280 }, () => {
      const c = centers[Math.floor(rand() * centers.length)];
      const a = rand() * TAU;
      const r = Math.pow(rand(), 1.6) * 0.11;
      return {
        x: Math.min(0.97, Math.max(0.03, c.x + Math.cos(a) * r)),
        y: Math.min(0.96, Math.max(0.04, c.y + Math.sin(a) * r * 0.85)),
        phase: rand() * TAU,
        size: 0.8 + rand() * 1.1,
      };
    });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = canvas?.parentElement;
    const g = canvas?.getContext("2d");
    if (!canvas || !wrap || !g) return;

    const fontFamily =
      getComputedStyle(document.body).getPropertyValue("--font-jetbrains").trim() ||
      "ui-monospace, monospace";

    let w = 0;
    let h = 0;
    let raf = 0;
    const PAD = 34;

    const resize = () => {
      const r = wrap.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width;
      h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    const px = (nx: number) => PAD + nx * (w - PAD * 2);
    const py = (ny: number) => PAD + ny * (h - PAD * 2);

    const nearest = (cx: number, cy: number, radius: number) => {
      let best: string | null = null;
      let bestD = radius;
      for (const [slug, p] of Object.entries(embeddingLayout)) {
        const d = Math.hypot(px(p.x) - cx, py(p.y) - cy);
        if (d < bestD) {
          bestD = d;
          best = slug;
        }
      }
      return best;
    };

    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      const slug = nearest(e.clientX - r.left, e.clientY - r.top, 30);
      if (slug !== live.current.hover) onHover(slug);
      canvas.style.cursor = slug ? "pointer" : "default";
    };
    const onLeave = () => onHover(null);
    const onClick = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      const slug = nearest(e.clientX - r.left, e.clientY - r.top, 36);
      if (slug) onSelect(slug);
    };
    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseleave", onLeave);
    canvas.addEventListener("click", onClick);

    // query-vector marker state (normalised coords)
    let qx = 0.5;
    let qy = 0.5;
    let qAlpha = 0;

    const draw = (t: number) => {
      const { hover: hv, top: tp, reduced: rd } = live.current;
      const time = rd ? 0 : t;
      g.clearRect(0, 0, w, h);

      // target for the query marker = similarity-weighted centroid of top hits
      let tx = 0.5;
      let ty = 0.5;
      let active = false;
      if (tp.length > 0 && tp[0].score > 0) {
        let sw = 0;
        tx = 0;
        ty = 0;
        for (const hit of tp) {
          const p = embeddingLayout[hit.project.slug];
          if (!p) continue;
          tx += p.x * hit.score;
          ty += p.y * hit.score;
          sw += hit.score;
        }
        if (sw > 0) {
          tx /= sw;
          ty /= sw;
          active = true;
        }
      }
      const k = rd ? 1 : 0.09;
      if (active) {
        qx += (tx - qx) * k;
        qy += (ty - qy) * k;
      }
      qAlpha += ((active ? 1 : 0) - qAlpha) * (rd ? 1 : 0.12);

      // faint grid
      g.strokeStyle = "rgba(246,240,228,0.05)";
      g.lineWidth = 1;
      for (let i = 1; i < 6; i++) {
        g.beginPath();
        g.moveTo(px(i / 6), PAD * 0.5);
        g.lineTo(px(i / 6), h - PAD * 0.5);
        g.stroke();
        g.beginPath();
        g.moveTo(PAD * 0.5, py(i / 6));
        g.lineTo(w - PAD * 0.5, py(i / 6));
        g.stroke();
      }

      // point cloud
      for (const p of cloud) {
        const x = px(p.x + Math.sin(time * 0.0004 + p.phase) * 0.004);
        const y = py(p.y + Math.cos(time * 0.00035 + p.phase) * 0.004);
        const near = qAlpha > 0.05 ? Math.hypot(p.x - qx, p.y - qy) : 1;
        const lit = near < 0.2 ? (1 - near / 0.2) * qAlpha : 0;
        g.fillStyle = lit > 0.02 ? `rgba(224,180,90,${0.3 + lit * 0.65})` : "rgba(246,240,228,0.28)";
        g.beginPath();
        g.arc(x, y, p.size + lit * 1.4, 0, TAU);
        g.fill();
      }

      // similarity lines from the query vector
      if (qAlpha > 0.02) {
        for (const hit of tp) {
          const p = embeddingLayout[hit.project.slug];
          if (!p) continue;
          g.strokeStyle = `rgba(224,180,90,${(0.15 + hit.score * 0.6) * qAlpha})`;
          g.lineWidth = 1 + hit.score * 1.2;
          g.setLineDash([4, 5]);
          g.beginPath();
          g.moveTo(px(qx), py(qy));
          g.lineTo(px(p.x), py(p.y));
          g.stroke();
          g.setLineDash([]);
        }
      }

      // project nodes + labels
      const lit = new Set(tp.filter((x) => x.score > 0.3).map((x) => x.project.slug));
      g.font = `11px ${fontFamily}`;
      g.textBaseline = "middle";
      for (const proj of projects) {
        const p = embeddingLayout[proj.slug];
        if (!p) continue;
        const x = px(p.x);
        const y = py(p.y);
        const isHot = hv === proj.slug || lit.has(proj.slug);
        const pulse = isHot && !rd ? Math.sin(time * 0.006) * 1.2 : 0;

        if (isHot) {
          g.fillStyle = "rgba(193,89,43,0.18)";
          g.beginPath();
          g.arc(x, y, 17 + pulse, 0, TAU);
          g.fill();
        }
        g.fillStyle = p.color;
        g.beginPath();
        g.arc(x, y, isHot ? 7 : 5, 0, TAU);
        g.fill();
        g.strokeStyle = "rgba(246,240,228,0.85)";
        g.lineWidth = 1.2;
        g.beginPath();
        g.arc(x, y, isHot ? 10 : 8, 0, TAU);
        g.stroke();

        g.fillStyle = isHot ? "#f6f0e4" : "rgba(246,240,228,0.72)";
        const left = p.x > 0.7;
        g.textAlign = left ? "right" : "left";
        g.fillText(p.label, x + (left ? -15 : 15), y);
      }

      // the query vector itself
      if (qAlpha > 0.02) {
        const x = px(qx);
        const y = py(qy);
        const s = 7 + (rd ? 0 : Math.sin(time * 0.008) * 1.5);
        g.save();
        g.globalAlpha = qAlpha;
        g.fillStyle = "#e0b45a";
        g.beginPath();
        g.moveTo(x, y - s);
        g.lineTo(x + s, y);
        g.lineTo(x, y + s);
        g.lineTo(x - s, y);
        g.closePath();
        g.fill();
        g.fillStyle = "#e0b45a";
        g.textAlign = "left";
        g.fillText("query", x + 12, y - 12);
        g.restore();
      }

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseleave", onLeave);
      canvas.removeEventListener("click", onClick);
    };
  }, [cloud, onHover, onSelect]);

  return (
    <div className="relative h-[300px] w-full md:h-[420px]">
      <canvas
        ref={canvasRef}
        role="img"
        aria-label="2D map of projects in an embedding space. Related projects sit close together."
        className="absolute inset-0"
      />
    </div>
  );
}

export default function Vector({ ctx }: { ctx: FrameCtx }) {
  const rise = useRise();
  const [query, setQuery] = useState("");
  const [hover, setHover] = useState<string | null>(null);
  const { openProject } = ctx;

  const hits = useMemo(() => searchProjects(query), [query]);
  const hasQuery = query.trim().length > 0;
  const top = useMemo(() => (hasQuery ? hits.filter((h) => h.score > 0).slice(0, 3) : []), [hasQuery, hits]);
  const rows: { slug: string; name: string; tagline: string; score?: number }[] = hasQuery
    ? hits.filter((h) => h.score > 0).slice(0, 4).map((h) => ({
        slug: h.project.slug,
        name: h.project.name,
        tagline: h.project.tagline,
        score: h.score,
      }))
    : projects.map((p) => ({ slug: p.slug, name: p.name, tagline: p.tagline }));

  return (
    <FrameShell
      eyebrow="05 · Vector store"
      title="Ask the index."
      note={`// embedding space: ${projects.length} projects, 1 query vector`}
    >
      <div className="grid gap-6 lg:grid-cols-[1.35fr_1fr] lg:gap-8">
        <motion.div {...rise(0)} className="j-card overflow-hidden">
          <EmbeddingMap
            hover={hover}
            top={top}
            reduced={ctx.reduced}
            onHover={setHover}
            onSelect={openProject}
          />
        </motion.div>

        <motion.div {...rise(1)} className="flex flex-col">
          <label htmlFor="vector-query" className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--taupe)]">
            query
          </label>
          <input
            id="vector-query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setQuery("");
                e.currentTarget.blur();
              }
            }}
            placeholder="payments, graph, sql, rag…"
            autoComplete="off"
            spellCheck={false}
            className="j-focus mt-2 w-full rounded-xl border border-[var(--line-dark)] bg-[var(--parchment)]/[0.04] px-4 py-3 font-mono text-sm outline-none placeholder:text-[var(--taupe)]/60 focus:border-[var(--ochre)]"
          />

          <div className="mt-3 flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => setQuery(s)}
                data-cursor-hover
                className="j-chip j-focus transition-colors hover:border-[var(--ochre)] hover:text-[var(--ochre)]"
              >
                {s}
              </button>
            ))}
          </div>

          <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--taupe)]">
            {hasQuery ? "nearest neighbours" : "all projects · click one, or ask above"}
          </p>
          {!hasQuery && (
            <div className="mt-2 flex flex-wrap gap-2">
              {rows.map((r) => (
                <button
                  key={r.slug}
                  onClick={() => openProject(r.slug)}
                  onMouseEnter={() => setHover(r.slug)}
                  onMouseLeave={() => setHover(null)}
                  onFocus={() => setHover(r.slug)}
                  onBlur={() => setHover(null)}
                  title={r.tagline}
                  data-cursor-hover
                  className={`j-chip j-focus !px-3.5 !py-1.5 !text-xs transition-colors ${
                    hover === r.slug ? "!border-[var(--ochre)] !text-[var(--ochre)]" : ""
                  }`}
                >
                  {r.name}
                </button>
              ))}
            </div>
          )}
          <ul className={`mt-2 space-y-2 ${hasQuery ? "" : "hidden"}`}>
            {rows.length === 0 && (
              <li className="rounded-xl border border-[var(--line-dark)] px-4 py-3 text-sm text-[var(--taupe)]">
                No neighbours within range. Try “backend”, “llm” or “search”.
              </li>
            )}
            {rows.map((r) => (
              <li key={r.slug}>
                <button
                  onClick={() => openProject(r.slug)}
                  onMouseEnter={() => setHover(r.slug)}
                  onMouseLeave={() => setHover(null)}
                  onFocus={() => setHover(r.slug)}
                  onBlur={() => setHover(null)}
                  data-cursor-hover
                  className={`j-focus w-full rounded-xl border px-4 py-2.5 text-left transition-colors ${
                    hover === r.slug
                      ? "border-[var(--ochre)] bg-[var(--parchment)]/[0.08]"
                      : "border-[var(--line-dark)] hover:bg-[var(--parchment)]/[0.05]"
                  }`}
                >
                  <span className="flex items-center justify-between gap-3">
                    <span className="text-sm font-medium">{r.name}</span>
                    {r.score !== undefined && (
                      <span className="font-mono text-xs tabular-nums text-[var(--ochre)]">
                        {r.score.toFixed(2)}
                      </span>
                    )}
                  </span>
                  <span className="mt-0.5 block truncate text-xs text-[var(--parchment)]/60">
                    {r.tagline}
                  </span>
                  {r.score !== undefined && (
                    <span className="mt-2 block h-0.5 rounded bg-[var(--line-dark)]">
                      <span
                        className="block h-0.5 rounded bg-[var(--ochre)] transition-all duration-500"
                        style={{ width: `${Math.round(r.score * 100)}%` }}
                      />
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>

          <p className="mt-4 text-[11px] leading-relaxed text-[var(--taupe)]">
            Honest note: this box does a lightweight keyword + synonym match in your browser, not a
            real embedding model. The real vector search lives in the projects above.
          </p>
        </motion.div>
      </div>
    </FrameShell>
  );
}
