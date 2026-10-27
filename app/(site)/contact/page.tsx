"use client";

import { Mail, ArrowUpRight } from "lucide-react";
import { FaGithub, FaLinkedin, FaCode } from "react-icons/fa";
import Reveal from "@/components/Reveal";
import { profile } from "@/lib/data";

const channels = [
  {
    label: "Email",
    value: profile.email,
    href: `mailto:${profile.email}`,
    icon: Mail,
  },
  {
    label: "GitHub",
    value: "harish05-q",
    href: profile.links.github,
    icon: FaGithub,
  },
  {
    label: "LinkedIn",
    value: "Connect on LinkedIn",
    href: profile.links.linkedin,
    icon: FaLinkedin,
  },
  {
    label: "LeetCode",
    value: "800+ problems, 1900 rating",
    href: profile.links.leetcode,
    icon: FaCode,
  },
];

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 md:px-10 pt-16 pb-32">
      <Reveal>
        <p className="eyebrow mb-4">Get in touch</p>
        <h1 className="font-display text-5xl md:text-6xl text-balance max-w-2xl">
          Building something? Hiring? Let&apos;s talk.
        </h1>
        <p className="text-[var(--ink-soft)] mt-6 max-w-xl leading-relaxed">
          Open to backend & AI engineering roles, internships, and interesting technical
          collaborations. Email is the fastest way to reach me.
        </p>
      </Reveal>

      <div className="mt-16 grid sm:grid-cols-2 gap-4">
        {channels.map((c, i) => {
          const Icon = c.icon;
          return (
            <Reveal key={c.label} delay={i * 0.08}>
              <a
                href={c.href}
                target={c.href.startsWith("mailto") ? undefined : "_blank"}
                rel="noreferrer"
                data-cursor-hover
                className="group flex items-center justify-between gap-4 p-6 rounded-2xl border border-[var(--cream-line)] hover:bg-[var(--parchment-deep)] transition-colors"
              >
                <div className="flex items-center gap-4">
                  <span className="w-11 h-11 rounded-full border border-[var(--cream-line)] flex items-center justify-center group-hover:bg-[var(--sienna)] group-hover:text-[var(--parchment)] group-hover:border-[var(--sienna)] transition-colors shrink-0">
                    <Icon size={17} />
                  </span>
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-wide text-[var(--taupe)]">
                      {c.label}
                    </p>
                    <p className="font-medium mt-0.5">{c.value}</p>
                  </div>
                </div>
                <ArrowUpRight
                  size={18}
                  className="text-[var(--taupe)] group-hover:text-[var(--sienna)] transition-colors shrink-0"
                />
              </a>
            </Reveal>
          );
        })}
      </div>

      <Reveal delay={0.3}>
        <div className="mt-16 pt-10 border-t border-[var(--cream-line)]">
          <p className="text-sm text-[var(--taupe)] font-mono">
            Response time: usually within a day. {profile.location}.
          </p>
        </div>
      </Reveal>
    </div>
  );
}
