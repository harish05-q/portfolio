"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { projects } from "@/lib/data";
import { type FrameCtx, FrameShell, ProjectLinks, StackChips, useRise } from "../ui";

const stages = [
  {
    key: "Recommended",
    note: "An LLM diagnoses why the payment failed and proposes a recovery action. It only suggests; it never executes.",
  },
  {
    key: "Executed",
    note: "Deterministic policy gates the action, a human approves it, and execution is idempotent, so a retry can't double-charge.",
  },
  {
    key: "Observed",
    note: "An outcome-observation pipeline records what actually happened at the payment provider, not what the model hoped for.",
  },
  {
    key: "Recovered",
    note: "Recovery is measured against a non-AI baseline, so the lift from the agent is a number rather than a vibe.",
  },
];

const metrics = [
  { value: "10K+", label: "transactions handled" },
  { value: "66/66", label: "backend tests passing" },
  { value: "Qdrant", label: "semantic retrieval over financial docs" },
];

export default function Agent({ ctx }: { ctx: FrameCtx }) {
  const rise = useRise();
  const project = projects.find((p) => p.slug === "rai")!;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || ctx.reduced) return;
    const id = setInterval(() => setActive((a) => (a + 1) % stages.length), 3000);
    return () => clearInterval(id);
  }, [paused, ctx.reduced]);

  return (
    <FrameShell
      eyebrow="04 · Agent"
      title="R.AI: an agent you can audit."
      note="// recommended → executed → observed → recovered"
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_1.05fr] lg:gap-12">
        <div>
          <motion.p {...rise(0)} className="text-lg leading-relaxed text-[var(--parchment)]/85">
            {project.tagline} {project.problem}
          </motion.p>

          <motion.div {...rise(1)} className="mt-6 grid grid-cols-3 gap-3">
            {metrics.map((m) => (
              <div key={m.label} className="j-card p-4">
                <p className="font-display text-2xl text-[var(--ochre)] md:text-3xl">{m.value}</p>
                <p className="mt-1 text-[11px] leading-snug text-[var(--parchment)]/65">{m.label}</p>
              </div>
            ))}
          </motion.div>

          <motion.div {...rise(2)} className="mt-6">
            <StackChips items={project.stack} />
          </motion.div>

          <motion.div {...rise(3)} className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
            <button
              onClick={() => ctx.openProject("rai")}
              data-cursor-hover
              className="j-focus rounded-full border border-[var(--parchment)]/30 px-5 py-2.5 text-sm transition-colors hover:border-[var(--ochre)] hover:text-[var(--ochre)]"
            >
              Read the full case study
            </button>
            <ProjectLinks project={project} />
          </motion.div>
        </div>

        <motion.div
          {...rise(2)}
          className="j-card p-5 md:p-6 lg:self-start"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--taupe)]">
            Recovery lifecycle · click a stage
          </p>

          <ol className="mt-5 flex items-start">
            {stages.map((s, i) => {
              const done = i < active;
              const current = i === active;
              return (
                <li key={s.key} className="flex flex-1 items-start last:flex-none">
                  <button
                    onClick={() => {
                      setActive(i);
                      setPaused(true);
                    }}
                    aria-current={current}
                    data-cursor-hover
                    className="j-focus flex flex-col items-center gap-2 text-center"
                  >
                    <span
                      className={`flex h-9 w-9 items-center justify-center rounded-full border font-mono text-xs transition-all duration-300 ${
                        current
                          ? "scale-110 border-[var(--sienna)] bg-[var(--sienna)] shadow-[0_0_18px_rgba(193,89,43,0.7)]"
                          : done
                            ? "border-[var(--ochre)] bg-[var(--ochre)]/20 text-[var(--ochre)]"
                            : "border-[var(--line-dark)] text-[var(--taupe)]"
                      }`}
                    >
                      {i + 1}
                    </span>
                    <span
                      className={`text-[11px] md:text-xs ${current ? "text-[var(--parchment)]" : "text-[var(--taupe)]"}`}
                    >
                      {s.key}
                    </span>
                  </button>
                  {i < stages.length - 1 && (
                    <span className="mx-1 mt-[18px] h-px flex-1 bg-[var(--line-dark)]">
                      <span
                        className="block h-px bg-[var(--ochre)] transition-all duration-500"
                        style={{ width: done ? "100%" : "0%" }}
                      />
                    </span>
                  )}
                </li>
              );
            })}
          </ol>

          <div className="mt-6 min-h-[92px] rounded-xl border border-[var(--line-dark)] bg-[var(--umber-deep)]/60 p-4">
            <AnimatePresence mode="wait">
              <motion.p
                key={active}
                initial={ctx.reduced ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={ctx.reduced ? { opacity: 0 } : { opacity: 0, y: -6 }}
                transition={{ duration: ctx.reduced ? 0 : 0.22 }}
                className="text-sm leading-relaxed text-[var(--parchment)]/80"
              >
                <span className="mr-2 font-mono text-xs text-[var(--ochre)]">
                  state = {stages[active].key.toLowerCase()}
                </span>
                {stages[active].note}
              </motion.p>
            </AnimatePresence>
          </div>

          <p className="mt-4 font-mono text-[11px] leading-relaxed text-[var(--taupe)]">
            Plus a Revenue Intelligence dashboard: analytics, audit trails, approval workflows and
            deterministic demo/eval modes.
          </p>
        </motion.div>
      </div>
    </FrameShell>
  );
}
