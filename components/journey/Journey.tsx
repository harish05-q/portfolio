"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Search } from "lucide-react";
import { profile } from "@/lib/data";
import { frames } from "@/lib/journey";
import TraceRail from "./TraceRail";
import CommandPalette from "./CommandPalette";
import ProjectDrawer from "./ProjectDrawer";
import { type FrameCtx, EASE } from "./ui";
import Hero from "./frames/Hero";
import Edge from "./frames/Edge";
import Service from "./frames/Service";
import Agent from "./frames/Agent";
import Vector from "./frames/Vector";
import Analysis from "./frames/Analysis";
import Incident from "./frames/Incident";
import Response from "./frames/Response";

const Backdrop = dynamic(() => import("./Backdrop"), { ssr: false });

const FRAME_COMPONENTS = [Hero, Edge, Service, Agent, Vector, Analysis, Incident, Response];
const LAST = frames.length - 1;
const clamp = (n: number) => Math.min(LAST, Math.max(0, n));

/** True when a scroll container can't scroll any further in `dir`. */
function atEdge(el: HTMLElement, dir: 1 | -1) {
  return dir > 0
    ? el.scrollTop + el.clientHeight >= el.scrollHeight - 2
    : el.scrollTop <= 2;
}

function isTypingTarget(t: EventTarget | null) {
  const el = t as HTMLElement | null;
  if (!el) return false;
  return (
    el.tagName === "INPUT" ||
    el.tagName === "TEXTAREA" ||
    el.tagName === "SELECT" ||
    el.isContentEditable
  );
}

export default function Journey() {
  const reducedPref = useReducedMotion();
  const reduced = !!reducedPref;

  const [nav, setNav] = useState({ index: 0, dir: 1 });
  const [palette, setPalette] = useState(false);
  const [projectSlug, setProjectSlug] = useState<string | null>(null);

  const overlay = palette || projectSlug !== null;

  const go = useCallback((to: number) => {
    setNav((p) => {
      const i = clamp(to);
      return i === p.index ? p : { index: i, dir: i > p.index ? 1 : -1 };
    });
  }, []);
  const step = useCallback((d: number) => {
    setNav((p) => {
      const i = clamp(p.index + d);
      return i === p.index ? p : { index: i, dir: d > 0 ? 1 : -1 };
    });
  }, []);
  const openPalette = useCallback(() => setPalette(true), []);
  const closePalette = useCallback(() => setPalette(false), []);
  const openProject = useCallback((slug: string) => setProjectSlug(slug), []);
  const closeProject = useCallback(() => setProjectSlug(null), []);

  /* ── keyboard ── */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // palette toggle works from anywhere, except while a project sheet is open
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (projectSlug === null) setPalette((o) => !o);
        return;
      }
      if (overlay || e.altKey || e.metaKey || e.ctrlKey) return;
      if (isTypingTarget(e.target)) return;

      const onButton = (e.target as HTMLElement)?.closest?.("button, a, [role=button]");
      switch (e.key) {
        case "/":
          e.preventDefault();
          setPalette(true);
          break;
        case "ArrowDown":
        case "PageDown":
          e.preventDefault();
          step(1);
          break;
        case "ArrowUp":
        case "PageUp":
          e.preventDefault();
          step(-1);
          break;
        case " ":
          if (onButton) return; // let buttons keep their native Space behaviour
          e.preventDefault();
          step(e.shiftKey ? -1 : 1);
          break;
        case "Home":
          e.preventDefault();
          go(0);
          break;
        case "End":
          e.preventDefault();
          go(LAST);
          break;
        default:
          if (/^[1-8]$/.test(e.key)) go(Number(e.key) - 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [overlay, projectSlug, step, go]);

  /* ── wheel + touch ── */
  const lastNav = useRef(0);
  const lastWheel = useRef(0);
  const touch = useRef<{ y: number; scroller: HTMLElement | null } | null>(null);

  const onWheel = (e: React.WheelEvent) => {
    if (overlay || Math.abs(e.deltaY) < 8) return;
    const now = performance.now();
    const gap = now - lastWheel.current;
    lastWheel.current = now;
    // ignore trackpad inertia that trails a navigation we just made
    if (now - lastNav.current < 900 || (gap < 90 && now - lastNav.current < 1600)) return;

    const dir: 1 | -1 = e.deltaY > 0 ? 1 : -1;
    const scroller = (e.target as HTMLElement).closest<HTMLElement>("[data-scroll]");
    if (scroller && !atEdge(scroller, dir)) return; // let long frames scroll first
    lastNav.current = now;
    step(dir);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touch.current = {
      y: e.touches[0].clientY,
      scroller: (e.target as HTMLElement).closest<HTMLElement>("[data-scroll]"),
    };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touch.current;
    touch.current = null;
    if (!start || overlay) return;
    const dy = start.y - e.changedTouches[0].clientY;
    if (Math.abs(dy) < 70) return;
    const dir: 1 | -1 = dy > 0 ? 1 : -1;
    if (start.scroller && !atEdge(start.scroller, dir)) return;
    step(dir);
  };

  const ctx: FrameCtx = { index: nav.index, reduced, go, step, openProject, openPalette };
  const Frame = FRAME_COMPONENTS[nav.index];
  const meta = frames[nav.index];

  const variants = {
    enter: (d: number) =>
      reduced
        ? { opacity: 0 }
        : { opacity: 0, scale: d > 0 ? 0.9 : 1.1, filter: "blur(6px)" },
    center: { opacity: 1, scale: 1, filter: "blur(0px)" },
    exit: (d: number) =>
      reduced
        ? { opacity: 0 }
        : { opacity: 0, scale: d > 0 ? 1.12 : 0.9, filter: "blur(6px)" },
  };

  return (
    <div
      className="fixed inset-0 overflow-hidden bg-[var(--umber-deep)] text-[var(--parchment)]"
      onWheel={onWheel}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <Backdrop index={nav.index} count={frames.length} reduced={reduced} />

      {/* HUD */}
      <header className="pointer-events-none absolute inset-x-0 top-0 z-20 bg-gradient-to-b from-[var(--umber-deep)] via-[var(--umber-deep)]/70 to-transparent px-5 pb-8 pt-4 md:px-10">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
          <button
            onClick={() => go(0)}
            data-cursor-hover
            className="j-focus pointer-events-auto flex items-center gap-2 font-mono text-xs md:text-sm"
            aria-label="Back to the start"
          >
            <span className="inline-block h-2 w-2 rounded-full bg-[var(--sienna)] j-pulse" />
            {profile.name}
            <span className="hidden text-[var(--taupe)] md:inline">· trace 7f3a91</span>
          </button>

          <nav className="pointer-events-auto flex items-center gap-1.5 text-[11px] md:gap-2 md:text-xs" aria-label="Quick links">
            <button
              onClick={openPalette}
              data-cursor-hover
              className="j-focus flex items-center gap-1.5 rounded-full border border-[var(--line-dark)] px-3 py-1.5 transition-colors hover:border-[var(--parchment)]/50"
            >
              <Search size={12} /> <span className="hidden sm:inline">Search</span>
              <kbd className="j-kbd">/</kbd>
            </button>
            <a
              href={profile.resumeUrl}
              target="_blank"
              rel="noreferrer"
              data-cursor-hover
              className="j-focus rounded-full border border-[var(--line-dark)] px-3 py-1.5 transition-colors hover:border-[var(--parchment)]/50"
            >
              Résumé
            </a>
            <Link
              href="/classic"
              data-cursor-hover
              className="j-focus rounded-full border border-[var(--line-dark)] px-3 py-1.5 transition-colors hover:border-[var(--parchment)]/50"
            >
              Classic view
            </Link>
          </nav>
        </div>
      </header>

      {/* Stage */}
      <main className="absolute inset-0" aria-label="Interactive portfolio journey">
        <AnimatePresence custom={nav.dir} initial={false}>
          <motion.section
            key={meta.id}
            custom={nav.dir}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: reduced ? 0.2 : 0.6, ease: EASE }}
            aria-label={`${meta.layer}, layer ${nav.index + 1} of ${frames.length}`}
            className="absolute inset-0"
          >
            <div data-scroll className="h-full overflow-y-auto overscroll-contain">
              <Frame ctx={ctx} />
            </div>
          </motion.section>
        </AnimatePresence>
      </main>

      <TraceRail index={nav.index} go={go} />

      <p className="sr-only-text" aria-live="polite">
        Layer {nav.index + 1} of {frames.length}: {meta.layer}
      </p>

      <CommandPalette
        open={palette}
        onClose={closePalette}
        go={go}
        openProject={openProject}
        reduced={reduced}
      />
      <ProjectDrawer slug={projectSlug} onClose={closeProject} reduced={reduced} />
    </div>
  );
}
