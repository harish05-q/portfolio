"use client";

import Reveal from "@/components/Reveal";
import { bio, education, skills, experience, achievements, profile } from "@/lib/data";

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 md:px-10 pt-16 pb-32">
      <Reveal>
        <p className="eyebrow mb-4">About</p>
        <h1 className="font-display text-5xl md:text-6xl text-balance mb-8">
          The person behind the systems.
        </h1>
        <p className="text-lg leading-relaxed text-[var(--ink-soft)] max-w-2xl">{bio}</p>
      </Reveal>

      {/* EDUCATION */}
      <Reveal delay={0.1}>
        <div className="mt-20 pt-10 border-t border-[var(--cream-line)]">
          <p className="eyebrow mb-6">Education</p>
          <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-2">
            <div>
              <p className="font-display text-2xl">{education.degree}</p>
              <p className="text-[var(--ink-soft)] mt-1">{education.school}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="font-mono text-sm text-[var(--sienna-deep)]">{education.period}</p>
              <p className="font-mono text-xs text-[var(--taupe)] mt-1">{education.detail}</p>
            </div>
          </div>
        </div>
      </Reveal>

      {/* EXPERIENCE */}
      <Reveal delay={0.1}>
        <div className="mt-14 pt-10 border-t border-[var(--cream-line)]">
          <p className="eyebrow mb-6">Experience</p>
          {experience.map((job) => (
            <div key={job.org} className="mb-2">
              <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-1 mb-4">
                <p className="font-display text-2xl">
                  {job.role} <span className="text-[var(--ink-soft)]">— {job.org}</span>
                </p>
                <p className="font-mono text-sm text-[var(--sienna-deep)] shrink-0">{job.period}</p>
              </div>
              <ul className="space-y-2">
                {job.points.map((p, i) => (
                  <li key={i} className="text-sm text-[var(--ink-soft)] leading-relaxed flex gap-2.5">
                    <span className="mt-2 w-1 h-1 rounded-full bg-[var(--moss)] shrink-0" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Reveal>

      {/* SKILLS */}
      <Reveal delay={0.1}>
        <div className="mt-14 pt-10 border-t border-[var(--cream-line)]">
          <p className="eyebrow mb-6">Field kit</p>
          <div className="grid sm:grid-cols-2 gap-x-10 gap-y-8">
            {skills.map((group) => (
              <div key={group.group}>
                <p className="font-mono text-xs uppercase tracking-wide text-[var(--ink-soft)] mb-3">
                  {group.group}
                </p>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className="text-sm px-3 py-1.5 rounded-full border border-[var(--cream-line)] bg-[var(--parchment-deep)]/50"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* ACHIEVEMENTS */}
      <Reveal delay={0.1}>
        <div className="mt-14 pt-10 border-t border-[var(--cream-line)]">
          <p className="eyebrow mb-6">Marks worth noting</p>
          <ul className="space-y-4">
            {achievements.map((a, i) => (
              <li key={i} className="flex gap-4 items-start">
                <span className="font-mono text-xs text-[var(--sienna-deep)] mt-1 shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-[var(--ink-soft)] leading-relaxed">{a}</span>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="mt-16 pt-10 border-t border-[var(--cream-line)] flex flex-wrap gap-4">
          <a
            href={profile.resumeUrl}
            target="_blank"
            rel="noreferrer"
            data-cursor-hover
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--sienna)] text-[var(--parchment)] font-medium hover:bg-[var(--ochre)] transition-colors"
          >
            Download resume
          </a>
        </div>
      </Reveal>
    </div>
  );
}
