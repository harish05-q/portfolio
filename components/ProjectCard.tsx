"use client";

import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/data";
import Reveal from "./Reveal";

export default function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <Reveal delay={index * 0.08}>
      <article className="group border border-[var(--cream-line)] rounded-2xl p-7 md:p-9 bg-[var(--parchment-deep)]/40 hover:bg-[var(--parchment-deep)] transition-colors duration-300">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <span className="eyebrow">{String(index + 1).padStart(2, "0")}</span>
            <h3 className="font-display text-2xl md:text-3xl mt-1">{project.name}</h3>
          </div>
          {project.links?.[0] && (
            <a
              href={project.links[0].href}
              target="_blank"
              rel="noreferrer"
              data-cursor-hover
              className="shrink-0 w-11 h-11 rounded-full border border-[var(--cream-line)] flex items-center justify-center group-hover:bg-[var(--sienna)] group-hover:border-[var(--sienna)] group-hover:text-[var(--parchment)] transition-colors"
              aria-label={`Open ${project.name}`}
            >
              <ArrowUpRight size={18} />
            </a>
          )}
        </div>

        <p className="text-[var(--ink-soft)] leading-relaxed mb-5">{project.tagline}</p>

        <p className="text-sm text-[var(--ink-soft)] leading-relaxed mb-5">
          <span className="font-mono text-xs text-[var(--sienna)] uppercase tracking-wide mr-2">
            Problem
          </span>
          {project.problem}
        </p>

        <ul className="space-y-2 mb-6">
          {project.approach.map((point, i) => (
            <li key={i} className="text-sm text-[var(--ink-soft)] leading-relaxed flex gap-2.5">
              <span className="mt-2 w-1 h-1 rounded-full bg-[var(--moss)] shrink-0" />
              {point}
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap gap-2 mb-5">
          {project.stack.map((tech) => (
            <span
              key={tech}
              className="font-mono text-[11px] px-2.5 py-1 rounded-full border border-[var(--cream-line)] text-[var(--ink-soft)]"
            >
              {tech}
            </span>
          ))}
        </div>

        {project.links && project.links.length > 0 && (
          <div className="flex gap-5 pt-1">
            {project.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                data-cursor-hover
                className="underline-swipe text-sm font-medium text-[var(--sienna-deep)]"
              >
                {link.label} &rarr;
              </a>
            ))}
          </div>
        )}
      </article>
    </Reveal>
  );
}
