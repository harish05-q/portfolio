"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowDown, ArrowUpRight, Search } from "lucide-react";
import Link from "next/link";
import { profile } from "@/lib/data";
import { type FrameCtx, EASE, useRise } from "../ui";

const REQUEST = "GET /harish-pal HTTP/1.1";

function useTyped(text: string, reduced: boolean) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => {
      setN((v) => {
        if (v >= text.length) {
          clearInterval(id);
          return v;
        }
        return v + 1;
      });
    }, 38);
    return () => clearInterval(id);
  }, [text, reduced]);
  return reduced ? text : text.slice(0, n);
}

export default function Hero({ ctx }: { ctx: FrameCtx }) {
  const rise = useRise();
  const typed = useTyped(REQUEST, ctx.reduced);

  return (
    <div className="mx-auto flex min-h-full w-full max-w-6xl flex-col justify-center px-6 pb-32 pt-24 md:px-10">
      <p
        className="h-5 font-mono text-xs text-[var(--ochre)] md:text-sm"
        aria-label={REQUEST}
      >
        <span aria-hidden>
          {typed}
          <span className="j-caret" />
        </span>
      </p>

      <motion.h1
        {...(ctx.reduced
          ? {}
          : {
              initial: { opacity: 0, y: 26 },
              animate: { opacity: 1, y: 0 },
              transition: { delay: 0.35, duration: 0.9, ease: EASE },
            })}
        className="font-display mt-6 text-[17vw] leading-[0.92] tracking-tight md:text-[9vw]"
      >
        {profile.name}
      </motion.h1>

      <motion.p
        {...rise(2)}
        className="font-display mt-5 text-xl italic text-[var(--ochre)] md:text-3xl"
      >
        {profile.role}
      </motion.p>

      <motion.p
        {...rise(3)}
        className="mt-6 max-w-xl text-base leading-relaxed text-[var(--parchment)]/75 md:text-lg"
      >
        {profile.tagline}
      </motion.p>

      <motion.div {...rise(4)} className="mt-9 flex flex-wrap items-center gap-3">
        <button
          onClick={() => ctx.step(1)}
          data-cursor-hover
          className="j-focus inline-flex items-center gap-2 rounded-full bg-[var(--sienna)] px-6 py-3 font-medium text-[var(--parchment)] transition-colors hover:bg-[var(--ochre)] hover:text-[var(--umber)]"
        >
          Follow the request <ArrowDown size={16} className="j-pulse" />
        </button>
        <a
          href={profile.resumeUrl}
          target="_blank"
          rel="noreferrer"
          data-cursor-hover
          className="j-focus inline-flex items-center gap-2 rounded-full border border-[var(--parchment)]/30 px-6 py-3 transition-colors hover:border-[var(--parchment)]/70"
        >
          Résumé <ArrowUpRight size={16} />
        </a>
        <button
          onClick={ctx.openPalette}
          data-cursor-hover
          className="j-focus inline-flex items-center gap-2 rounded-full px-4 py-3 text-sm text-[var(--taupe)] transition-colors hover:text-[var(--parchment)]"
        >
          <Search size={14} /> Search <kbd className="j-kbd">/</kbd>
        </button>
      </motion.div>

      <motion.div
        {...rise(5)}
        className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 font-mono text-xs text-[var(--taupe)]"
      >
        <span className="inline-flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[var(--ok)] j-pulse" />
          open to roles &amp; internships
        </span>
        <span className="hidden sm:inline">
          <kbd className="j-kbd">↑</kbd> <kbd className="j-kbd">↓</kbd> to move · swipe on touch
        </span>
        <Link href="/classic" data-cursor-hover className="j-focus underline-swipe">
          prefer a plain page? classic view →
        </Link>
      </motion.div>
    </div>
  );
}
