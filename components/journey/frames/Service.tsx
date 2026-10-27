"use client";

import { motion } from "framer-motion";
import { skills } from "@/lib/data";
import { type FrameCtx, FrameShell, useRise } from "../ui";

const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export default function Service({ ctx }: { ctx: FrameCtx }) {
  void ctx;
  const rise = useRise();

  return (
    <FrameShell
      eyebrow="03 · Service layer"
      title="What the handler can do."
      note="// route table: every capability returns 200"
    >
      <div className="j-card divide-y divide-[var(--line-dark)] overflow-hidden">
        {skills.map((g, i) => (
          <motion.div
            key={g.group}
            {...rise(i * 0.6)}
            className="grid gap-x-6 gap-y-2.5 px-5 py-4 transition-colors hover:bg-[var(--parchment)]/[0.05] md:grid-cols-[190px_1fr_44px] md:items-start"
          >
            <p className="font-mono text-sm">
              <span className="text-[var(--ok)]">GET</span>{" "}
              <span className="text-[var(--parchment)]/90">/{slug(g.group)}</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {g.items.map((item) => (
                <span key={item} className="j-chip">
                  {item}
                </span>
              ))}
            </div>
            <p className="font-mono text-xs text-[var(--ok)] md:text-right">200</p>
          </motion.div>
        ))}
      </div>
    </FrameShell>
  );
}
