"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { incidentLog, type LogEntry, type LogGroup } from "@/lib/journey";
import { type FrameCtx, EASE, FrameShell, useRise } from "../ui";

const FILTERS: { id: "all" | LogGroup; label: string }[] = [
  { id: "all", label: "all events" },
  { id: "path", label: "education & work" },
  { id: "wins", label: "wins" },
];

const LEVEL_STYLE: Record<LogEntry["level"], string> = {
  INFO: "text-[var(--taupe)] border-[var(--line-dark)]",
  WIN: "text-[var(--ok)] border-[var(--ok)]/40",
  OPEN: "text-[var(--warn)] border-[var(--warn)]/50",
};

export default function Incident({ ctx }: { ctx: FrameCtx }) {
  const rise = useRise();
  const [filter, setFilter] = useState<"all" | LogGroup>("all");
  const [openId, setOpenId] = useState<string | null>("open");
  const entries = incidentLog.filter((e) => filter === "all" || e.group === filter || e.level === "OPEN");

  return (
    <FrameShell
      eyebrow="07 · Incident log"
      title="Incident #0501: no Harish on the team yet."
      note="// status: OPEN · severity: low · owner: whoever is hiring"
    >
      <motion.div {...rise(0)} className="mb-4 flex flex-wrap gap-2" role="group" aria-label="Filter log">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            aria-pressed={filter === f.id}
            data-cursor-hover
            className={`j-chip j-focus transition-colors ${
              filter === f.id
                ? "!border-[var(--ochre)] !text-[var(--ochre)]"
                : "hover:border-[var(--parchment)]/40"
            }`}
          >
            {f.label}
          </button>
        ))}
      </motion.div>

      <div className="j-card divide-y divide-[var(--line-dark)] overflow-hidden">
        <AnimatePresence initial>
          {entries.map((e, i) => {
            const expanded = openId === e.id;
            return (
              <motion.div
                key={e.id}
                layout={!ctx.reduced}
                initial={ctx.reduced ? false : { opacity: 0, x: -14 }}
                animate={{ opacity: 1, x: 0 }}
                exit={ctx.reduced ? { opacity: 0 } : { opacity: 0, x: 14 }}
                transition={{ delay: ctx.reduced ? 0 : 0.25 + i * 0.09, duration: 0.45, ease: EASE }}
              >
                <button
                  onClick={() => setOpenId(expanded ? null : e.id)}
                  aria-expanded={expanded}
                  data-cursor-hover
                  className="j-focus flex w-full items-start gap-3 px-4 py-3.5 text-left transition-colors hover:bg-[var(--parchment)]/[0.05] md:gap-5 md:px-5"
                >
                  <span className="hidden w-28 shrink-0 pt-0.5 font-mono text-[11px] text-[var(--taupe)] sm:block">
                    {e.when ?? "·"}
                  </span>
                  <span
                    className={`mt-0.5 shrink-0 rounded border px-1.5 py-0.5 font-mono text-[10px] tracking-wider ${LEVEL_STYLE[e.level]} ${e.level === "OPEN" ? "j-pulse" : ""}`}
                  >
                    {e.level}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium leading-snug md:text-base">
                      <span className="mr-2 font-mono text-[11px] text-[var(--ochre)]">{e.tag}</span>
                      {e.title}
                    </span>
                    {e.when && (
                      <span className="mt-0.5 block font-mono text-[11px] text-[var(--taupe)] sm:hidden">
                        {e.when}
                      </span>
                    )}
                    <AnimatePresence initial={false}>
                      {expanded && (
                        <motion.span
                          initial={ctx.reduced ? false : { height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={ctx.reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
                          transition={{ duration: ctx.reduced ? 0 : 0.28, ease: EASE }}
                          className="block overflow-hidden"
                        >
                          <span className="mt-2 block text-sm leading-relaxed text-[var(--parchment)]/70">
                            {e.detail}
                          </span>
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </span>
                  <ChevronDown
                    size={16}
                    className={`mt-1 shrink-0 text-[var(--taupe)] transition-transform ${expanded ? "rotate-180" : ""}`}
                  />
                </button>
                {expanded && e.href && (
                  <div className="px-4 pb-3.5 md:px-5 md:pl-[10.5rem]">
                    <a
                      href={e.href}
                      target="_blank"
                      rel="noreferrer"
                      data-cursor-hover
                      className="j-focus underline-swipe text-sm font-medium text-[var(--ochre)]"
                    >
                      {e.hrefLabel} &rarr;
                    </a>
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <motion.div {...rise(6)} className="mt-6">
        <button
          onClick={() => ctx.step(1)}
          data-cursor-hover
          className="j-focus rounded-full bg-[var(--sienna)] px-6 py-3 text-sm font-medium transition-colors hover:bg-[var(--ochre)] hover:text-[var(--umber)]"
        >
          Resolve it: see the response →
        </button>
      </motion.div>
    </FrameShell>
  );
}
