"use client";

import { motion } from "framer-motion";
import { bio, education, profile, stats } from "@/lib/data";
import { type FrameCtx, CountUp, FrameShell, useRise } from "../ui";

export default function Edge({ ctx }: { ctx: FrameCtx }) {
  const rise = useRise();

  const headers: [string, string][] = [
    ["x-role", profile.role],
    ["x-education", `B.Tech CSE (AI), CGPA ${education.detail.replace("CGPA ", "")}`],
    ["x-focus", "backend · retrieval · agentic systems"],
    ["x-location", profile.location],
    ["x-availability", "roles · internships · collaborations"],
  ];

  return (
    <FrameShell
      eyebrow="02 · Edge"
      title="Who's on the other end?"
      note="// request headers, resolved at the edge"
    >
      <div className="grid gap-8 md:grid-cols-5 md:gap-10">
        <div className="md:col-span-3">
          <motion.p
            {...rise(0)}
            className="font-display text-lg leading-snug text-[var(--parchment)]/90 md:text-xl"
          >
            {bio}
          </motion.p>

          <motion.dl {...rise(2)} className="j-card mt-8 divide-y divide-[var(--line-dark)] font-mono text-xs md:text-sm">
            {headers.map(([k, v]) => (
              <div key={k} className="flex flex-col gap-1 px-4 py-2 sm:flex-row sm:gap-4">
                <dt className="w-36 shrink-0 text-[var(--ochre)]">{k}</dt>
                <dd className="text-[var(--parchment)]/80">{v}</dd>
              </div>
            ))}
          </motion.dl>
        </div>

        <div className="grid grid-cols-2 content-start gap-3 md:col-span-2">
          {stats.map((s, i) => (
            <motion.div key={s.label} {...rise(1 + i)} className="j-card p-5">
              <p className="font-display text-3xl text-[var(--ochre)] md:text-4xl">
                <CountUp value={s.value} reduced={ctx.reduced} />
              </p>
              <p className="mt-2 text-xs leading-snug text-[var(--parchment)]/70 md:text-sm">
                {s.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </FrameShell>
  );
}
