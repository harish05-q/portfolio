"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Copy, RotateCcw } from "lucide-react";
import Link from "next/link";
import { profile } from "@/lib/data";
import { type FrameCtx, EASE, useRise } from "../ui";

const strip = (url: string) => url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

function JsonLink({ href, label, external = true }: { href: string; label: string; external?: boolean }) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel="noreferrer"
      data-cursor-hover
      className="j-focus underline decoration-[var(--ochre)]/40 underline-offset-4 transition-colors hover:text-[var(--ochre)] hover:decoration-[var(--ochre)]"
    >
      {label}
    </a>
  );
}

export default function Response({ ctx }: { ctx: FrameCtx }) {
  const rise = useRise();
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  return (
    <div className="mx-auto flex min-h-full w-full max-w-6xl flex-col justify-center px-6 pb-32 pt-24 md:px-10">
      <p className="j-eyebrow">08 · Response</p>
      <motion.h2
        {...(ctx.reduced
          ? {}
          : {
              initial: { opacity: 0, scale: 0.94 },
              animate: { opacity: 1, scale: 1 },
              transition: { duration: 0.8, ease: EASE },
            })}
        className="font-display mt-3 text-[18vw] leading-[0.9] md:text-[9vw]"
      >
        <span className="text-[var(--ok)]">200</span> OK
      </motion.h2>
      <p className="mt-4 font-mono text-xs text-[var(--taupe)] md:text-sm">
        {"// request resolved in 280ms. Let's make it a conversation."}
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-[1.2fr_1fr] md:gap-10">
        <motion.pre
          {...rise(1)}
          className="j-card overflow-x-auto whitespace-pre-wrap break-words p-5 font-mono text-[12px] leading-relaxed text-[var(--parchment)]/85 md:p-6 md:text-sm"
        >
          <code>
            {"{\n"}
            {'  "status": '}
            <span className="text-[var(--ok)]">&quot;open_to_opportunities&quot;</span>
            {",\n"}
            {'  "name": '}
            <span className="text-[var(--ochre)]">&quot;{profile.name}&quot;</span>
            {",\n"}
            {'  "roles": ["backend", "ai-systems", "internships"],\n'}
            {'  "email": "'}
            <JsonLink href={`mailto:${profile.email}`} label={profile.email} external={false} />
            {'",\n'}
            {'  "github": "'}
            <JsonLink href={profile.links.github} label={strip(profile.links.github)} />
            {'",\n'}
            {'  "leetcode": "'}
            <JsonLink href={profile.links.leetcode} label={strip(profile.links.leetcode)} />
            {'",\n'}
            {'  "linkedin": "'}
            <JsonLink href={profile.links.linkedin} label={strip(profile.links.linkedin)} />
            {'",\n'}
            {'  "resume": "'}
            <JsonLink href={profile.resumeUrl} label={profile.resumeUrl} />
            {'"\n}'}
          </code>
        </motion.pre>

        <motion.div {...rise(2)} className="flex flex-col items-start gap-3">
          <a
            href={`mailto:${profile.email}`}
            data-cursor-hover
            className="j-focus w-full rounded-full bg-[var(--sienna)] px-6 py-3.5 text-center font-medium transition-colors hover:bg-[var(--ochre)] hover:text-[var(--umber)] md:w-auto"
          >
            Email me
          </a>
          <button
            onClick={copyEmail}
            data-cursor-hover
            className="j-focus inline-flex items-center gap-2 rounded-full border border-[var(--parchment)]/30 px-5 py-2.5 text-sm transition-colors hover:border-[var(--parchment)]/70"
          >
            {copied ? <Check size={14} className="text-[var(--ok)]" /> : <Copy size={14} />}
            {copied ? "Copied" : "Copy email address"}
          </button>
          <a
            href={profile.resumeUrl}
            target="_blank"
            rel="noreferrer"
            data-cursor-hover
            className="j-focus rounded-full border border-[var(--parchment)]/30 px-5 py-2.5 text-sm transition-colors hover:border-[var(--parchment)]/70"
          >
            Open résumé (PDF)
          </a>
          <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-[var(--taupe)]">
            <button
              onClick={() => ctx.go(0)}
              data-cursor-hover
              className="j-focus inline-flex items-center gap-1.5 transition-colors hover:text-[var(--parchment)]"
            >
              <RotateCcw size={13} /> Replay the journey
            </button>
            <Link href="/classic" data-cursor-hover className="j-focus underline-swipe">
              Classic view →
            </Link>
          </div>
        </motion.div>
      </div>

      <p className="mt-10 font-mono text-[11px] text-[var(--taupe)]/80">
        Built with Next.js · react-three-fiber · Framer Motion
      </p>
    </div>
  );
}
