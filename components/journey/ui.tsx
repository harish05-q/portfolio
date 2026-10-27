"use client";

import { useEffect, useState } from "react";
import { animate, useReducedMotion } from "framer-motion";
import type { Project } from "@/lib/data";

export type FrameCtx = {
  index: number;
  reduced: boolean;
  go: (to: number) => void;
  step: (delta: number) => void;
  openProject: (slug: string) => void;
  openPalette: () => void;
};

export const EASE = [0.16, 1, 0.3, 1] as const;

/** Staggered "rise in" props for a frame's children. No-ops under reduced motion. */
export function useRise() {
  const reduced = useReducedMotion();
  return (i: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 18 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: 0.2 + i * 0.07, duration: 0.6, ease: EASE },
        };
}

export function FrameShell({
  eyebrow,
  title,
  note,
  children,
}: {
  eyebrow: string;
  title: string;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex min-h-full w-full max-w-6xl flex-col justify-center px-6 pb-32 pt-24 md:px-10">
      <p className="j-eyebrow">{eyebrow}</p>
      <h2 className="font-display mt-3 text-balance text-4xl leading-[1.02] md:text-6xl">
        {title}
      </h2>
      {note && (
        <p className="mt-4 font-mono text-xs text-[var(--taupe)] md:text-sm">{note}</p>
      )}
      <div className="mt-8 md:mt-10">{children}</div>
    </div>
  );
}

export function StackChips({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((t) => (
        <span key={t} className="j-chip">
          {t}
        </span>
      ))}
    </div>
  );
}

export function ProjectLinks({ project }: { project: Project }) {
  if (!project.links?.length) return null;
  return (
    <div className="flex flex-wrap gap-x-5 gap-y-2">
      {project.links.map((l) => (
        <a
          key={l.href + l.label}
          href={l.href}
          target="_blank"
          rel="noreferrer"
          data-cursor-hover
          className="j-focus underline-swipe text-sm font-medium text-[var(--ochre)]"
        >
          {l.label} &rarr;
        </a>
      ))}
    </div>
  );
}

/** Counts up the number inside strings like "700+", "1850+" or "Top 10". */
export function CountUp({ value, reduced }: { value: string; reduced: boolean }) {
  const match = value.match(/^(\D*)(\d+)(.*)$/);
  const target = match ? Number(match[2]) : 0;
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!match || reduced) return;
    const controls = animate(0, target, {
      duration: 1.3,
      ease: "easeOut",
      onUpdate: (v) => setN(Math.round(v)),
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, reduced]);

  if (!match) return <>{value}</>;
  const shown = reduced ? target : n;
  return (
    <>
      {match[1]}
      {shown}
      {match[3]}
    </>
  );
}
