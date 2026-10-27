"use client";

import Reveal from "@/components/Reveal";
import ProjectCard from "@/components/ProjectCard";
import { projects } from "@/lib/data";

export default function ProjectsPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 md:px-10 pt-16 pb-32">
      <Reveal>
        <p className="eyebrow mb-4">Case files</p>
        <h1 className="font-display text-5xl md:text-6xl max-w-2xl text-balance">
          Systems I&apos;ve designed, shipped, and kept running.
        </h1>
        <p className="text-[var(--ink-soft)] mt-6 max-w-xl leading-relaxed">
          Each of these started as a real problem, not a tutorial. Below is what the problem
          actually was, how it got solved, and what it&apos;s built with.
        </p>
      </Reveal>

      <div className="grid gap-6 mt-16">
        {projects.map((project, i) => (
          <ProjectCard key={project.slug} project={project} index={i} />
        ))}
      </div>

      {/*
        ADD MORE PROJECTS HERE — no layout changes needed.
        1. Open lib/data.ts
        2. Add a new object to the `projects` array following the existing shape:
           {
             slug: "your-project-slug",
             name: "Project Name",
             tagline: "One sentence on what it does.",
             problem: "What real problem it solves.",
             approach: ["Bullet on how you built it", "Another bullet", "..."],
             stack: ["Tech", "Tech", "Tech"],
             links: [{ label: "Live demo", href: "https://..." }, { label: "Source", href: "https://github.com/..." }],
             featured: true, // set false to keep it off the homepage but still listed here
           }
        3. Save — it appears automatically on both this page and (if featured: true) the homepage.
      */}
    </div>
  );
}
