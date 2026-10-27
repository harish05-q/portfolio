"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Reveal from "@/components/Reveal";
import ProjectCard from "@/components/ProjectCard";
import { profile, stats, projects, bio } from "@/lib/data";

const HeroScene = dynamic(() => import("@/components/HeroScene"), { ssr: false });

export default function Home() {
  const featured = projects.filter((p) => p.featured).slice(0, 3);

  return (
    <div>
      {/* HERO */}
      <section className="relative -mt-28 pt-28 min-h-[92vh] overflow-hidden bg-gradient-to-b from-[var(--umber)] via-[var(--umber)] to-[var(--parchment)] text-[var(--parchment)]">
        <div className="absolute inset-0 opacity-90">
          <HeroScene />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-10 pt-24 md:pt-32 pb-40">
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="eyebrow mb-6"
          >
            {profile.role}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-balance text-[13vw] leading-[0.98] md:text-[6.2vw] md:leading-[0.98] max-w-4xl"
          >
            {profile.name}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.7 }}
            className="mt-8 max-w-xl text-lg text-[var(--parchment)]/80 leading-relaxed"
          >
            {profile.tagline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.7 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <Link
              href="/projects"
              data-cursor-hover
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--sienna)] text-[var(--parchment)] font-medium hover:bg-[var(--ochre)] transition-colors"
            >
              See the work <ArrowRight size={16} />
            </Link>
            <a
              href={profile.resumeUrl}
              target="_blank"
              rel="noreferrer"
              data-cursor-hover
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[var(--parchment)]/30 hover:border-[var(--parchment)]/70 transition-colors"
            >
              Resume <ArrowUpRight size={16} />
            </a>
          </motion.div>
        </div>

        <div className="absolute bottom-8 left-0 right-0 flex justify-center">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            className="font-mono text-[10px] tracking-[0.2em] uppercase text-[var(--parchment)]/50"
          >
            Scroll
          </motion.div>
        </div>
      </section>

      {/* SIGNAL LOG / STATS */}
      <section className="max-w-6xl mx-auto px-6 md:px-10 py-24 md:py-32">
        <Reveal>
          <p className="eyebrow mb-4">Field log</p>
          <p className="font-display text-2xl md:text-3xl max-w-2xl text-balance leading-snug mb-14">
            {bio}
          </p>
        </Reveal>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[var(--cream-line)] rounded-2xl overflow-hidden border border-[var(--cream-line)]">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08}>
              <div className="bg-[var(--parchment)] p-6 md:p-8 h-full">
                <p className="font-display text-3xl md:text-4xl text-[var(--sienna-deep)]">{s.value}</p>
                <p className="text-sm text-[var(--ink-soft)] mt-2 leading-snug">{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* FEATURED PROJECTS */}
      <section className="max-w-6xl mx-auto px-6 md:px-10 pb-24 md:pb-32">
        <Reveal>
          <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
            <div>
              <p className="eyebrow mb-4">Selected systems</p>
              <h2 className="font-display text-4xl md:text-5xl">Things I&apos;ve built.</h2>
            </div>
            <Link
              href="/projects"
              data-cursor-hover
              className="underline-swipe font-medium text-[var(--sienna-deep)] flex items-center gap-1.5"
            >
              View all projects <ArrowRight size={15} />
            </Link>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-1 gap-6">
          {featured.map((project, i) => (
            <ProjectCard key={project.slug} project={project} index={i} />
          ))}
        </div>
      </section>
    </div>
  );
}
